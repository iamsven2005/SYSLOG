/**
 * notification-actions.ts - 2025-05-25 by sven.tan
 *
 * Provides server-side functions for managing notifications including creation, updating, reading, and deletion.
 *
 * Functionality:
 * - **getNotifications**: Fetches notifications for the current user with details on whether they have been read.
 * - **markNotificationAsRead**: Marks a specific notification as read for the current user and triggers path revalidation.
 * - **createNotification**: Allows an admin to create a new notification with optional expiry and importance flags.
 * - **updateNotification**: Allows an admin to update an existing notification.
 * - **deleteNotification**: Deletes a notification if the user has admin privileges.
 * - **getAllNotificationsAdmin**: Fetches all notifications for admin users, including read counts.
 *
 * Usage:
 * - These functions are used to manage notifications across the application, allowing users to view, mark, create, and delete notifications.
 * - Admin users are granted additional privileges to create, update, and delete notifications.
 * 
 * Limitations:
 * - Requires the user to be authenticated for all operations. If the user is not authenticated or lacks the necessary role, an error is thrown.
 * - Admin-only operations ensure that only users with an "admin" role can create, update, or delete notifications.
 *
 * Improvements:
 * - Could optimize the read/unread state tracking by implementing more efficient querying for large datasets.
 * - More granular error handling could be added for specific cases (e.g., invalid input during update or create operations).
 */

"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/app/login/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    const notifications = await db.notification.findMany({
      orderBy: {
        postDate: "desc",
      },
      include: {
        reads: {
          where: {
            userId: user.id,
          },
        },
      },
    })

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      postDate: notification.postDate,
      expiryDate: notification.expiryDate,
      important: notification.important,
      read: notification.reads.length > 0,
    }))
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if already read
    const existingRead = await db.notificationRead.findUnique({
      where: {
        notificationId_userId: {
          notificationId,
          userId: user.id,
        },
      },
    })

    if (!existingRead) {
      await db.notificationRead.create({
        data: {
          notificationId,
          userId: user.id,
        },
      })
    }

    revalidatePath("/notifications")
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function createNotification(data: {
  title: string
  content: string
  expiryDate?: Date | null
  important: boolean
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    if (!user?.role?.some(role => role.toLowerCase().includes("admin"))) {
      throw new Error("Not authorized")
    }

    const notification = await db.notification.create({
      data: {
        title: data.title,
        content: data.content,
        expiryDate: data.expiryDate,
        important: data.important,
        createdBy: user.id,
      },
    })

    revalidatePath("/admin/notifications")
    return { success: true, notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function updateNotification(
  id: number,
  data: {
    title: string
    content: string
    expiryDate?: Date | null
    important: boolean
  },
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    if (!user?.role?.some(role => role.toLowerCase().includes("admin"))) {
      throw new Error("Not authorized")
    }

    const notification = await db.notification.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        expiryDate: data.expiryDate,
        important: data.important,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/admin/notifications")
    return { success: true, notification }
  } catch (error) {
    console.error("Error updating notification:", error)
    throw error
  }
}

export async function deleteNotification(id: number) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    if (!user?.role?.some(role => role.toLowerCase().includes("admin"))) {
      throw new Error("Not authorized")
    }

    await db.notification.delete({
      where: { id },
    })

    revalidatePath("/admin/notifications")
    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

export async function getAllNotificationsAdmin() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    if (!user?.role?.some(role => role.toLowerCase().includes("admin"))) {

      throw new Error("Not authorized")
    }

    const notifications = await db.notification.findMany({
      orderBy: {
        postDate: "desc",
      },
      include: {
        reads: {
          select: {
            userId: true,
          },
        },
      },
    })

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      postDate: notification.postDate,
      expiryDate: notification.expiryDate,
      important: notification.important,
      readCount: notification.reads.length,
    }))
  } catch (error) {
    console.error("Error fetching admin notifications:", error)
    throw error
  }
}

