import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

const extractParts = (str) => {
  if (!str) return [];
  return (
    str.match(/\d+|\D+/g)?.map((part) => (isNaN(part) ? part : Number(part))) ||
    []
  );
};

const naturalSort = (a, b) => {
  const aParts = extractParts(a);
  const bParts = extractParts(b);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    if (aParts[i] === undefined) return -1;
    if (bParts[i] === undefined) return 1;
    if (aParts[i] !== bParts[i]) return aParts[i] > bParts[i] ? 1 : -1;
  }

  return 0;
};

const readCSV = () => {
  const filePath = path.join(process.cwd(), "public/data.csv");

  if (!fs.existsSync(filePath)) {
    console.error("CSV file not found:", filePath);
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsedData = Papa.parse(fileContent, {
    header: false,
    skipEmptyLines: true,
  }).data;

  return parsedData.map((row) => ({
    created_at: row[0], // First column
    filename: row[1], // Second column
  }));
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sortBy");

  let files = readCSV();

  files = files.filter((file) => file.filename);

  // Apply sorting logic
  if (sortBy === "created_at") {
    files.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortBy === "filename_asc") {
    files.sort((a, b) => naturalSort(a.filename, b.filename));
  } else if (sortBy === "filename_desc") {
    files.sort((a, b) => naturalSort(b.filename, a.filename));
  }

  return NextResponse.json(files);
}
