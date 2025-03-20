import { queryBigQuery } from "@/lib/bigquery/client";
import { NormalizedDataFields } from "@/types/bigquery";

export async function fetchBigQueryData(): Promise<NormalizedDataFields[]> {
  const query = `
        SELECT campaign_id, campaign_name, ad_group_id, ad_group_name, date, cost_micros, impressions, clicks, sessions, leads, revenue
        FROM \`tuluproject01.om_proptech_dataset.omp_normalized\`
        `;

//   try {
//     return await queryBigQuery<NormalizedDataFields>(query);
//   } catch (error) {
//     // Detailed logging
//     console.error("BigQuery Data Fetch Error:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       query: query,
//       timestamp: new Date().toISOString(),
//     });

//     // Throw a more specific error
//     throw new Error("Failed to fetch campaign data. Please try again later.");
//   }
}
