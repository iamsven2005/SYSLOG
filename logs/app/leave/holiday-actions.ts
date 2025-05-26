/**
 * holiday-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains server-side functions for handling holidays, including adding, updating, deleting, and retrieving holiday data.
 *   The functions utilize Prisma for database interactions and Zod for input validation.
 *
 * Key Functions:
 *   - `addHoliday`: Adds a new holiday to the database, validates input using the `holidayFormSchema`.
 *   - `updateHoliday`: Updates an existing holiday by its ID, validates the new input.
 *   - `deleteHoliday`: Deletes a holiday by its ID.
 *   - `getHolidays`: Retrieves all holidays sorted by date.
 *   - `getHolidaysByDateRange`: Retrieves holidays (both recurring and non-recurring) within a specified date range.
 *   - `getHolidayById`: Retrieves a single holiday by its ID.
 *
 * Example Usage:
 *   ```ts
 *   await addHoliday({ name: "Christmas", date: new Date(), isRecurring: true });
 *   await updateHoliday(1, { name: "New Year's Day", date: new Date(), isRecurring: false });
 *   await deleteHoliday(1);
 *   const holidays = await getHolidays();
 *   const holidaysInRange = await getHolidaysByDateRange(new Date("2025-01-01"), new Date("2025-12-31"));
 *   ```
 *
 * Notes:
 *   - The `holidayFormSchema` ensures that the holiday data meets the validation criteria before inserting or updating records.
 *   - Recurring holidays are handled separately in the `getHolidaysByDateRange` function, where they are always included regardless of the date range.
 *   - The `revalidatePath("/leave")` call ensures that the leave management UI is updated after each operation.
 */
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const holidayFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.date(),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
})

type HolidayFormValues = z.infer<typeof holidayFormSchema>

export async function addHoliday(data: HolidayFormValues) {
  const validatedData = holidayFormSchema.parse(data)

  const result = await db.holiday.create({
    data: {
      name: validatedData.name,
      date: validatedData.date,
      description: validatedData.description,
      isRecurring: validatedData.isRecurring,
    },
  })

  revalidatePath("/leave")

  return { success: true, holiday: result }
}

export async function updateHoliday(id: number, data: HolidayFormValues) {
  const validatedData = holidayFormSchema.parse(data)

  const result = await db.holiday.update({
    where: { id },
    data: {
      name: validatedData.name,
      date: validatedData.date,
      description: validatedData.description,
      isRecurring: validatedData.isRecurring,
    },
  })

  revalidatePath("/leave")

  return { success: true, holiday: result }
}

export async function deleteHoliday(id: number) {
  await db.holiday.delete({
    where: { id },
  })

  revalidatePath("/leave")

  return { success: true }
}

export async function getHolidays() {
  const holidays = await db.holiday.findMany({
    orderBy: {
      date: "asc",
    },
  })

  return holidays
}

export async function getHolidaysByDateRange(startDate: Date, endDate: Date) {
  const holidays = await db.holiday.findMany({
    where: {
      OR: [
        // Non-recurring holidays within the date range
        {
          isRecurring: false,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        // Recurring holidays (we'll filter these by month/day in the client)
        {
          isRecurring: true,
        },
      ],
    },
    orderBy: {
      date: "asc",
    },
  })

  return holidays
}

export async function getHolidayById(id: number) {
  const holiday = await db.holiday.findUnique({
    where: { id },
  })

  return holiday
}
