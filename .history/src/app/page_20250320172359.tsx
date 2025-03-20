import { fetchBigQueryData } from "@/components/server/DataTableServer";
import { DataTableClient } from "@/components/client/DataTableClient";

export default async function HomePage() {
  const initialData = await fetchBigQueryData();

  return (
    <div>
      <h1>BigQuery Data Explorer</h1>
      <DataTableClient initialData={initialData} />
    </div>
  );
}
