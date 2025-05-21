// lib/utils/serialize.ts

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

export type Serializable = JSONValue | bigint | { [key: string]: Serializable } | Serializable[]

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
