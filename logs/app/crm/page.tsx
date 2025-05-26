/*
 * app/crm/dashboard.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server-side component for the "Dashboard" page in the CRM system.
 *   It fetches data related to projects, companies, and interactions, calculates key statistics, and displays them in a dashboard view.
 *   The dashboard includes tabs for managing active projects and viewing recent interactions.
 *   The page uses skeleton loaders while fetching data to improve the user experience.
 *
 * Features:
 *   - Fetches data for projects, companies, and interactions via `getProjects`, `getCompanies`, and `getInteractions` actions
 *   - Displays key statistics such as active projects, contractors, upcoming inspections, and open bids
 *   - Implements tabs for navigating between active projects and recent interactions
 *   - Displays skeleton loaders while data is being fetched or if there is an error
 *   - Provides buttons for creating new projects and exporting data
 *   - Uses the `allowed` function to verify if the user has access to the CRM dashboard, redirecting to "Not Found" if not authorized
 *
 * Dependencies:
 *   - UI Components: `Button`, `Link`, `Card`, `Tabs`, `TabsContent`, `TabsTrigger`, `TabsList`, etc.
 *   - Actions: `getProjects`, `getCompanies`, `getInteractions`
 *   - Subcomponents: `DashboardStats`, `ProjectList`, `InteractionList`, `DashboardStatsSkeleton`, `ProjectListSkeleton`, `InteractionListSkeleton`
 *   - `allowed` for checking user permissions
 *   - `notFound()` for handling unauthorized access
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects } from "./actions/projects"
import { getCompanies } from "./actions/companies"
import { getInteractions } from "./actions/interactions"
import DashboardStats from "./components/dashboard-stats"
import ProjectList from "./components/project-list"
import InteractionList from "./components/interaction-list"
import DashboardStatsSkeleton from "./dashboard-stats-skeleton"
import ProjectListSkeleton from "./projects/project-list-skeleton"
import InteractionListSkeleton from "./interactions/interaction-list-skeleton"
import { notFound } from "next/navigation"
import { allowed } from "@/components/navbar"

export default async function Dashboard() {
  const { projects, error: projectsError } = await getProjects()
  const { companies, error: companiesError } = await getCompanies()
  const { interactions, error: interactionsError } = await getInteractions()

        const a = await allowed("/crm")
        if(a === false) notFound()
  // Calculate stats
  const activeProjects = projects?.filter((p) => p.status !== "COMPLETED" && p.status !== "CANCELLED") || []

  const contractors = companies?.filter((c) => c.type === "CONTRACTOR" || c.type === "SUBCONTRACTOR") || []

  // Get upcoming inspections (would need to fetch from phases)
  const upcomingInspections = 0

  // Get open bids (would need to fetch from bids)
  const openBids = 0

  return (

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {companiesError || projectsError ? (
          <DashboardStatsSkeleton />
        ) : (
          <DashboardStats
            activeProjects={activeProjects.length}
            contractors={contractors.length}
            upcomingInspections={upcomingInspections}
            openBids={openBids}
          />
        )}

        <Tabs defaultValue="projects">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="interactions">Recent Interactions</TabsTrigger>
            </TabsList>
            <div className="ml-auto">
              <Button asChild>
                <Link href="/crm/projects/new">New Project</Link>
              </Button>
            </div>
          </div>
          <TabsContent value="projects" className="border-none p-0">
            <Card>
              <CardHeader>
                <CardTitle>Bridge Projects</CardTitle>
                <CardDescription>Manage your active bridge construction projects.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {projectsError ? (
                  <div className="p-4">
                    <ProjectListSkeleton />
                  </div>
                ) : (
                  <ProjectList projects={activeProjects} />
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" asChild>
                  <Link href="/crm/projects">View All Projects</Link>
                </Button>
                <Button variant="outline">Export Data</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="interactions" className="border-none p-0">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interactions</CardTitle>
                <CardDescription>Track your recent communications with contractors and vendors.</CardDescription>
              </CardHeader>
              <CardContent>
                {interactionsError ? (
                  <InteractionListSkeleton />
                ) : (
                  <InteractionList interactions={interactions?.slice(0, 5) || []} />
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/crm/interactions">View All Interactions</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
  )
}
