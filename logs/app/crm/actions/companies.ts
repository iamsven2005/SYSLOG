/*
 * company-actions.ts - 2025-05-26 by sven.tan
 * Description:
 *   Server-side actions for managing company records in the CRM system.
 *   Includes fetching, creating, updating, and deleting companies with relevant relationship data.
 *
 * Features:
 *   - `getCompanies`: Retrieves a list of companies, optionally filtered by type, with contact and project counts
 *   - `getCompany`: Fetches detailed data for a single company, including contacts, interactions, and projects
 *   - `createCompany`: Adds a new company entry with optional metadata (certifications, specialties, etc.)
 *   - `updateCompany`: Updates existing company fields and triggers revalidation
 *   - `deleteCompany`: Removes a company record and refreshes relevant CRM views
 *
 * Dependencies:
 *   - Prisma client (`db`) with `CompanyType` enum
 *   - Next.js cache revalidation (`revalidatePath`)
 *
 * Notes:
 *   - `revalidatePath` ensures UI stays in sync after data mutations
 *   - Uses consistent return pattern: `{ data }` or `{ error }` for client-side handling
 */

"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { CompanyType } from "@/prisma/generated/main"

export async function getCompanies(filter?: { type?: CompanyType }) {
  try {
    const where = filter?.type ? { type: filter.type } : {}

    const companies = await db.company.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        contacts: true,
        _count: {
          select: {
            projects: true,
            contacts: true,
          },
        },
      },
    })

    return { companies }
  } catch (error) {
    console.error("Failed to fetch companies:", error)
    return { error: "Failed to fetch companies" }
  }
}

export async function getCompany(id: number) {
  try {
    const company = await db.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        projects: {
          include: {
            project: true,
            company: true,
          },
        },
        interactions: {
          include: {
            contact: true,
          },
          orderBy: { interactionDate: "desc" },
        },
      },
    })

    if (!company) {
      return { error: "Company not found" }
    }

    return { company }
  } catch (error) {
    console.error("Failed to fetch company:", error)
    return { error: "Failed to fetch company" }
  }
}

export async function createCompany(data: {
  name: string
  type: CompanyType
  industry?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  remarks?: string
  specialties?: string[]
  certifications?: string[]
  rating?: number
}) {
  try {
    const company = await db.company.create({
      data,
    })

    revalidatePath("/crm/companies")
    return { company }
  } catch (error) {
    console.error("Failed to create company:", error)
    return { error: "Failed to create company" }
  }
}

export async function updateCompany(
  id: number,
  data: {
    name?: string
    type?: CompanyType
    industry?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    remarks?: string
    specialties?: string[]
    certifications?: string[]
    rating?: number
  },
) {
  try {
    const company = await db.company.update({
      where: { id },
      data,
    })

    revalidatePath(`/crm/companies/${id}`)
    revalidatePath("/crm/companies")
    return { company }
  } catch (error) {
    console.error("Failed to update company:", error)
    return { error: "Failed to update company" }
  }
}

export async function deleteCompany(id: number) {
  try {
    await db.company.delete({
      where: { id },
    })

    revalidatePath("/crm/companies")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete company:", error)
    return { error: "Failed to delete company" }
  }
}
