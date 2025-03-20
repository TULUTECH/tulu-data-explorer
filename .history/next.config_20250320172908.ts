import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BIGQUERY_PROJECT_ID: process.env.BIGQUERY_PROJECT_ID,
    BIGQUERY_CLIENT_EMAIL: process.env.BIGQUERY_CLIENT_EMAIL,
    BIGQUERY_PRIVATE_KEY: process.env.BIGQUERY_PRIVATE_KEY,
  }
};

module.exports = nextConfig;