/**
 * NewTicketPage Component
 * 
 * This component renders the page for creating a new support ticket. It handles user authentication and authorization,
 * fetches the list of available devices, and retrieves the assignable users for the ticket.
 * It checks if the user is authorized to access the page (based on roles and permissions), and only proceeds if the user is allowed.
 * The page then renders the `NewTicketForm` component to allow the user to create a new ticket.
 * 
 * Methods:
 * - `allowed`: Checks if the current user has permission to access the page.
 * - `getCurrentUser`: Fetches the current logged-in user.
 * - `hasRole`: Verifies if the current user has the required role (admin).
 * - `db.devices.findMany`: Retrieves all devices in the system, ordered by name.
 * - `getAssignableUsers`: Fetches a list of users who are allowed to be assigned tickets.
 * 
 * State:
 * - `a`: Stores the result of the `allowed` function, determining whether the user has permission to view this page.
 * - `user`: The current logged-in user.
 * - `isAdmin`: A boolean flag indicating whether the current user has admin rights.
 * - `devices`: A list of devices available in the system, fetched from the database.
 * - `assignableUsersCleaned`: A cleaned list of users who can be assigned tickets, excluding users with null usernames.
 * 
 * Props passed to `NewTicketForm`:
 * - `deviceNames` (array): A list of device names available for selection in the ticket form.
 * - `assignableUsers` (array): A list of users who can be assigned the ticket.
 * - `isAdmin` (boolean): Flag indicating whether the current user has admin rights.
 * 
 * Dependencies:
 * - `NewTicketForm` from `@/app/tickets/new/new-ticket-form` to handle the form rendering.
 * - `getAssignableUsers` from `@/app/tickets/ticket-actions` to retrieve the list of assignable users.
 * - `db` from `@/lib/db` for accessing device data.
 * - `getCurrentUser` and `hasRole` from `@/app/login/auth` to manage authentication and role checking.
 * - `allowed` from `@/components/navbar` to check if the user is allowed to access the page.
 */

import { NewTicketForm } from "@/app/tickets/new/new-ticket-form"
import { getAssignableUsers } from "@/app/tickets/ticket-actions"
import { db } from "@/lib/db"
import { getCurrentUser, hasRole } from "@/app/login/auth"
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

