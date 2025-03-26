import { DataExplorerClient } from "@/components/client/DataExplorerClient";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/utils/parseNormalizedOmpData";

// This function simulates an API call but currently returns local data
// In the future, you can replace this with an actual API call
async function fetchOmpData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In the future, replace this with:
  // const response = await fetch('your-api-endpoint');
  // const data = await response.json();

  return parseOmpDataTypes(rawDataJson);
}

export default async function DataExplorerPage() {
  // Fetch data on the server
  const initialData = await fetchOmpData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TULU Data Explorer</h1>
      <DataExplorerClient initialData={initialData} />
    </div>
  );
}
