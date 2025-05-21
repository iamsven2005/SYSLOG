import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {

  try {
    const session = await getSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const filename = (await params).filename
    if (!filename) {
      return new NextResponse("Invalid filename", { status: 400 })
    }

    const groupIdMatch = filename.match(/^chat_(\d+)_/)
    if (!groupIdMatch) {
      return new NextResponse("Invalid file format", { status: 400 })
    }

    const groupId = Number(groupIdMatch[1])
    const userId = Number(session.user.id)

    const isMember = await db.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    })

    if (!isMember) {
      return new NextResponse("You don't have permission to access this file", { status: 403 })
    }

    const message = await db.message.findFirst({
      where: { fileAttachment: filename },
      select: { fileOriginalName: true, fileType: true },
    })

    const filePath = path.join(process.cwd(), "uploads", "chat", filename)

    try {
      await fs.access(filePath)
    } catch (error) {
      console.log(error)
      return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = await fs.readFile(filePath)

    let contentType = "application/octet-stream"
    if (message?.fileType) contentType = message.fileType
    else if (filename.endsWith(".pdf")) contentType = "application/pdf"
    else if (filename.match(/\.(jpe?g)$/)) contentType = "image/jpeg"
    else if (filename.endsWith(".png")) contentType = "image/png"
    else if (filename.endsWith(".gif")) contentType = "image/gif"
    else if (filename.endsWith(".doc") || filename.endsWith(".docx"))
      contentType = "application/msword"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${message?.fileOriginalName || filename}"`,
      },
    })
  } catch (error) {
    console.error("Error serving chat document:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
