import { NewTicketForm } from "@/app/tickets/new/new-ticket-form"
import { getAssignableUsers } from "@/app/tickets/ticket-actions"
import { db } from "@/lib/db"
import { getCurrentUser, hasRole } from "@/app/login/actions"
import { notFound } from "next/navigation"
import { allowed } from "@/components/navbar"


export default async function NewTicketPage() {
  const a = await allowed("/notes")
  const user = await getCurrentUser()
    if(a === false || !user) notFound()

  const isAdmin = await hasRole(user, ["admin"])
  const devices = await db.devices.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  // Get all admin users for assignment
  const assignableUsers = await getAssignableUsers()
  const assignableUsersCleaned = assignableUsers
    .filter(user => user.username !== null) // remove null usernames
    .map(user => ({
      id: user.id,
      username: user.username as string, // safely cast after filter
    }));

  return (
    <div className="container py-6">
      <NewTicketForm deviceNames={devices.map((device) => device.name)} assignableUsers={assignableUsersCleaned} isAdmin={isAdmin} />
    </div>
  )
}

