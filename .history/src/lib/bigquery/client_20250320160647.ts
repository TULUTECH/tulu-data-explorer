import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
    const bigquery = new BigQuery({
        projectId: process.env.BIGQUERY_PROJECT_ID,
        credentials: {
  });
  return bigquery;
}