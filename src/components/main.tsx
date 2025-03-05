"use client";
import { useState } from "react";
import { readCSV } from "@/actions";

interface DataItem {
  created_at: string;
  filename: string;
}

const options = [
  {
    value: "created_at",
    label: "Sort by created at ascendent",
  },
  {
    value: "filename_asc",
    label: "Sort by filename ascendent",
  },
  {
    value: "filename_desc",
    label: "Sort by filename descendent",
  },
];

const Main = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const onChange = async (option: string) => {
    setLoading(true);
    try {
      const response = await readCSV(option);
      setData(response);
    } catch (error) {
      console.log("error", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md mb-8">
        <select
          onChange={(e) => onChange(e.target.value)}
          className="block w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled selected>
            Select an option
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {!loading &&
          data.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{card.created_at}</h2>
              <p className="text-gray-600">{card.filename}</p>
            </div>
          ))}
        {loading && <p className="text-center text-gray-600">Please wait...</p>}
      </div>
    </div>
  );
};

export { Main };
