// Copying wci library files to the uploads directory
import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { logActivity } from "@/lib/activity-logger"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/app/login/auth"

export async function POST(request: NextRequest) {
  try {

    // Get form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File
    const entryId = Number.parseInt(formData.get("entryId") as string)

    // Validate the request
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!entryId) {
      return NextResponse.json({ success: false, error: "No library entry ID provided" }, { status: 400 })
    }

    const user = await getCurrentUser()

    if (!user || user.role.includes("admin")) {
      return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads", "library")
    await mkdir(uploadsDir, { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file with entry ID in filename
    const filename = `library_${entryId}_${Date.now()}.pdf`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    // Generate URL for the file
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const fileUrl = `${baseUrl}/api/library-document/${entryId}`

    // Update library entry with attachment URL
    await db.libraryEntry.update({
      where: { id: entryId },
      data: {
        attachmentUrl: fileUrl,
        attachmentFilename: filename,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Uploaded Library Document",
      targetType: "LibraryEntry",
      targetId: entryId,
      details: "Uploaded document for library entry",
    })

    return NextResponse.json({
      success: true,
      url: fileUrl,
    })
  } catch (error) {
    console.error("Error uploading library document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

