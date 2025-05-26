/**
 * Page.tsx - 2025-05-27 by [Your Name]
 *
 * Description:
 *   This page component handles the display of detailed information for a specific ticket, including 
 *   the ability to assign users to the ticket. It fetches the ticket data, assignable users, and current 
 *   user asynchronously, and displays a loading skeleton while the data is being fetched.
 *   The page ensures that only authorized users can access the ticket details.
 *
 *   - The page fetches the ticket and assignable users concurrently using `Promise.all`.
 *   - The `Suspense` component is used to display a loading skeleton (`TicketDetailSkeleton`) until 
 *     the data is ready.
 *   - If there is an error or invalid data (like a non-numeric ticket ID), the `notFound()` function 
 *     is called to display a 404 page.
 *   - If the user is not authenticated or the ticket is not found, an error page is shown.
 *
 * Components:
 *   - `TicketDetailSkeleton`: Displays a loading skeleton while fetching ticket data.
 *   - `TicketDetail`: Displays the detailed ticket information once the data is fetched.
 *   - `Suspense`: Provides a fallback loading state while the `TicketDetail` is being rendered.
 *   - `getTicket`: Fetches the ticket data from the backend.
 *   - `getAssignableUsers`: Fetches the list of users that can be assigned to the ticket.
 *   - `getCurrentUser`: Fetches the current authenticated user to ensure only authorized access.

 * Props:
 *   - `params`: Contains the ticket ID passed from the route parameters.
 * 
 * Behavior:
 *   - The component attempts to retrieve the ticket details and assignable users. If any of the 
 *     fetches fail, an error message is shown. 
 *   - If the ticket or user is not found or the ticket ID is invalid, a 404 error page is shown.
 *   - The current user and ticket data are passed to `TicketDetail` for rendering once everything 
 *     is successfully fetched.
 */


import { notFound } from "next/navigation"
import { getTicket, getAssignableUsers } from "@/app/tickets/ticket-actions"
import { TicketDetailSkeleton } from "./ticket-detail-skeleton"
import { TicketDetail } from "./ticket-detail"
import { Suspense } from "react"
import { getCurrentUser } from "@/app/login/auth"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const ticketId = Number.parseInt(params.id)
  if (isNaN(ticketId)) {
    return notFound()
  }
  const user = await getCurrentUser()
  if(!user) notFound() 
  const ticketPromise = getTicket(ticketId)
  const usersPromise = getAssignableUsers()

  const [ticket, assignableUsers] = await Promise.all([ticketPromise, usersPromise])

  if (!ticket) {
    return notFound()
  }

  return (
    <div className="container py-6">
      <Suspense fallback={<TicketDetailSkeleton />}>
        <TicketDetail ticket={ticket} assignableUsers={assignableUsers} currentUser={user} />
      </Suspense>
    </div>
  )
}

