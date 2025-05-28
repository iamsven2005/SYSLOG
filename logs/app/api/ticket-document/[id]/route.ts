//ticket download a specific ticket attachment by ID
import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Get attachment info from database
    const attachment = await db.ticketAttachment.findUnique({
      where: { id },
      include: {
        ticket: {
          select: {
            id: true,
          },
        },
        comment: {
          select: {
            ticketId: true,
          },
        },
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    // Read file from disk
    const filePath = join(process.cwd(), "uploads", "tickets", attachment.filename)
    const fileBuffer = await readFile(filePath)

    // Set appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", attachment.mimeType || "application/octet-stream")
    headers.set("Content-Disposition", `inline; filename="${attachment.originalFilename}"`)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error retrieving file:", error)
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 })
  }
}

