/**
 * page.tsx (leave approval) - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page component renders the leave approval dashboard, providing functionality for approving or rejecting
 *   leave applications. It uses the `LeaveApprovalDashboard` component to handle the core functionality.
 *
 * Key Features:
 *   - Displays the Leave Approval Dashboard with an appropriate heading.
 *   - Configures the metadata for the page with a title and description for SEO purposes.
 *
 * Key Functions:
 *   - The `metadata` object defines the title and description for the page, optimizing SEO and accessibility.
 *   - The `LeaveApprovalDashboard` component is rendered to allow users to manage leave applications.
 *
 * Example Usage:
 *   ```tsx
 *   <LeaveApprovalPage />
 *   ```
 *   This component will render the Leave Approval Dashboard inside a styled container.
 */
import type { Metadata } from "next"
import { LeaveApprovalDashboard } from "./leave-approval-dashboard-server"

export const metadata: Metadata = {
  title: "Leave Approval",
  description: "Approve or reject leave applications",
}

export default function LeaveApprovalPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Leave Approval Dashboard</h1>
      <LeaveApprovalDashboard />
    </div>
  )
}
