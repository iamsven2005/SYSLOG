import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/app/login/auth"

export async function POST(request: NextRequest) {
  try {


    // Add error handling for JSON parsing
    let matchIds, notes
    try {
      const body = await request.json()
      matchIds = body.matchIds
      notes = body.notes
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (!Array.isArray(matchIds) || matchIds.length === 0) {
      return NextResponse.json({ error: "No match IDs provided" }, { status: 400 })
    }

    // Update all the specified matches
    const user = await getCurrentUser()
    if (!user) notFound()
    const userId = user.id
    const result = await db.commandMatch.updateMany({
      where: {
        id: {
          in: matchIds,
        },
        addressed: false, // Only update unaddressed matches
      },
      data: {
        addressed: true,
        addressedBy: userId,
        addressedAt: new Date(),
        notes: notes || "Bulk addressed by user",
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Command Matches Addressed",
      targetType: "CommandMatch",
      targetId: 0,
      details: `Marked ${result.count} command matches as addressed`,
    })

    return NextResponse.json({ success: true, count: result.count })
  } catch (error) {
    console.error("Error bulk addressing command matches:", error)
    return NextResponse.json({ error: "Failed to address command matches" }, { status: 500 })
  }
}

