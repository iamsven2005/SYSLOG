/*
 * interaction-actions.ts - 2025-05-26 by sven.tan
 * Description:
 *   Server-side actions for managing CRM interactions between stakeholders and companies/projects/contacts.
 *   Supports fetching and logging communication history with optional filters by project or company.
 *
 * Features:
 *   - `getInteractions`: Retrieves interactions with optional filters (`projectId`, `companyId`), and normalizes contact name fields
 *   - `createInteraction`: Logs a new CRM interaction entry with optional links to contacts, companies, or projects
 *   - Automatically revalidates relevant CRM paths to reflect updates in project/company/interaction views
 *
 * Dependencies:
 *   - Prisma client (`db`)
 *   - Next.js cache revalidation (`revalidatePath`)
 *
 * Notes:
 *   - Contact names are parsed into `firstName` and `lastName` for downstream UI compatibility
 *   - Designed to support audit logs, CRM dashboards, and project/company activity timelines
 */

"use server"

import { revalidatePath } from "next/cache"
import {db} from "@/lib/db"

export async function getInteractions(filter?: { projectId?: number; companyId?: number }) {
  try {
    const where = {
      ...(filter?.projectId ? { projectId: filter.projectId } : {}),
      ...(filter?.companyId ? { companyId: filter.companyId } : {}),
    }

    const rawInteractions = await db.cRMInteraction.findMany({
      where,
      include: {
        company: true,
        contact: true,
        project: true,
      },
      orderBy: { interactionDate: "desc" },
    })

    // Map to match the expected Interaction type
    const interactions = rawInteractions.map((interaction) => {
      const fullName = interaction.contact?.name || ""
      const [firstName = "", ...rest] = fullName.split(" ")
      const lastName = rest.join(" ")

      return {
        ...interaction,
        contact: interaction.contact
          ? {
              id: interaction.contact.id,
              firstName,
              lastName,
            }
          : null,
        company: interaction.company
          ? {
              id: interaction.company.id,
              name: interaction.company.name,
            }
          : null,
        project: interaction.project
          ? {
              id: interaction.project.id,
              name: interaction.project.name,
            }
          : null,
      }
    })

    return { interactions }
  } catch (error) {
    console.error("Failed to fetch interactions:", error)
    return { error: "Failed to fetch interactions" }
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
      revalidatePath(`/crm/projects/${data.projectId}`)
    }
    if (data.companyId) {
      revalidatePath(`/crm/companies/${data.companyId}`)
    }
    revalidatePath("/crm/interactions")
    return { interaction }
  } catch (error) {
    console.error("Failed to create interaction:", error)
    return { error: "Failed to create interaction" }
  }
}
