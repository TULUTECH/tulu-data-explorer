import { DataExplorerClient } from "@/components/client/DataExplorerClient";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/helpers/dataParsing";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

//Simulate API call
async function fetchOmpData() {
  // In the future, replace this with:
  // const response = await fetch('your-api-endpoint');
  // const data = await response.json();

  return parseOmpDataTypes(rawDataJson);
}

export default async function DataExplorerPage() {
  // Check authentication on the server
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Fetch data on the server
  const initialData = await fetchOmpData();

  return (
    <div className="container mx-auto p-4">
      <DataExplorerClient initialData={initialData} />
    </div>
  );
}
