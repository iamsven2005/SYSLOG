"use server"

import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { NextRequest } from "next/server"
import { notFound } from "next/navigation"

interface LoginCredentials {
  username: string
  password: string
}

export async function loginUser({ username, password }: LoginCredentials) {
  try {
    // Find the user by username
    const user = await db.user.findUnique({
      where: { username },
    })
    await db.message.create({
      data:{
        groupId:1,
        senderId:1,
        content: `Portal Login Failure for ${user?.username}`
      }
    })
    // If user not found or password doesn't match
    if (!user || user.password !== password) {
      return { success: false, message: "Invalid username or password" }
    }

    // Set a session cookie with the user ID
    (await cookies()).set("userId", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return success with role information
    return {
      success: true,
      userId: user.id,
      username: user.username,
      role: user.role,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logoutUser(req: NextRequest) {
  try {
    // Clear the session cookie
    req.cookies.delete("userId")

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "An error occurred during logout" }
  }
}

export async function getCurrentUser(req?: NextRequest) {
  try {
    const userId = req?.cookies.get("userId")?.value

    if (!userId) {
      return null
    }

    const user = await db.user.findUnique({
      where: { id: Number.parseInt(userId) }
    })

    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function getId(req?: NextRequest) {
  try {
    const userId = req?.cookies.get("userId")?.value
    if (!userId) {
      return 0
    }
    return Number(userId)
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}