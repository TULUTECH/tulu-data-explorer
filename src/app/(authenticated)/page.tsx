import { DataExplorerClient } from "@/components/client/DataExplorerClient";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/helpers/dataParsing";

// Simulate API call
async function fetchOmpData() {
  // TODO: use a real API call according to the logged-in user
  return parseOmpDataTypes(rawDataJson);
}

export default async function DataExplorerPage() {
  const initialData = await fetchOmpData();

  return (
    <div className="container max-w-[100000px] mx-auto p-4">
      <DataExplorerClient initialData={initialData} />
    </div>
  );
}
