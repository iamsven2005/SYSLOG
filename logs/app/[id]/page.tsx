
/*
 * bot-logger.tsx - 2025-05-13 by Tan
 * Purpose:
 *   Used to detect and log access to unexpected or invalid routes, commonly targeted by bot scanners (e.g., WordPress bots).
 *   Logs are stored in the database with a timestamp, IP address, and requested path for audit or alerting purposes.
 *
 * Functionality:
 * - Extracts the request's IP address from headers (`x-forwarded-for` or `x-real-ip`)
 * - Retrieves the current server-side timestamp
 * - Saves a message log into the `message` table with:
 *     • groupId = 1 (default group)
 *     • senderId = 1 (bot/system ID)
 *     • content = description of the bot scan, including timestamp, IP, and requested path
 *
 * Route Usage:
 * - Typically mounted at a catch-all dynamic route (e.g., `/scan/[id]`)
 * - Passive handler; does not return UI or perform a redirect
 *
 * Dependencies:
 * - `@/lib/db`: Prisma client connection
 * - `next/headers`: Used to get request headers in App Router
 *
 * Example:
 * A request to `/wp-login.php` from 203.0.113.2 will log:
 *   "WP bot scan at 2025-05-13T10:12:00.000Z from IP 203.0.113.2 with path wp-login.php"
 */

import { db } from "@/lib/db";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { id: string } }) {
  const headersList = headers();

  const ip =
    (await headersList).get("x-forwarded-for")?.split(",")[0].trim() || // proxy/IP header
    (await headersList).get("x-real-ip") ||
    "unknown";

  const timestamp = new Date(); // current server-side time

  await db.message.create({
    data: {
      groupId: 1,
      senderId: 1,
      content: `WP bot scan at ${timestamp.toISOString()} from IP ${ip} with path ${params.id}`,
    },
  });

  return null;
}
