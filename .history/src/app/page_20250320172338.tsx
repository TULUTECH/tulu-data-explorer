import { fetchBigQueryData } from "@/components/server/DataTableServer";
import { DataTableClient } from "@/components/client/DataTableClient";

export default async function DataPage() {
  const initialData = await fetchServerData();

  return (
    <div>
      <h1>BigQuery Data Explorer</h1>
      <DataTableClient initialData={initialData} />
    </div>
  );
}
