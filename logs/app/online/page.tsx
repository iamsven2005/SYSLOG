/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for displaying user activity logs and analytics. 
 *   It fetches and displays user activity data and visualizes activity trends over time.
 *   The page includes two main sections:
 *   1. A chart showing user activity over a specified period (default is 30 days).
 *   2. A table displaying user activity logs with pagination for easier navigation.
 *
 * Components:
 *   - `UserActivityChart`: A chart component that visualizes user activity over time and shows page distribution.
 *   - `UserActivityTable`: A table that displays user activity logs with pagination, showing details like login time, page visited, etc.
 *   - `Suspense`: Handles loading state while fetching data for the activity chart and table.
 *
 * Props:
 *   - `searchParams`: A promise containing the query parameters for pagination (`page`) and date range (`days`).
 * 
 * Behavior:
 *   - The page checks if the user has access to the `/online` route via the `allowed("/online")` function. If access is denied, 
 *     it redirects to a not-found page.
 *   - The `getUserActivityData` function fetches the user activity logs from the database with pagination support.
 *   - The `getActivityChartData` function retrieves and groups user activity by day over the specified number of days and calculates 
 *     the daily counts for the chart.
 *   - The data fetched includes details like page visits and login times, which are displayed in both chart and table formats.
 *   - The page ensures that the data is fetched asynchronously and the user interface is updated accordingly, providing a smooth experience.
 */

import { db } from "@/lib/db"
import { subDays, startOfDay, endOfDay, format } from "date-fns"
import UserActivityChart from "./user-activity-chart"
import UserActivityTable from "./UserActivityTable"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"



async function getUserActivityData(page = 1, pageSize = 10) {
  const a = await allowed("/online")
  if(a === false) notFound()
  const skip = (page - 1) * pageSize

  const activities = await db.userActivity.findMany({
    take: pageSize,
    skip,
    orderBy: {
      loginTime: "desc",
    },
  })

  const totalCount = await db.userActivity.count()

  return {
    activities,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
  }
}

async function getActivityChartData(days = 30) {
  const startDate = startOfDay(subDays(new Date(), days))

  // Get activity counts grouped by day
  const activityByDay = await db.userActivity.groupBy({
    by: ["page"],
    _count: {
      id: true,
    },
    where: {
      loginTime: {
        gte: startDate,
      },
    },
    orderBy: {
      page: "asc",
    },
  })

  // Get daily counts for the chart
  const dailyActivity = []

  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i)
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    const count = await db.userActivity.count({
      where: {
        loginTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    })

    dailyActivity.push({
      date: format(date, "MMM dd"),
      count,
      timestamp: date.getTime(),
    })
  }

  // Sort by date ascending
  dailyActivity.sort((a, b) => a.timestamp - b.timestamp)

  // Get page distribution
  const pageDistribution = activityByDay.map((item) => ({
    page: item.page,
    count: item._count.id,
  }))

  return {
    dailyActivity,
    pageDistribution,
  }
}

export default async function UserActivityPage({
  searchParams,
}: {
      searchParams: Promise<{ page?: string; days?: string }>
  }) {
  const currentPage = Number((await searchParams).page) || 1
  const days = Number((await searchParams).days) || 30
  const pageSize = 10

  const { activities, totalPages, totalCount } = await getUserActivityData(currentPage, pageSize)
  const chartData = await getActivityChartData(days)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Activity Logs</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Activity Over Time</h2>
        <UserActivityChart
          dailyActivity={chartData.dailyActivity}
          pageDistribution={chartData.pageDistribution}
          days={days}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
      <UserActivityTable
        initialData={activities}
        totalPages={totalPages}
        currentPage={currentPage}
        totalCount={totalCount}
      />
    </div>
  )
}
