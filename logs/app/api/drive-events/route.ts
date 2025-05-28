//C:\Users\sven.tan.YWLSG217\Desktop\SYSLOG\logs\app\drive\file-grid.tsx
import { NextRequest } from "next/server"
import { addClient, broadcastChange, createSSEStream } from "./driveEvents"

export async function GET(req: NextRequest) {
  const { readable, push } = createSSEStream()

  const removeClient = addClient(push)

  req.signal.addEventListener("abort", removeClient)

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  broadcastChange(data)
  return new Response("OK")
}
