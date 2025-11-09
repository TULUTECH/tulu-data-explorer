"use client";

// import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  // const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Data Explorer
        </Link>

        {/* {session && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Signed in as: {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
        )} */}
      </div>
    </nav>
  );
}
