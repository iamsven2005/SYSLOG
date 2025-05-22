import { NewTicketForm } from "@/app/tickets/new/new-ticket-form"
import { getAssignableUsers } from "@/app/tickets/ticket-actions"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/app/login/actions"
import { notFound, redirect } from "next/navigation"
import { checkUserPermission } from "@/app/permissions/permission-actions"


export default async function NewTicketPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }
  const perm = await checkUserPermission(currentUser.id, "/tickets")
  if (perm.hasPermission === false) {
    return notFound()
  }
  const isAdmin = currentUser.role.includes("admin")
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

