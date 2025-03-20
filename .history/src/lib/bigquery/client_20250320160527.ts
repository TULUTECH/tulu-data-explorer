import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
  const bigquery = new BigQuery();
  return bigquery;
}