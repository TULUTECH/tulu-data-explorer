import { queryBigQuery } from "@/lib/bigquery/client";
import { NormalizedDataFields } from "@/types/bigquery";

export async function fetchBigQueryData(query: string): Promise<NormalizedDataFields[]> {
    const data = await queryBigQuery<NormalizedDataFields>(query);
}