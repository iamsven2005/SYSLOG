//for /uptime

import { NextResponse } from "next/server"
import { startOfDay, subDays, subMonths, subYears, endOfDay, format } from "date-fns"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "week"

    // Calculate date range based on period
    const today = new Date()
    let startDate = startOfDay(today)

    switch (period) {
      case "day":
        startDate = startOfDay(subDays(today, 1))
        break
      case "week":
        startDate = startOfDay(subDays(today, 7))
        break
      case "month":
        startDate = startOfDay(subMonths(today, 1))
        break
      case "year":
        startDate = startOfDay(subYears(today, 1))
        break
    }

    // Get all history records for this URL in the date range
    const historyRecords = await db.uptimeHistory.findMany({
      where: {
        monitoredUrlId: id,
        timestamp: {
          gte: startDate,
          lte: endOfDay(today),
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    })

    // Group records by day
    const groupedByDay = historyRecords.reduce(
      (acc, record) => {
        const day = format(new Date(record.timestamp), "yyyy-MM-dd")

        if (!acc[day]) {
          acc[day] = {
            upChecks: 0,
            downChecks: 0,
            responseTimes: [] as number[],
            lastCheckTime: null as string | null,
          }
        }

        // Update last check time if this is the most recent check for the day
        if (!acc[day].lastCheckTime || new Date(record.timestamp) > new Date(acc[day].lastCheckTime!)) {
          acc[day].lastCheckTime = record.timestamp.toISOString()
        }

        if (record.status === "up") {
          acc[day].upChecks++
          if (record.responseTime) {
            acc[day].responseTimes.push(record.responseTime)
          }
        } else {
          acc[day].downChecks++
        }

        return acc
      },
      {} as Record<
        string,
        {
          upChecks: number
          downChecks: number
          responseTimes: number[]
          lastCheckTime: string | null
        }
      >,
    )

    // Calculate uptime percentage and average response time for each day
    const result = Object.entries(groupedByDay).map(([date, data]) => {
      const totalChecks = data.upChecks + data.downChecks
      const upPercentage = totalChecks > 0 ? (data.upChecks / totalChecks) * 100 : 0

      // Calculate response time statistics
      const responseTimes = data.responseTimes
      const avgResponseTime =
        responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : null

      // Calculate min and max response times
      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : null

      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : null

      return {
        date,
        upPercentage,
        totalChecks,
        upChecks: data.upChecks,
        downChecks: data.downChecks,
        avgResponseTime,
        minResponseTime,
        maxResponseTime,
        lastCheckTime: data.lastCheckTime,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to fetch uptime history:", error)
    return NextResponse.json([], { status: 500 })
  }
}
