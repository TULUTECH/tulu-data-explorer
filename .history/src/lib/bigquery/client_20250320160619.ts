import { BigQuery } from "@google-cloud/bigquery";

export function createBigQueryClient() {
  const bigquery = new BigQuery(.env.BIGQUERY_PROJECT_ID,
    Credential: {
      client_email: process.env.BIGQUERY_CLIENT_EMAIL,
      private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }
  });
  return bigquery;
}