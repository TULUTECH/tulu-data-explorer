import { DataExplorerClient } from "@/components/client/DataExplorerClient";
import { loadNormalizedOmpData } from "@/lib/loadNormalizedOmpData";
import { parseOmpDataTypes } from "@/helpers/dataParsing";

// Simulate API call
async function fetchOmpData() {
  // TODO: use a real API call according to the logged-in user
  const rawData = loadNormalizedOmpData();
  return parseOmpDataTypes(rawData);
}

export default async function DataExplorerPage() {
  const initialData = await fetchOmpData();

  return (
    <div className="container max-w-[100000px] mx-auto p-4">
      <DataExplorerClient initialData={initialData} />
    </div>
  );
}
