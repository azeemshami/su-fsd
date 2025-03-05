"use server";
const readCSV = async (sortBy: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/read-csv?sortBy=${sortBy}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    throw error;
  }
};

export { readCSV };
