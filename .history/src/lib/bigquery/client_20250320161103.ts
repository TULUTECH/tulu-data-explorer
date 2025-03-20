import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
  const { BIGQUERY_PROJECT_ID, BIGQUERY_CLIENT_EMAIL, BIGQUERY_PRIVATE_KEY } = process.env;
  if (!BIGQUERY_PROJECT_ID || !BIGQUERY_CLIENT_EMAIL || !BIGQUERY_PRIVATE_KEY) {
    throw new Error("Missing required BigQuery environment variables.");
  }

  const bigquery = new BigQuery({
    projectId: BIGQUERY_PROJECT_ID,
    credentials: {
      client_email: BIGQUERY_CLIENT_EMAIL,
      private_key: BIGQUERY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });
  return bigquery;
}
