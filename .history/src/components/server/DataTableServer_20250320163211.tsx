import { queryBigQuery } from "@/lib/bigquery/client";
import { DataRow } from "@/types/bigquery";

export async function fetchServerData(): Promise<DataRow[]> {
  const query = `
    SELECT id, name, value 
    FROM \`your-project.your_dataset.your_table\`
    LIMIT 1000
  `;

  try {
    return await queryBigQuery<DataRow>(query);
  } catch (error) {
    console.error("Data fetching error:", error);
    return [];
  }
}
