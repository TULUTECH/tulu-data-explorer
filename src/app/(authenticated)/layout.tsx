import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on the server
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex-grow">{children}</main>
      </Suspense>
    </div>
  );
}
