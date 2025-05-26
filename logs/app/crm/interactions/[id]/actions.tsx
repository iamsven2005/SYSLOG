/*
 * crm/actions/interactions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server-side functions for handling CRM interactions in the database.
 *   Supports querying, retrieving, and creating interaction records linked to
 *   projects, companies, and contacts.
 *
 * Functions:
 *   - getInteractions(filter): Retrieve a list of interactions with optional filtering by projectId or companyId.
 *   - getInteraction(id): Retrieve a single interaction by its ID, including related entities.
 *   - createInteraction(data): Create a new interaction and trigger path revalidation for relevant entities.
 *
 * Notes:
 *   - Uses Prisma client (`db`) for database operations.
 *   - Applies `revalidatePath` to ensure UI updates for related paths after mutation.
 */

"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache"

export async function getInteractions(filter?: { projectId?: number; companyId?: number }) {
  try {
    const where = {
      ...(filter?.projectId ? { projectId: filter.projectId } : {}),
      ...(filter?.companyId ? { companyId: filter.companyId } : {}),
    }

    const interactions = await db.cRMInteraction.findMany({
      where,
      include: {
        company: true,
        contact: true,
        project: true,
      },
      orderBy: { interactionDate: "desc" },
    })

    return { interactions }
  } catch (error) {
    console.error("Failed to fetch interactions:", error)
    return { error: "Failed to fetch interactions" }
  }
}

export async function getInteraction(id: number) {
  try {
    const interaction = await db.cRMInteraction.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        project: true,
      },
    })

    if (!interaction) {
      return { error: "Interaction not found" }
    }

    return { interaction }
  } catch (error) {
    console.error("Failed to fetch interaction:", error)
    return { error: "Failed to fetch interaction" }
  }
}

export async function createInteraction(data: {
  title: string
  notes?: string
  interactionType: string
  interactionDate: Date
  outcome?: string
  followUpRequired: boolean
  followUpDate?: Date
  contactId?: number
  companyId?: number
  projectId?: number
}) {
  try {
    const interaction = await db.cRMInteraction.create({
      data,
    })

    if (data.projectId) {
      revalidatePath(`/projects/${data.projectId}`)
    }
    if (data.companyId) {
      revalidatePath(`/companies/${data.companyId}`)
    }
    revalidatePath("/interactions")
    return { interaction }
  } catch (error) {
    console.error("Failed to create interaction:", error)
    return { error: "Failed to create interaction" }
  }
}
