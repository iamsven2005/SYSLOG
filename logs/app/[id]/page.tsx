import { db } from "@/lib/db"
import { headers } from "next/headers"


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const headersList = await headers()

const ip =
  headersList.get("x-forwarded-for")?.split(",")[0].trim().replace(/^::ffff:/, "") ||
  headersList.get("x-real-ip")?.replace(/^::ffff:/, "") ||
  "unknown"

  const timestamp = new Date()

  await db.message.create({
    data: {
      groupId: 1,
      senderId: 1,
      content: `WP bot scan at ${timestamp.toISOString()} from IP ${ip} with path ${params.id}`,
    },
  })

  return null
}
