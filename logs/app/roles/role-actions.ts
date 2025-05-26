/**
 * roles-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file provides server-side functions for managing roles in the database. 
 *   It includes functions for fetching, adding, updating, and deleting roles, 
 *   along with ensuring consistency between roles, users, and related permissions.
 *
 * Functions:
 *   - `getRoles`: Fetches all roles and users from the database and returns them.
 *   - `addRole`: Adds a new role to the database if it does not already exist.
 *   - `updateRole`: Updates an existing role, and ensures that users and permissions are synchronized with the new role details.
 *   - `deleteRole`: Deletes a role from the database, removes it from users' roles, and cleans up related permissions.
 *
 * Components:
 *   - `db`: The database instance used to perform CRUD operations on roles, users, and permissions.
 *   - `revalidatePath`: A Next.js utility to revalidate paths after creating or updating roles.
 *   - `toast`: For displaying success or error messages related to role operations.
 *
 * Behavior:
 *   - `getRoles`: Fetches roles in ascending order and users, returning them as an object.
 *   - `addRole`: Checks for an existing role, creates a new one if not found, and triggers a revalidation of the `/logs` path.
 *   - `updateRole`: Fetches the current role and updates it, ensuring that users' role mappings and related permissions are updated accordingly if the role name changes.
 *   - `deleteRole`: Deletes the role from the database, updates all users to remove the role, and deletes related permissions from `rolePermission` entries.
 *
 * Notes:
 *   - Error handling is implemented for each function to ensure any issues during database operations are logged and handled gracefully.
 *   - The `updateRole` function ensures that all users with the old role name have their roles updated, and related role permissions are also updated.
 *   - The `deleteRole` function ensures that the role is safely removed from all users and permissions, with appropriate messaging upon completion.
 */

"use server"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRoles() {
  try {
    const roles = await db.roles.findMany({orderBy: {name: "asc"}});
    const users = await db.user.findMany();
    return { roles, users };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null
  }
}

// Add a new role
export async function addRole(roleData: { name: string; description?: string }) {
  const { name, description = "" } = roleData;

  if (!name) {
    throw new Error("Role name is required");
  }

  try {
    // Check if the role already exists (case-insensitive)
    const existingRole = await db.roles.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingRole) {
      return existingRole; // Role already exists — return it
    }

    // Create new role if not found
    const newRole = await db.roles.create({
      data: { name, description },
    });

    revalidatePath("/logs");
    return newRole;

  } catch (error) {
    console.error("Error creating role:", error);
    throw new Error("Failed to create role");
  }
}


// Update a role
export async function updateRole(id: number, roleData: { name: string; description?: string }) {
  if (!id) throw new Error("Role ID is required");

  try {
    // Step 1: Fetch current role
    const existingRole = await db.roles.findUnique({
      where: { id },
    })

    if (!existingRole) throw new Error("Role not found")

    const oldName = existingRole.name
    const newName = roleData.name

    // Step 2: Update role
    const updatedRole = await db.roles.update({
      where: { id },
      data: roleData,
    })

    // Step 3: Sync users with role name (already in your original logic)
    if (oldName !== newName) {
      const affectedUsers = await db.user.findMany({
        where: {
          role: {
            has: oldName,
          },
        },
      })

      await Promise.all(
        affectedUsers.map((user) => {
          const updatedRoles = user.role.map((r) => (r === oldName ? newName : r))
          return db.user.update({
            where: { id: user.id },
            data: {
              role: updatedRoles,
            },
          })
        })
      )

      // Step 4: Sync RolePermission entries
      await db.rolePermission.updateMany({
        where: {
          roleName: oldName,
        },
        data: {
          roleName: newName,
        },
      })
    }

    return updatedRole
  } catch (error) {
    console.error("Error updating role:", error)
    throw new Error("Failed to update role")
  }
}

// Delete a role, we do not want a many to many, just apprear to look like
export async function deleteRole(id: number) {
  if (!id) {
    throw new Error("Role ID is required")
  }

  try {
    // Step 1: Get role name before deleting
    const role = await db.roles.findUnique({
      where: { id },
    })

    if (!role) {
      throw new Error("Role not found")
    }

    const roleName = role.name

    // Step 2: Delete the role
    await db.roles.delete({
      where: { id },
    })

    // Step 3: Remove the role from all users
    const affectedUsers = await db.user.findMany({
      where: {
        role: {
          has: roleName,
        },
      },
    })

    await Promise.all(
      affectedUsers.map((user) => {
        const updatedRoles = user.role.filter((r) => r !== roleName)
        return db.user.update({
          where: { id: user.id },
          data: {
            role: updatedRoles,
          },
        })
      })
    )

    // Step 4: Delete related RolePermission entries
    await db.rolePermission.deleteMany({
      where: {
        roleName: roleName,
      },
    })

    return { message: `Role "${roleName}" deleted and removed from users and permissions.` }
  } catch (error) {
    console.error("Error deleting role:", error)
    throw new Error("Failed to delete role")
  }
}
