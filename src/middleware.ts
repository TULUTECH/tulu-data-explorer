// import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// withAuth disabled to allow open access while keeping middleware in place
export function middleware() {
  return NextResponse.next();
}

// Specify which routes should be protected
// export const config = {
//   matcher: ["/", "/dashboard/:path*"],
// };
