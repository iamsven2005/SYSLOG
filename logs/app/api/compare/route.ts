import { NextRequest, NextResponse } from "next/server"
import { db2 } from "@/lib/db2"
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

type Serializable = JSONValue | bigint | { [key: string]: Serializable } | Serializable[]

export function serializeBigInts(obj: Serializable): JSONValue {
  if (Array.isArray(obj)) {
    return obj.map((item) => serializeBigInts(item))
  } else if (typeof obj === "bigint") {
    return obj.toString()
  } else if (obj !== null && typeof obj === "object") {
    const result: { [key: string]: JSONValue } = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInts(value as Serializable)
    }
    return result
  } else {
    return obj
  }
}


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
