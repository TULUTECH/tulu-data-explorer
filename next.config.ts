import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  env: {
    BIGQUERY_PROJECT_ID: process.env.BIGQUERY_PROJECT_ID,
    BIGQUERY_CLIENT_EMAIL: process.env.BIGQUERY_CLIENT_EMAIL,
    BIGQUERY_PRIVATE_KEY: process.env.BIGQUERY_PRIVATE_KEY,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. You should run type-checking
    // separately (e.g., `npm run type-check`) as part of your CI/local workflow.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },  
};

export default nextConfig;