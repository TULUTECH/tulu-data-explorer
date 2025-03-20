import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
    const { BIGQUERY_PROJECT_ID, BIGQUERY_CLIENT_EMAIL, BIGQUERY_PRIVATE_KEY } = process.env;
     if (!BIGQUERY_PROJECT_ID || !BIGQUERY_CLIENT_EMAIL || !BIGQUERY_PRIVATE_KEY) {
       throw new Error("Missing required BigQuery environment variables.");
     }
  const bigquery = new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID,
    credentials: {
      client_email: process.env.BIGQUERY_CLIENT_EMAIL,
      private_key: process.env.BIGQUERY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });
  return bigquery;
}
