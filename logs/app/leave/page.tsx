/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **LeavePage** component provides a leave management interface where users can either apply for leave
 *   or view the leave calendar. The page utilizes tabs to switch between the leave application form and the leave calendar.
 *
 * Key Features:
 *   - Displays a **Leave Application Form** where users can submit leave requests.
 *   - Displays a **Leave Calendar** to view approved leaves and holidays.
 *   - Uses tabs for seamless switching between the "Apply for Leave" form and the "Leave Calendar".
 *   - Integrates metadata for proper page description and title.
 *
 * Key Components:
 *   - `LeaveApplicationForm`: A component to allow users to apply for leave by filling out a form.
 *   - `LeaveCalendar`: A component to show the leave calendar, displaying approved leaves and holidays.
 *   - `Tabs`: A component to toggle between different views (Apply for Leave and Leave Calendar).
 *
 * Example Usage:
 *   ```tsx
 *   <LeavePage />
 *   ```
 *
 * Notes:
 *   - **Tabs** are used to display the different sections for leave management. The user can toggle between applying for leave and viewing the leave calendar.
 *   - Metadata (`title`, `description`) ensures that the page is properly identified for SEO and provides relevant information.
 */
import { LeaveCalendar } from "./leave-calendar-server"
import { LeaveApplicationForm } from "./leave-application-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leave Management",
  description: "Apply for leave and view leave calendar",
}

export default function LeavePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

      <Tabs defaultValue="apply" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
          <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="apply" className="mt-6">
          <LeaveApplicationForm />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <LeaveCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}
