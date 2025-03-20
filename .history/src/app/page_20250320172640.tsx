import { fetchBigQueryData } from "@/components/server/DataTableServer";
import { DataTableClient } from "@/components/client/DataTableClient";
import { CampaignData } from "@/types/bigquery";

export default async function DataExplorerPage() {
  const initialData: CampaignData[] = await fetchBigQueryData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BigQuery Data Explorer</h1>
      <DataTableClient initialData={initialData} />
    </div>
  );
}
