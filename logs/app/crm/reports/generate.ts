"use server"

import { db } from "@/lib/db"
import { customReportSchema, CustomReportInput } from "./customReportSchema"

export async function generateReport(data: CustomReportInput) {
  customReportSchema.parse(data)

  const { dataSource, groupBy, metrics } = data

  let chartData: { name: string; value: number }[] = []
  const summary: Record<string, unknown> = {}

  switch (dataSource) {
    case "projects":
      if (groupBy === "status") {
        const results = await db.project.groupBy({
          by: ["status"],
          _count: { status: true },
        })
        chartData = results.map(r => ({
          name: r.status ?? "Unknown",
          value: r._count.status,
        }))
        summary.total = results.reduce((sum, r) => sum + r._count.status, 0)
      }

      if (metrics.includes("budget_sum")) {
        const agg = await db.project.aggregate({ _sum: { budget: true } })
        summary.budgetSum = agg._sum.budget ?? 0
      }

      break

    case "companies":
      if (groupBy === "type") {
        const results = await db.company.groupBy({
          by: ["type"],
          _count: { type: true },
        })
        chartData = results.map(r => ({
          name: r.type ?? "Unknown",
          value: r._count.type,
        }))
        summary.total = results.reduce((sum, r) => sum + r._count.type, 0)
      }

      if (metrics.includes("rating_avg")) {
        const agg = await db.company.aggregate({ _avg: { rating: true } })
        summary.ratingAvg = agg._avg.rating ?? 0
      }

      break

    case "bids":
      if (groupBy === "status") {
        const results = await db.bidSubmission.groupBy({
          by: ["status"],
          _count: { status: true },
        })
        chartData = results.map(r => ({
          name: r.status ?? "Unknown",
          value: r._count.status,
        }))
        summary.total = results.reduce((sum, r) => sum + r._count.status, 0)
      }

      if (metrics.includes("amount_avg")) {
        const agg = await db.bidSubmission.aggregate({ _avg: { bidAmount: true } })
        summary.avgBidAmount = agg._avg.bidAmount ?? 0
      }

      break

    default:
      throw new Error("Unsupported data source")
  }

  return {
    chartData,
    summary,
    reportName: data.name,
    reportDescription: data.description,
    chartType: data.chartType,
    dataSource,
    metrics,
    groupBy,
  }
}
