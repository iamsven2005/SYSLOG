"use server"
import { cookies } from "next/headers"

export async function getSession() {
  const userId = (await cookies()).get("userId")?.value

  if (!userId) {
    return null
  }

  return {
    user: {
      id: Number.parseInt(userId),
    },
  }
}