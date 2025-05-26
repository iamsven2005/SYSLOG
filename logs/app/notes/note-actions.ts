/**
 * note-actions.ts - 2025-05-25 by sven.tan
 *
 * Provides various functions for managing notes, including retrieving, creating, updating, and deleting notes.
 * It includes pagination and search support for retrieving notes, along with activity logging for each action.
 *
 * Functionality:
 * - **getNotes**: Retrieves a list of notes with support for search, pagination, and sorting by creation time.
 * - **getNote**: Fetches a specific note by its ID.
 * - **createNote**: Creates a new note with a title and description, logging the activity after creation.
 * - **updateNote**: Updates an existing note's title and description, logging the activity after update.
 * - **deleteNote**: Deletes a note by its ID, logging the activity after deletion.
 * - **deleteMultipleNotes**: Deletes multiple notes based on an array of IDs, logging each deletion activity.
 *
 * Usage:
 * - Use `getNotes` and `getNote` to retrieve notes from the database.
 * - Use `createNote` and `updateNote` to create and modify notes, respectively.
 * - Use `deleteNote` and `deleteMultipleNotes` to delete one or more notes at a time.
 * - Activity logs are automatically recorded for each CRUD operation to track user actions.
 *
 * Limitations:
 * - The current implementation assumes all actions (create, update, delete) involve only the notes' title and description.
 * - Permissions for accessing or modifying notes are not handled at this level; this is assumed to be handled in the UI or middleware.
 * - Searching for notes only supports basic string matching in the title and description.
 *
 * Improvements:
 * - Implement more advanced filtering options (e.g., date-based filtering, tag-based filtering).
 * - Enhance search functionality with more robust full-text search capabilities.
 * - Consider adding an "undo" feature for delete actions, possibly with a soft delete approach.
 */

"use server"

import { db } from "@/lib/db"
import { logActivity } from "@/lib/activity-logger"
import { Prisma } from "@/prisma/generated/main"

interface GetNotesParams {
  search?: string
  page?: number
  pageSize?: number
}

export async function getNotes({ search = "", page = 1, pageSize = 10 }: GetNotesParams) {
  try {
    // Build where conditions
    const where: Prisma.notesWhereInput = {}

    // Add search condition if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalCount = await db.notes.count({ where })

    // Get notes with pagination
    const notes = await db.notes.findMany({
      where,
      orderBy: {
        time: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      notes,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
    }
  } catch (error) {
    console.error("Error fetching notes:", error)
    return null
  }
}

export async function getNote(id: number) {
  try {
    const note = await db.notes.findUnique({
      where: { id },
    })
    return note
  } catch (error) {
    console.error("Error fetching note:", error)
    return null
  }
}

interface NoteData {
  title: string
  description: string
}

export async function createNote(data: NoteData) {
  try {
    const note = await db.notes.create({
      data: {
        title: data.title,
        description: data.description,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Created Note",
      targetType: "Note",
      targetId: note.id,
      details: `Created note: ${data.title}`,
    })

    return { success: true, note }
  } catch (error) {
    console.error("Error creating note:", error)
    throw new Error("Failed to create note")
  }
}

interface UpdateNoteData extends NoteData {
  id: number
}

export async function updateNote(data: UpdateNoteData) {
  try {
    const note = await db.notes.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Updated Note",
      targetType: "Note",
      targetId: note.id,
      details: `Updated note: ${data.title}`,
    })

    return { success: true, note }
  } catch (error) {
    console.error("Error updating note:", error)
    throw new Error("Failed to update note")
  }
}

export async function deleteNote(id: number) {
  try {
    const note = await db.notes.findUnique({
      where: { id },
      select: { title: true },
    })

    await db.notes.delete({
      where: { id },
    })

    // Log the activity
    await logActivity({
      actionType: "Deleted Note",
      targetType: "Note",
      targetId: id,
      details: `Deleted note: ${note?.title || "Unknown"}`,
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    throw new Error("Failed to delete note")
  }
}

export async function deleteMultipleNotes(ids: number[]) {
  try {
    // Get note titles before deletion for logging
    const notes = await db.notes.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    await db.notes.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    // Log the activity for each deleted note
    for (const note of notes) {
      await logActivity({
        actionType: "Deleted Note",
        targetType: "Note",
        targetId: note.id,
        details: `Deleted note: ${note.title}`,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting notes:", error)
    throw new Error("Failed to delete notes")
  }
}

