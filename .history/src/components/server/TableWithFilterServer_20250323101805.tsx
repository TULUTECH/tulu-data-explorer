import TableWithFilter from "@/components/client/TableWithFilterClient";

async function fetchData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/bigquery_normalized_omp_data.json`
  );
  return await res.json();
}

export default async function Home() {
  const data = await fetchData();

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Data Visualization MVP</h1>
      <TableWithFilter data={data} />
    </main>
  );
}
