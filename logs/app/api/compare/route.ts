//C:\Users\sven.tan.YWLSG217\Desktop\SYSLOG\logs\app\drive\file-grid.tsx
import { NextRequest, NextResponse } from "next/server"
import { db2 } from "@/lib/db2"
import { serializeBigInts } from "./serialize"


export async function POST(req: NextRequest) {
  const body = await req.json()
  const { embedding } = body

  if (!embedding || !Array.isArray(embedding)) {
    return NextResponse.json({ error: "Invalid embedding vector" }, { status: 400 })
  }

  console.log("Received embedding vector:", embedding.slice(0, 5), "...")

type DbResult = { id: number; name: string; score: number }[]
const results = await db2.$queryRawUnsafe<DbResult>(
  `
  SELECT id, name, 1 - (embedding <#> $1::vector) AS score
  FROM items
  WHERE name IS NOT NULL
  ORDER BY score DESC
  LIMIT 10;
  `,
  embedding
)

  

const serialized = serializeBigInts(results)
  return NextResponse.json({ results: serialized })
}
