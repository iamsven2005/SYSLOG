/**
 * reminder-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains server-side logic for handling reminders, including adding, updating, deleting, and fetching reminders.
 *   It ensures that reminders are associated with the current user and that the necessary validation checks are in place.
 *
 * Key Features:
 *   - **Add Reminder**: Allows users to create a new reminder.
 *   - **Update Reminder**: Allows users to update an existing reminder.
 *   - **Delete Reminder**: Allows users to delete a reminder.
 *   - **Get User Reminders**: Retrieves all reminders associated with the current user.
 *   - **Get Reminders by Date Range**: Fetches reminders within a specific date range.
 *   - **Get Reminder by ID**: Retrieves a specific reminder by its ID, ensuring it belongs to the current user.
 *   
 * Key Components:
 *   - `addReminder`: Adds a new reminder for the current user.
 *   - `updateReminder`: Updates an existing reminder for the current user.
 *   - `deleteReminder`: Deletes a reminder associated with the current user.
 *   - `getUserReminders`: Retrieves all reminders belonging to the current user.
 *   - `getRemindersByDateRange`: Retrieves reminders within a specific date range for the current user.
 *   - `getReminderById`: Fetches a reminder by its ID, checking user ownership.
 *
 * Example Usage:
 *   ```ts
 *   const newReminder = await addReminder({ title: "Meeting", date: new Date(), color: "#6366f1" })
 *   const reminders = await getUserReminders()
 *   ```
 *
 * Notes:
 *   - Each function includes user authentication by checking the current user's ID.
 *   - If the user is not authenticated, they will be redirected to the login page.
 *   - All reminders are associated with the current user, ensuring proper data security and access control.
 */
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUser } from "../login/auth"
import { redirect } from "next/navigation"

const reminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date(),
  description: z.string().optional(),
  color: z.string().optional(),
})

type ReminderFormValues = z.infer<typeof reminderFormSchema>

export async function addReminder(data: ReminderFormValues) {
  const validatedData = reminderFormSchema.parse(data)
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const result = await db.reminder.create({
    data: {
      title: validatedData.title,
      date: validatedData.date,
      description: validatedData.description,
      color: validatedData.color,
      user: { connect: { id: currentUser.id } },
    },
  })

  revalidatePath("/leave")

  return { success: true, reminder: result }
}

export async function updateReminder(id: number, data: ReminderFormValues) {
  const validatedData = reminderFormSchema.parse(data)
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  // Ensure the reminder belongs to the current user
  const reminder = await db.reminder.findFirst({
    where: {
      id,
      userId: currentUser.id,
    },
  })

  if (!reminder) {
    return { success: false, error: "Reminder not found or you don't have permission to edit it" }
  }

  const result = await db.reminder.update({
    where: { id },
    data: {
      title: validatedData.title,
      date: validatedData.date,
      description: validatedData.description,
      color: validatedData.color,
    },
  })

  revalidatePath("/leave")

  return { success: true, reminder: result }
}

export async function deleteReminder(id: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  // Ensure the reminder belongs to the current user
  const reminder = await db.reminder.findFirst({
    where: {
      id,
      userId: currentUser.id,
    },
  })

  if (!reminder) {
    return { success: false, error: "Reminder not found or you don't have permission to delete it" }
  }

  await db.reminder.delete({
    where: { id },
  })

  revalidatePath("/leave")

  return { success: true }
}

export async function getUserReminders() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const reminders = await db.reminder.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      date: "asc",
    },
  })

  return reminders
}

export async function getRemindersByDateRange(startDate: Date, endDate: Date) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const reminders = await db.reminder.findMany({
    where: {
      userId: currentUser.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return reminders
}

export async function getReminderById(id: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const reminder = await db.reminder.findFirst({
    where: {
      id,
      userId: currentUser.id,
    },
  })

  return reminder
}
