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
