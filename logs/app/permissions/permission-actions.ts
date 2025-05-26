/**
 * permission-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This module provides server-side functions for managing page permissions, including creating, updating, 
 *   and deleting page permissions. It interacts with the database to manage roles and user access to specific routes.
 *   The functions log activity and trigger path revalidation for logs to ensure data integrity and up-to-date access control.
 * 
 * Functions:
 *   - `getAllPagePermissions`: Fetches all page permissions, including associated roles and users.
 *   - `createPagePermission`: Creates a new page permission with specified route, description, roles, and users.
 *   - `updatePagePermission`: Updates an existing page permission, modifying the route, description, roles, or users.
 *   - `deletePagePermission`: Deletes an existing page permission along with its associated roles and users.
 *   - `getAllRoles`: Fetches all roles from the database for use in dropdown selections.
 *   - `getAllUsersForPermissions`: Fetches all users from the database for use in dropdown selections.
 * 
 * Behavior:
 *   - Each function communicates with the database via Prisma ORM to perform the respective operation.
 *   - `createPagePermission` and `updatePagePermission` handle permissions for both roles and individual users.
 *   - `deletePagePermission` ensures related role and user permissions are deleted before removing the main permission.
 *   - Each CRUD operation triggers an activity log to track changes, ensuring transparency and accountability.
 *   - After modifying permissions, the path `/logs` is revalidated to reflect updates in the logs.
 * 
 * Error Handling:
 *   - Each function includes error handling, with error messages logged and thrown if an operation fails, 
 *     ensuring reliable operation and easier debugging.
 */


"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/activity-logger"
import { Prisma } from "@/prisma/generated/main"
// Get all page permissions with their associated roles and users
export async function getAllPagePermissions() {
  try {
// getAllPagePermissions
const permissions = await db.pagePermission.findMany({
  include: {
    allowedRoles: {
      select: {
        id: true,
        roleName: true,
        pagePermissionId: true, // ✅ Add this line
      },
    },
    allowedUsers: {
      select: {
        id: true,
        pagePermissionId: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    },
  },
  orderBy: {
    route: "asc",
  },
})


    return { permissions }
  } catch (error) {
    console.error("Error fetching permissions:", error)
    throw new Error("Failed to fetch permissions")
  }
}

// Create a new page permission
export async function createPagePermission(data: {
  route: string
  description?: string
  roles?: string[]
  userIds?: number[]
}) {
  try {
    const { route, description, roles = [], userIds = [] } = data

    // Create the page permission
    const permission = await db.pagePermission.create({
      data: {
        route,
        description,
      },
    })

    // Create role permissions
    if (roles.length > 0) {
      await db.$transaction(
        roles.map((roleName) =>
          db.rolePermission.create({
            data: {
              roleName,
              pagePermissionId: permission.id,
            },
          }),
        ),
      )
    }

    // Create user permissions
    if (userIds.length > 0) {
      await db.$transaction(
        userIds.map((userId) =>
          db.userPermission.create({
            data: {
              userId,
              pagePermissionId: permission.id,
            },
          }),
        ),
      )
    }

    await logActivity({
      actionType: "Created",
      targetType: "PagePermission",
      targetId: permission.id,
      details: `Created page permission for route: ${route}`,
    })

    revalidatePath("/logs")
    return { success: true, permission }
  } catch (error) {
    console.error("Error creating permission:", error)
    throw new Error("Failed to create permission")
  }
}

// Update an existing page permission
export async function updatePagePermission(
  id: number,
  data: {
    route?: string
    description?: string
    roles?: string[]
    userIds?: number[]
  },
) {
  try {
    const { route, description, roles, userIds } = data

    // Update the page permission
    const updateData: Prisma.PagePermissionUpdateInput = {}
    if (route !== undefined) updateData.route = route
    if (description !== undefined) updateData.description = description

    const permission = await db.pagePermission.update({
      where: { id },
      data: updateData,
    })

    // Update role permissions if provided
    if (roles !== undefined) {
      // Delete existing role permissions
      await db.rolePermission.deleteMany({
        where: { pagePermissionId: id },
      })

      // Create new role permissions
      if (roles.length > 0) {
        await db.$transaction(
          roles.map((roleName) =>
            db.rolePermission.create({
              data: {
                roleName,
                pagePermissionId: id,
              },
            }),
          ),
        )
      }
    }

    // Update user permissions if provided
    if (userIds !== undefined) {
      // Delete existing user permissions
      await db.userPermission.deleteMany({
        where: { pagePermissionId: id },
      })

      // Create new user permissions
      if (userIds.length > 0) {
        await db.$transaction(
          userIds.map((userId) =>
            db.userPermission.create({
              data: {
                userId,
                pagePermissionId: id,
              },
            }),
          ),
        )
      }
    }

    await logActivity({
      actionType: "Updated",
      targetType: "PagePermission",
      targetId: permission.id,
      details: `Updated page permission for route: ${permission.route}`,
    })

    revalidatePath("/logs")
    return { success: true, permission }
  } catch (error) {
    console.error("Error updating permission:", error)
    throw new Error("Failed to update permission")
  }
}

// Delete a page permission
export async function deletePagePermission(id: number) {
  try {
    const permission = await db.pagePermission.findUnique({
      where: { id },
    })

    if (!permission) {
      throw new Error("Permission not found")
    }

    // 🔥 Delete related rolePermission and userPermission records first
    await db.rolePermission.deleteMany({
      where: { pagePermissionId: id },
    })

    await db.userPermission.deleteMany({
      where: { pagePermissionId: id },
    })

    // ✅ Now delete the main page permission
    await db.pagePermission.delete({
      where: { id },
    })

    await logActivity({
      actionType: "Deleted",
      targetType: "PagePermission",
      targetId: id,
      details: `Deleted page permission for route: ${permission.route}`,
    })

    revalidatePath("/logs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting permission:", error)
    throw new Error("Failed to delete permission")
  }
}


// Get all roles for dropdown selection
export async function getAllRoles() {
  try {
    const roles = await db.roles.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { roles }
  } catch (error) {
    console.error("Error fetching roles:", error)
    throw new Error("Failed to fetch roles")
  }
}

// Get all users for dropdown selection
export async function getAllUsersForPermissions() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
      orderBy: {
        username: "asc",
      },
    })

    return { users }
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

