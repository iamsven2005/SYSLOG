import { NextResponse } from "next/server"
import { getSession } from "@/lib/utils"
import { resolveAllAlertEvents } from "@/app/alerts/alert-actions"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get optional notes from request body
    const body = await request.json().catch(() => ({}))
    const notes = body.notes || "Bulk resolved via API"

    // Resolve all alerts
    const result = await resolveAllAlertEvents(notes)

    return NextResponse.json({
      success: true,
      message: `Successfully resolved ${result.count} alerts`,
      count: result.count,
    })
  } catch (error) {
    console.error("Error resolving all alerts:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to resolve all alerts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

