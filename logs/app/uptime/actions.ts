"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db";
import ReactGridLayout from "react-grid-layout";
import { randomUUID } from "crypto";

export async function addUrl(data: { url: string; name: string }) {
  try {
    await db.monitoredUrl.create({
      data: {
        id: randomUUID(),
        url: data.url,
        name: data.name,
        status: "pending",
      },
    })

    // Check the URL health immediately after adding
    const urlRecord = await db.monitoredUrl.findFirst({
      where: {
        url: data.url,
      },
    })

    if (urlRecord) {
      await checkUrlHealth(urlRecord.id)
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to add URL:", error)
    throw new Error("Failed to add URL")
  }
}

export async function checkUrlHealth(id: string) {
  try {
    const url = await db.monitoredUrl.findUnique({
      where: { id },
    })

    if (!url) {
      throw new Error("URL not found")
    }

    const startTime = Date.now()
    let status = "down"
    let responseTime = null
    const wasUp = url.status === "up"

    try {
      const response = await fetch(url.url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Uptime-Monitor/1.0",
        },
        cache: "no-store",
      })

      responseTime = Date.now() - startTime
      status = response.ok ? "up" : "down"
    } catch (error) {
      status = "down"
    }

    // Update the URL status
    const updatedUrl = await db.monitoredUrl.update({
      where: { id },
      data: {
        status,
        responseTime,
        lastChecked: new Date(),
      },
    })

    // Record the check in history
    await db.uptimeHistory.create({
      data: {
        id: randomUUID(),
        monitoredUrlId: id,
        status,
        responseTime,
        timestamp: new Date(),
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to check URL health:", error)
    throw new Error("Failed to check URL health")
  }
}

export async function addStatusUpdate(data: { type: string; message: string }) {
  try {
    await db.statusUpdate.create({
      data: {
        id: randomUUID(),
        type: data.type,
        message: data.message,
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to add status update:", error)
    throw new Error("Failed to add status update")
  }
}
export async function getUrls() {
  try {
    return await db.monitoredUrl.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Failed to fetch URLs:", error)
    return []
  }
}

export async function getStatusUpdates() {
  try {
    return await db.statusUpdate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })
  } catch (error) {
    console.error("Failed to fetch status updates:", error)
    return []
  }
}

export async function dashboard_layouts(name: string,   layouts: { [key: string]: ReactGridLayout[] } , isDefault: boolean){
   const safeLayouts = JSON.parse(JSON.stringify(layouts));

  if (isDefault) {
      await db.dashboardLayout.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    // Check if layout with this name exists
    const existingLayout = await db.dashboardLayout.findFirst({
      where: { name },
    })

    let layout
    if (existingLayout) {
      // Update existing layout
      layout = await db.dashboardLayout.update({
        where: { id: existingLayout.id },
        data: {
          layouts: safeLayouts,
          isDefault,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new layout
      layout = await db.dashboardLayout.create({
        data: {
          id: randomUUID(),
          name,
          layouts: safeLayouts,
          isDefault,
        },
      })
    }
    return layout
}
export async function update_status(id: string,  type: string , message: string){
 const updatedStatusUpdate = await db.statusUpdate.update({
      where: { id },
      data: {
        type,
        message,
      },
    })
    return updatedStatusUpdate

}
export async function delete_status(id: string){
  await db.statusUpdate.delete({
      where: { id },
    })

}
export async function update_url(id: string, name:string, url: string ){
 const updatedUrl = await db.monitoredUrl.update({
      where: { id },
      data: {
        name,
        url,
      },
    })


 return updatedUrl
}