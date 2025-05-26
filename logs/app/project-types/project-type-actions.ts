/**
 * project-type-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This module contains server-side functions to manage project types, including fetching, creating, updating, and deleting project types.
 *   It interacts with the database using Prisma to perform CRUD operations and revalidates paths to ensure data consistency in the application.
 * 
 * Functions:
 *   - `getAllProjectTypes`: Fetches all project types from the database, optionally filtered by a search query.
 *   - `createProjectType`: Creates a new project type in the database with a specified name and description.
 *   - `updateProjectType`: Updates an existing project type's name and description based on the provided ID.
 *   - `deleteProjectType`: Deletes a project type from the database based on the provided ID.
 * 
 * Behavior:
 *   - Each function interacts with the `projectType` model in the Prisma schema and executes the corresponding database operation.
 *   - After creating, updating, or deleting a project type, the paths `/project-types` and `/projects` are revalidated to ensure the UI is updated with the latest data.
 * 
 * Error Handling:
 *   - If any operation fails, an error is logged to the console and a corresponding error message is thrown.
 */


"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function getAllProjectTypes(search = "") {
  try {
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}

    const projectTypes = await db.projectType.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    return projectTypes
  } catch (error) {
    console.error("Error fetching project types:", error)
    throw new Error("Failed to fetch project types")
  }
}

export async function createProjectType(data: { name: string; description: string }) {
  try {
    await db.projectType.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    })

    revalidatePath("/project-types")
    revalidatePath("/projects")
  } catch (error) {
    console.error("Error creating project type:", error)
    throw new Error("Failed to create project type")
  }
}

export async function updateProjectType(id: number, data: { name: string; description: string }) {
  try {
    await db.projectType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
      },
    })

    revalidatePath("/project-types")
    revalidatePath("/projects")
  } catch (error) {
    console.error("Error updating project type:", error)
    throw new Error("Failed to update project type")
  }
}

export async function deleteProjectType(id: number) {
  try {
    await db.projectType.delete({
      where: { id },
    })

    revalidatePath("/project-types")
    revalidatePath("/projects")
  } catch (error) {
    console.error("Error deleting project type:", error)
    throw new Error("Failed to delete project type")
  }
}

