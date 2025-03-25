import { DataExplorerClient } from "@/components/client/DataExplorerClient";

export default async function DataExplorerPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TULU Data Explorer</h1>
      <DataExplorerClient />
    </div>
  );
}
