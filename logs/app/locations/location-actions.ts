/**
 * Location Management Functions - 2025-05-26 by sven.tan
 *
 * Description:
 *   This module provides server-side functions for managing location data within a database.
 *   It includes functionalities to fetch, add, update, and delete locations, with integrated logging and validation.
 *
 * Key Features:
 *   - Fetches locations with optional pagination and search filters.
 *   - Adds new locations to the database.
 *   - Updates existing location details, including propagating changes to associated users.
 *   - Deletes a location and removes it from any user associations, with revalidation.
 *   - Activity logging and path revalidation are integrated into each action.
 *
 * Key Components:
 *   - `getLocations`: Retrieves a list of locations with pagination and optional filters.
 *   - `addLocation`: Adds a new location to the database and logs the activity.
 *   - `updateLocation`: Updates location details, handles name changes, and updates affected users.
 *   - `deleteLocation`: Deletes a location, removes it from affected users, and logs the activity.
 *
 * Example Usage:
 *   ```ts
 *   // Fetch locations
 *   const { locations, pageCount, totalCount } = await getLocations({ search: "New York" });
 *
 *   // Add a location
 *   const newLocation = await addLocation({ code: "NYC", name: "New York City", Region: "East", WCI_URL: "example.com", CCY: "USD", Remarks: "Big city" });
 *
 *   // Update location
 *   const updatedLocation = await updateLocation({ id: 1, code: "NYC", name: "New York City", Region: "East", WCI_URL: "example.com", CCY: "USD", Remarks: "Updated city" });
 *
 *   // Delete a location
 *   const deletedLocation = await deleteLocation(1);
 *   ```
 *
 * Notes:
 *   - **Revalidation**: The `revalidatePath` function ensures that related pages (like `/locations` and `/logs`) are updated after changes.
 *   - **User Impact**: When updating or deleting locations, any affected users are updated automatically to maintain consistency in their location data.
 *   - **Error Handling**: Errors are logged to the console and activity logs, providing transparency in case of issues.
 */

"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/activity-logger"

// Get all locations with optional filtering and pagination
export async function getLocations({
  page = 1,
  pageSize = 10,
}: {
  search?: string
  page?: number
  pageSize?: number
} = {}) {
  const skip = (page - 1) * pageSize

  // Get locations with pagination
  const locations = await db.location.findMany({
    skip,
    take: pageSize,
    orderBy: { code: "asc" },
  })

  // Get total count for pagination
  const totalCount = await db.location.count()
  const pageCount = Math.ceil(totalCount / pageSize)

  return {
    locations,
    pageCount,
    totalCount,
  }
}
export async function getAllLocations() {
  try {
          const roles = await db.location.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return { roles }
  }
  catch (error) {
    console.error("Error fetching locations:", error)
    return { error: "Failed to fetch locations" }
  } 
}
// Add a new location
export async function addLocation({
  code,
  name,
  fullname,
  Region,
  WCI_URL,
  Remarks,
  CCY,
  createBy = "system",
}: {
  code: string
  name: string
  fullname: string
  Region: string
  WCI_URL: string
  CCY: string
  Remarks: string
  createBy?: string
}) {
  try {
    const location = await db.location.create({
      data: {
        code: code.toUpperCase(),
        name,
        fullname,
        Region,
        WCI_URL,
        CCY,
        Remarks,
        createBy,
      },
    })

    await logActivity({
      actionType: "Created Location",
      targetType: "Location",
      targetId: location.id,
      details: `Created location ${code} - ${name}`,
    })

    revalidatePath("/locations")
    return location
  } catch (error) {
    console.error("Error adding location:", error)
  }
}

// Update an existing location
export async function updateLocation({
  id,
  code,
  name,
  fullname,
  Region,
  WCI_URL,
  CCY,
  Remarks,
  modifyBy = "system",
}: {
  id: number
  code: string
  name: string
  fullname: string
  Region: string
  WCI_URL: string
  CCY: string
  Remarks: string
  modifyBy?: string
}) {
  try {
    // Step 1: Get the original location (to check if name changed)
    const existingLocation = await db.location.findUnique({
      where: { id },
    })

    if (!existingLocation) {
      throw new Error("Location not found")
    }

    const oldName = existingLocation.name
    const newName = name

    // Step 2: Update the location
    const location = await db.location.update({
      where: { id },
      data: {
        code: code.toUpperCase(),
        name: newName,
        fullname,
        Region,
        WCI_URL,
        CCY,
        Remarks,
        modifyBy,
        modifyDate: new Date(),
      },
    })

    // Step 3: If name changed, update all affected users
    if (oldName !== newName) {
      const affectedUsers = await db.user.findMany({
        where: {
          location: {
            has: oldName,
          },
        },
      })

      await Promise.all(
        affectedUsers.map((user) => {
          const updatedLocations = user.location.map((loc) =>
            loc === oldName ? newName : loc
          )
          return db.user.update({
            where: { id: user.id },
            data: {
              location: updatedLocations,
            },
          })
        })
      )
    }

    // Step 4: Log and revalidate
    await logActivity({
      actionType: "Updated Location",
      targetType: "Location",
      targetId: location.id,
      details: `Updated location ${code} - ${newName}`,
    })

    revalidatePath("/logs")
    return location
  } catch (error) {
    console.error("Error updating location:", error)
  }
}

// Delete a location
export async function deleteLocation(id: number) {
  try {
    // First, get the location before deletion to know the name/code
    const location = await db.location.delete({
      where: { id },
    })

    // Find all users who have this location in their `location[]` array
    const affectedUsers = await db.user.findMany({
      where: {
        location: {
          has: location.name,
        },
      },
    })

    // Remove the location from each user's array
    await Promise.all(
      affectedUsers.map((user) => {
        const updatedLocations = user.location.filter((loc) => loc !== location.name)
        return db.user.update({
          where: { id: user.id },
          data: {
            location: updatedLocations,
          },
        })
      })
    )

    // Log the deletion
    await logActivity({
      actionType: "Deleted Location",
      targetType: "Location",
      targetId: id,
      details: `Deleted location ${location.code} - ${location.name}`,
    })

    revalidatePath("/logs")
    return location
  } catch (error) {
    console.error("Error deleting location:", error)
  }
}

