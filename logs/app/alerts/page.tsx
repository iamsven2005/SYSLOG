/**
 * AlertsPage.tsx - Alerts Management Dashboard
 *
 * Purpose:
 * Provides an administrative interface for monitoring and managing alert conditions
 * and triggered alert events within the system.
 *
 * Key Components:
 * - `<DatabaseStatusBar />`: Shows DB connection/health status.
 * - `<AlertStats />`: Dashboard cards summarizing alert condition counts and alert states.
 * - `<Tabs>`: Two-tab interface for viewing alert conditions and alert events.
 *   - `<AlertConditionsTable />`: Lists and manages all alert conditions.
 *   - `<AlertEventsTable />`: Lists triggered alert events (filtered by unresolved).
 * - `<AlertDebugPanel />`: Optional debugging tool to simulate or test alert evaluations.
 * - "New Alert Condition" button: Link to creation form (`/alerts/new`).
 *
 * Features:
 * - Uses `Suspense` to defer loading of heavy components for better UX.
 * - Mobile-friendly grid layout with responsive columns for tabs and debug panel.
 * - Separates concerns between configuration (conditions) and operational logs (events).
 *
 * Access:
 * - This page should be protected for admin or system operator use only.
 *
 * Future Improvements:
 * - Add filters, pagination, and search for both tables.
 * - Include historical charting or trend data in stats.
 * - Integrate with notification systems or incident response tools.
 */

import { Suspense } from "react"
import { AlertConditionsTable } from "./alert-conditions-table"
import { AlertEventsTable } from "./alert-events-table"
import { AlertStats } from "./alert-stats"
import { AlertDebugPanel } from "./alert-debug-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { DatabaseStatusBar } from "@/components/database-status-bar"

export default async function AlertsPage() {

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DatabaseStatusBar />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">Manage system alerts and notifications</p>
        </div>
        <Button asChild>
          <Link href="/alerts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Alert Condition
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <AlertStats />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="conditions">
            <TabsList className="mb-4">
              <TabsTrigger value="conditions">Alert Conditions</TabsTrigger>
              <TabsTrigger value="events">Alert Events</TabsTrigger>
            </TabsList>
            <TabsContent value="conditions">
              <Suspense fallback={<div>Loading alert conditions...</div>}>
                <AlertConditionsTable />
              </Suspense>
            </TabsContent>
            <TabsContent value="events">
              <Suspense fallback={<div>Loading alert events...</div>}>
                <AlertEventsTable />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <AlertDebugPanel />
        </div>
      </div>
    </div>
  )
}

