import { queryBigQuery } from "@/lib/bigquery/client";
import { NormalizedDataFields } from "@/types/bigquery";

export async function fetchBigQueryData(): Promise<NormalizedDataFields[]> {
    const query = `
        SELECT campaign_id, campaign_name, ad_group_id, ad_group_name, date, cost_micros, impressions, clicks, sessions, leads, revenue
        FROM \`tuluproject01.omp.data\`
}