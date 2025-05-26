/**
 * LeaveCalendar.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component serves as the data layer for the **LeaveCalendarClient** component. It fetches the necessary data such as
 *   approved leaves, holidays, and user reminders, and transforms this data into a format suitable for rendering in the
 *   calendar component. It uses the `getCurrentUser` function to retrieve the logged-in user and ensures that reminders are
 *   fetched only for the authenticated user.
 *
 * Key Features:
 *   - Fetches approved leaves, holidays, and user reminders from the database.
 *   - Transforms the fetched data into a structure that can be passed to the **LeaveCalendarClient** component for rendering.
 *   - Uses the `getCurrentUser` function to get the current authenticated user and checks their personal reminders.
 *   - Passes formatted data (leaves, holidays, reminders) along with the current user ID to **LeaveCalendarClient**.
 *
 * Key Functions:
 *   - `getCurrentUser`: Retrieves the currently authenticated user.
 *   - `getApprovedLeaves`: Fetches all the approved leave applications.
 *   - `getHolidays`: Fetches all the holidays from the system.
 *   - `getUserReminders`: Fetches the personal reminders for the current user.
 *   - Transforms data into the format expected by **LeaveCalendarClient**.
 *
 * Example Usage:
 *   ```tsx
 *   <LeaveCalendar />
 *   ```
 *
 * Notes:
 *   - The component fetches approved leaves, holidays, and reminders asynchronously and transforms them for the client-side calendar view.
 *   - **LeaveCalendarClient** takes in `leaves`, `holidays`, `reminders`, and `currentUserId` as props.
 *   - If no user is logged in, the `getUserReminders` function returns an empty array.
 */
import { getApprovedLeaves } from "@/app/leave/actions"
import { getHolidays } from "@/app/leave/holiday-actions"
import { getUserReminders } from "@/app/leave/reminder-actions"
import { LeaveCalendarClient } from "./leave-calendar-client"
import { getCurrentUser } from "@/app/login/auth"

export async function LeaveCalendar() {
  // Get current user
  const currentUser = await getCurrentUser()

  // Fetch approved leaves from the database
  const approvedLeaves = await getApprovedLeaves()

  // Fetch holidays from the database
  const holidays = await getHolidays()

  // Fetch user's personal reminders
  const reminders = currentUser ? await getUserReminders() : []

  // Transform the leave data for the client component
  const formattedLeaves = approvedLeaves.map((leave) => ({
    id: leave.id,
    userId: leave.userId,
    userName: leave.user.username || leave.user.email || `User ${leave.userId}`,
    startDate: leave.startDate,
    endDate: leave.endDate,
    leaveType: leave.leaveType,
    status: leave.status,
  }))

  // Transform the holiday data for the client component
  const formattedHolidays = holidays.map((holiday) => ({
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
    description: holiday.description || "",
    isRecurring: holiday.isRecurring,
  }))

  // Transform the reminder data for the client component
  const formattedReminders = reminders.map((reminder) => ({
    id: reminder.id,
    title: reminder.title,
    date: reminder.date,
    description: reminder.description || "",
    color: reminder.color || "#6366f1",
  }))

  return (
    <LeaveCalendarClient
      leaves={formattedLeaves}
      holidays={formattedHolidays}
      reminders={formattedReminders}
      currentUserId={currentUser?.id}
    />
  )
}
