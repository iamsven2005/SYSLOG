/**
 * TicketsPage Component
 * 
 * This component renders the support tickets page, displaying a status bar, ticket statistics (for admins),
 * and a table of tickets. It also provides a link to create a new ticket.
 * The page performs user authentication and role verification to ensure the user has the necessary permissions to view the page.
 * 
 * Features:
 * - Displays a database status bar at the top of the page using the `DatabaseStatusBar` component.
 * - Provides a button to navigate to the "New Ticket" page for creating a new ticket.
 * - Displays ticket statistics for admins using the `TicketStats` component.
 * - Shows the `TicketsTable` with ticket details, filtered by the user's ID and admin status.
 * 
 * Props:
 * - `isAdmin` (boolean): Flag indicating whether the current user is an admin.
 * - `user.id` (number): The ID of the current user, used to filter ticket data.
 * 
 * Dependencies:
 * - `Button` from `@/components/ui/button` for rendering the new ticket button.
 * - `PlusCircle` icon from `lucide-react` for the "New Ticket" button icon.
 * - `Link` from `next/link` for routing to the "New Ticket" page.
 * - `DatabaseStatusBar` for displaying database-related status information.
 * - `TicketStats` for displaying statistics related to tickets (only visible to admins).
 * - `TicketsTable` for rendering the tickets in a table format.
 * - `getCurrentUser` and `hasRole` for fetching and verifying the user's role.
 * - `allowed` for checking if the user has access to this page.
 * 
 * Methods:
 * - `allowed`: Verifies if the current user is authorized to access the tickets page.
 * - `getCurrentUser`: Retrieves the current user's details to determine if they are logged in and their roles.
 * - `hasRole`: Checks if the current user has specific roles (e.g., admin) to determine what content they can view.
 */

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DatabaseStatusBar } from "@/components/database-status-bar"
import { TicketStats } from "./ticket-stats"
import { TicketsTable } from "./tickets-table"
import { getCurrentUser, hasRole } from "../login/auth"
import { notFound } from "next/navigation"
import { allowed } from "@/components/navbar"

export default async function TicketsPage() {

  const a = await allowed("/tickets")
  const user = await getCurrentUser()
    if(a === false || !user) notFound()

  const isAdmin = await hasRole(user, ["admin"])
  return (
    <div className="container mx-auto py-6 p-5">
      <DatabaseStatusBar />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Link href="/tickets/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {isAdmin && (
        <TicketStats />
      )}
        <TicketsTable isAdmin={isAdmin} id={user.id}/>
    </div>
  )
}

