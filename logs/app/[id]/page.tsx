/*
 * Record invalid access attempts to group 1 as log messages for audit trail.
 * Log includes timestamp, user IP address (with IPv6-mapped IPv4 normalized), and URL param.
 */

import { db } from "@/lib/db"
import { headers } from "next/headers"

/**
 * Page - A Next.js server component that logs unauthorized actions and renders a warning message.
 * 
 * Usage:
 * - Triggered when accessed with a route param (e.g. /log-bot/[id]).
 * - Logs a message to the `message` table for audit trail purposes.
 */
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const headersList = await headers()

  // Normalize IP address: handles both IPv4 and IPv6-mapped IPv4
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim().replace(/^::ffff:/, "") ||
    headersList.get("x-real-ip")?.replace(/^::ffff:/, "") ||
    "unknown"

  const timestamp = new Date()

  // Create a message record for invalid action
  await db.message.create({
    data: {
      groupId: 1,
      senderId: 1,
      content: `WP bot scan at ${timestamp.toISOString()} from IP ${ip} with path ${params.id}`,
    },
  })

  // Render a generic warning message to the user
  return (
    <div>
      Invalid action, your action will be recorded
    </div>
  )
}
