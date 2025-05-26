/*
 * customReportSchema.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   Defines the schema for creating a custom report using Zod validation.
 *   It ensures that the report name, data source, metrics, and other fields follow the specified rules.
 *   The schema also handles optional fields such as description, filters, groupBy, chartType, and dateRange.
 *
 * Features:
 *   - Validates report name, description, data source, and metrics selection
 *   - Validates filters as an array of field-operator-value objects
 *   - Supports grouping, chart types, and date range filtering
 *   - Defines a `CustomReportInput` type using `z.infer` for type safety
 *
 * Dependencies:
 *   - Zod: `z.object`, `z.enum`, `z.string`, `z.date`, `z.array`
 */

import { z } from "zod"

export const customReportSchema = z.object({
  name: z.string().min(2, { message: "Report name must be at least 2 characters." }),
  description: z.string().optional(),
  dataSource: z.enum(["projects", "companies", "contacts", "materials", "inspections", "bids"]),
  metrics: z.array(z.string()).min(1, { message: "Select at least one metric" }),
  filters: z
    .array(
      z.object({
        field: z.string(),
        operator: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  groupBy: z.string().optional(),
  chartType: z.enum(["bar", "line", "pie", "radar", "area", "none"]),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
})

export type CustomReportInput = z.infer<typeof customReportSchema>
