import { notFound } from "next/navigation"
import { getTicket, getAssignableUsers } from "@/app/tickets/ticket-actions"
import { TicketDetailSkeleton } from "./ticket-detail-skeleton"
import { TicketDetail } from "./ticket-detail"
import { Suspense } from "react"
import { getCurrentUser } from "@/app/login/actions"

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

