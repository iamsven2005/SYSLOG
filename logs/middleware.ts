/*
 * middleware.ts - 2025-05-13 by Tan
 *
 * Purpose:
 *   This middleware runs on every request and captures key metadata such as IP address and access path.
 *   It is primarily used for detecting suspicious or unauthorized bot access (e.g., scanning for WordPress endpoints),
 *   and routing or logging such activities accordingly.
 *
 * Version History:
 * v1.0 - 2025-05-13 by Tan:
 *   - Initial implementation of Next.js middleware for bot scan logging.
 *   - Extracts IP address from `x-forwarded-for` or `x-real-ip` headers.
 *   - Captures the requested pathname for pattern matching (e.g., `/wp-login.php`, `/xmlrpc.php`).
 *   - Routes bot scans to `/scan/[path]` with the path as parameter.
 *
 * Functionality:
 * - Intercepts all HTTP requests before they reach the handler.
 * - Checks if the pathname resembles common WordPress or bot scanning paths.
 * - Redirects to `/scan/[path]` for further processing and logging (e.g., by the bot logging API route).
 *
 * Example:
 * A request to `/wp-login.php` will be internally redirected to `/scan/wp-login.php`.
 *
 * Tech Stack:
 * - Next.js middleware API (App Router compatible)
 *
 * Notes:
 * - Make sure the `/scan/[id]` route exists and implements logging logic.
 * - Avoid triggering this redirect for legitimate frontend/admin routes.
 */


import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value
  const path = request.nextUrl.pathname
  if (request.nextUrl.pathname.startsWith("/api/socket")) {
    return NextResponse.next()
  }
  // If no user is logged in and trying to access protected routes
  if (
    !userId &&
    path !== "/" &&
    path !== "/login" &&
    !path.startsWith("/scripts/") &&
    ![
      "/latest_script.sh",
      "/install.sh",
      "/script.sh",
      "/pid.py",
      "/auth-log.py",
      "/scan.py",
      "/disk.py",
      "/sensors.py"
    ].includes(path)
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For admin-only routes
  if (userId && (path.startsWith("/logs") || path.startsWith("/command-matches"))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}