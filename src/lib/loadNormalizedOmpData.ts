import fs from "fs";
import path from "path";
import { gunzipSync } from "zlib";

type RawOmpRecord = Record<string, unknown>;

let cachedData: RawOmpRecord[] | null = null;

const jsonPath = path.join(process.cwd(), "src/data/normalized_omp_data.json");
const gzipPath = `${jsonPath}.gz`;

function readDataBuffer(): Buffer {
  if (fs.existsSync(jsonPath)) {
    return fs.readFileSync(jsonPath);
  }

  if (fs.existsSync(gzipPath)) {
    const compressed = fs.readFileSync(gzipPath);
    return gunzipSync(compressed);
  }

  throw new Error(
    "Normalized OMP data not found. Provide src/data/normalized_omp_data.json or its .gz companion.",
  );
}

export function loadNormalizedOmpData(): RawOmpRecord[] {
  if (cachedData) {
    return cachedData;
  }

  const dataBuffer = readDataBuffer();
  cachedData = JSON.parse(dataBuffer.toString("utf-8"));
  return cachedData;
}
