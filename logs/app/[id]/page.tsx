/**
 * Logs Unauthorized Access Attempts and Renders Warning Message
 * 
 * This Next.js server component is triggered when accessing a route with parameters (e.g., `/log-bot/[id]`).
 * It performs the following tasks:
 * 
 * 1. **Logs Unauthorized Actions:**
 *    - The component logs unauthorized access attempts to the `message` table for auditing purposes.
 *    - The log entry includes:
 *      - A timestamp of when the action occurred.
 *      - The user’s IP address (normalized to handle both IPv4 and IPv6-mapped IPv4).
 *      - The URL parameter (`id` in this case).
 *    - This log serves as an audit trail for any unauthorized or bot-like behavior.
 * 
 * 2. **Renders Warning Message:**
 *    - A generic warning message is shown to the user indicating that their action is being recorded.
 *    - This message can be customized or extended for more detailed alerts.
 * 
 * **Usage Example:**
 * - If a user or bot accesses an unauthorized route, the system logs the attempt and displays the message: 
 *   `"Invalid action, your action will be recorded"`.
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
