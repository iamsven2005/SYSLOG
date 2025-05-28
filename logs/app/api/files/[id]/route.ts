//C:\Users\sven.tan.YWLSG217\Desktop\SYSLOG\logs\app\forms\[id]\responses\page.tsx
import fs from "fs"
import path from "path"
import { type NextRequest, NextResponse } from "next/server"
import { getAnswerWithFile } from "@/app/forms/[id]/actions"
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const answerId = Number.parseInt((await params).id)
    const answer = await getAnswerWithFile(answerId)

    if (!answer || !answer.fileUrl) {
      return new NextResponse("File not found", { status: 404 })
    }

    const fileUrl = answer.fileUrl // Now TypeScript knows this is a string
    const filename = path.basename(fileUrl)

    const filePath = path.join(
      process.cwd(),
      filename.startsWith("/") ? filename.substring(1) : filename
    )

    console.log("Looking for file at:", filePath)

    if (!fs.existsSync(filePath)) {
      const altPath = path.join(process.cwd(), "uploads", filename)
      console.log("File not found, trying alternative path:", altPath)

      if (!fs.existsSync(altPath)) {
        return new NextResponse(`File not found at ${filePath} or ${altPath}`, { status: 404 })
      }

      return serveFile(altPath, filename)
    }

    return serveFile(filePath, filename)

    // ✅ Serve file with proper headers
    function serveFile(filepath: string, originalFilename: string) {
      const fileBuffer = fs.readFileSync(filepath)
      const fileExt = path.extname(filepath).toLowerCase()

      let contentType = "application/octet-stream"
      if (fileExt === ".pdf") contentType = "application/pdf"
      else if (fileExt === ".jpg" || fileExt === ".jpeg") contentType = "image/jpeg"
      else if (fileExt === ".png") contentType = "image/png"
      else if (fileExt === ".txt") contentType = "text/plain"

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${originalFilename}"`,
        },
      })
    }
  } catch (error) {
    console.error("Error retrieving file:", error)
    return new NextResponse(
      "Internal Server Error: " + (error instanceof Error ? error.message : String(error)),
      { status: 500 }
    )
  }
}
