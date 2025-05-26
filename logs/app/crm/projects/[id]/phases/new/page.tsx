/*
 * crm/projects/[id]/phases/new/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server component for the "Add New Phase" page.
 *   It fetches the project by ID and ensures the project is valid.
 *   Displays a form for adding a new construction phase to the specified project.
 *
 * Props:
 *   - params: Route parameters, specifically the `id` of the project (as a string promise)
 *
 * Features:
 *   - Fetches project data via `getProject`
 *   - Verifies that the project exists and is linked to a `bridgeProject`
 *   - Displays `PhaseForm` to create a new phase for the project
 *   - If the project is not found or has errors, redirects to a "Not Found" page
 *
 * Dependencies:
 *   - UI Components: Card, Button, Link, ArrowLeft icon
 *   - Actions: `getProject`
 *   - Subcomponent: `PhaseForm`
 *   - Uses `notFound()` to handle invalid or missing project data
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getProject } from "@/app/crm/actions/projects"
import { notFound } from "next/navigation"
import PhaseForm from "@/app/crm/components/phase-form"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projectId = Number.parseInt(params.id)
  const { project, error } = await getProject(projectId)

  if (error || !project || !project.bridgeProject) {
    notFound()
  }


  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/crm/projects/${project.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add New Phase</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase Information</CardTitle>
          <CardDescription>Add a new construction phase to {project.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <PhaseForm project={{ id: project.id, bridgeProject: project.bridgeProject }} />
        </CardContent>
      </Card>
    </main>
  )
}
