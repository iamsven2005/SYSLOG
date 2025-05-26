import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DatabaseStatusBar } from "@/components/database-status-bar"
import { TicketsTableSkeleton } from "./tickets-table-skeleton"
import { TicketStats } from "./ticket-stats"
import { TicketsTable } from "./tickets-table"
import { getCurrentUser, hasRole } from "../login/actions"
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

      <Suspense fallback={<TicketsTableSkeleton />}>
      {isAdmin && (
        <TicketStats />
      )}
        <TicketsTable isAdmin={isAdmin} id={user.id}/>
      </Suspense>
    </div>
  )
}

