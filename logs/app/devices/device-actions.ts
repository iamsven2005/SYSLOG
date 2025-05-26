/*
 * device-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server-side functions for managing devices within the CRM system.
 *   Includes functionality for retrieving, adding, updating, and deleting devices, as well as fetching associated device names and IPs.
 *   The functions support pagination, searching, and filtering based on device attributes.
 *
 * Features:
 *   - `getAllDeviceIps`: Retrieves all unique device IP addresses from the database
 *   - `getDevices`: Fetches a paginated list of devices based on search criteria and includes user information related to each device
 *   - `addDevice`: Adds a new device to the database and logs the activity
 *   - `updateDevice`: Updates an existing device's details and logs the activity
 *   - `deleteDevice`: Deletes a device by ID and logs the activity
 *   - `getAllDeviceNames`: Fetches all device names for filtering purposes
 *   - Utilizes Prisma for interacting with the database and `logActivity` for logging actions
 *   - Supports handling device attributes such as `name`, `ip_address`, `mac_address`, `password`, and `notes`
 *
 * Dependencies:
 *   - `logActivity`: Logs user actions for auditing purposes
 *   - `db`: Prisma client instance for interacting with the database
 *   - `Prisma`: Types from Prisma ORM for type safety in database queries
 */
"use server"

import { logActivity } from "@/lib/activity-logger"
import { db } from "@/lib/db"
import { Prisma } from "@/prisma/generated/main"

interface GetDevicesParams {
  search?: string
  page?: number
  pageSize?: number
}
export async function getAllDeviceIps() {
  try {
    const devices = await db.devices.findMany({
      select: {
        ip_address: true,
      },
    })
    return devices.map((d) => d.ip_address).filter(Boolean)
  } catch (error) {
    console.error("Error fetching device IPs:", error)
    return []
  }
}

// Update the getDevices function to include user information
export async function getDevices({ search = "", page = 1, pageSize = 10 }: GetDevicesParams) {
  try {
    const where: Prisma.devicesWhereInput = {}


    // Add search condition if provided
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { ip_address: { contains: search } },
        { mac_address: { contains: search } },
        { notes: { contains: search } },
      ]
    }

    // Get total count for pagination
    const totalCount = await db.devices.count({ where })

    // Get devices with pagination and include users
    const devices = await db.devices.findMany({
      where,
      include: {
        users: {
          include: {
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
        time: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      devices,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
    }
  } catch (error) {
    console.error("Error fetching devices:", error)
    return null
  }
}

interface DeviceData {
  name: string
  ip_address: string | null
  mac_address: string | null
  password: string | null
  notes: string
}

export async function addDevice(data: DeviceData) {
  try {
    const device = await db.devices.create({
      data: {
        name: data.name,
        ip_address: data.ip_address,
        mac_address: data.mac_address,
        password: data.password,
        notes: data.notes,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Created Device",
      targetType: "Device",
      targetId: device.id,
      details: `Created device: ${data.name}`,
    })

    return { success: true, device }
  } catch (error) {
    console.error("Error adding device:", error)
    return null
  }
}

interface UpdateDeviceData extends DeviceData {
  id: number
}

export async function updateDevice(data: UpdateDeviceData) {
  try {
    const device = await db.devices.update({
      where: { id: data.id },
      data: {
        name: data.name,
        ip_address: data.ip_address,
        mac_address: data.mac_address,
        password: data.password,
        notes: data.notes,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Updated Device",
      targetType: "Device",
      targetId: device.id,
      details: `Updated device: ${data.name}`,
    })

    return { success: true, device }
  } catch (error) {
    console.error("Error updating device:", error)
    throw new Error("Failed to update device")
  }
}

export async function deleteDevice(id: number) {
  try {
    const device = await db.devices.findUnique({
      where: { id },
      select: { name: true },
    })

    await db.devices.delete({
      where: { id },
    })

    // Log the activity
    await logActivity({
      actionType: "Deleted Device",
      targetType: "Device",
      targetId: id,
      details: `Deleted device: ${device?.name || "Unknown"}`,
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting device:", error)
    throw new Error("Failed to delete device")
  }
}

// Add this function to get all device names for filtering
export async function getAllDeviceNames() {
  try {
    const devices = await db.devices.findMany({
      select: {
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return devices.map((device) => device.name)
  } catch (error) {
    console.error("Error fetching device names:", error)
    return null
  }
}

