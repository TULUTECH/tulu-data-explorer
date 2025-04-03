import { DataExplorerClient } from "@/components/client/DataExplorerClient";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/helpers/dataParsing";

// Simulate API call
async function fetchOmpData() {
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
      <DataExplorerClient initialData={initialData} />
    </div>
  );
}
