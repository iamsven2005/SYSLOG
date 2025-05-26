/**
 * LeaveApprovalDashboard.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This server-side component fetches pending leave applications and formats them for use in the client-side component
 *   `LeaveApprovalDashboardClient`, which handles the approval or rejection actions.
 *
 * Key Features:
 *   - Fetches the list of pending leave applications from the database using the `getPendingLeaves` function.
 *   - Formats the leave data to provide necessary details such as user name, leave type, reason, and status.
 *   - Passes the formatted leave data as props to the `LeaveApprovalDashboardClient` component for rendering.
 *
 * Key Functions:
 *   - `getPendingLeaves`: Fetches the list of pending leaves from the database.
 *   - `formattedLeaves`: Transforms the data for the client-side component, including details like `userName`, `startDate`, `endDate`, and more.
 *   - The `LeaveApprovalDashboardClient` component is used to display the pending leave applications in the UI.
 *
 * Example Usage:
 *   ```tsx
 *   <LeaveApprovalDashboard />
 *   ```
 *   This component will fetch the pending leave applications from the server, format them, and display them using the client component.
 */

import { getPendingLeaves } from "@/app/leave/actions"
import { LeaveApprovalDashboardClient } from "./leave-approval-dashboard-client"

export async function LeaveApprovalDashboard() {
  // Fetch pending leaves from the database
  const pendingLeaves = await getPendingLeaves()

  // Transform the data for the client component
  const formattedLeaves = pendingLeaves.map((leave) => ({
    id: leave.id,
    userId: leave.userId,
    userName: leave.user.username || leave.user.email || `User ${leave.userId}`,
    startDate: leave.startDate,
    endDate: leave.endDate,
    leaveType: leave.leaveType,
    reason: leave.reason,
    status: leave.status,
    createdAt: leave.createdAt,
  }))

  return <LeaveApprovalDashboardClient pendingLeaves={formattedLeaves} />
}
