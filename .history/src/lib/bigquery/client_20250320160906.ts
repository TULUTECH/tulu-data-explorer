import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
  const bigquery = new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID,
    credentials: {
        client_email: process.env.BIGQUERY_CLIENT_EMAIL,
        if (!process.env.BIGQUERY_PRIVATE_KEY) {
  throw new Error("BIGQUERY_PRIVATE_KEY is not defined in the environment");
}
private_key: process.env.BIGQUERY_PRIVATE_KEY.replace(/\\n/g, "\n"),
      private_key: process.env.BIGQUERY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });
  return bigquery;
}
