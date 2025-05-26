/*
 * crm/projects/[id]/phases/[phaseId]/edit/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server component for the "Edit Phase" page.
 *   It fetches the project and phase by their respective IDs and ensures that the phase belongs to the correct project.
 *   Displays a form for editing the phase details within the specified project.
 *
 * Props:
 *   - params: Route parameters, specifically the `id` of the project and `phaseId` of the phase (as a string promise)
 *
 * Features:
 *   - Fetches project data via `getProject`
 *   - Fetches phase data via `getPhase`
 *   - Verifies that the phase is associated with the correct project
 *   - Displays `PhaseForm` to edit phase details
 *   - If the project or phase is not found or there are errors, redirects to a "Not Found" page
 *
 * Dependencies:
 *   - UI Components: Card, Button, Link, ArrowLeft icon
 *   - Actions: `getProject`, `getPhase`
 *   - Subcomponent: `PhaseForm`
 *   - Uses `notFound()` to handle invalid or missing project/phase data
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

import { notFound } from "next/navigation"
import PhaseForm from "@/app/crm/components/phase-form"
import { getProject } from "@/app/crm/actions/projects"
import { getPhase } from "@/app/crm/actions/phases"

export default async function Page(props: { params: Promise<{ id: string, phaseId: string }> }) {
  const params = await props.params;
  const projectId = Number.parseInt(params.id)
  const phaseId = Number.parseInt(params.phaseId)

  const { project, error: projectError } = await getProject(projectId)
  const { phase, error: phaseError } = await getPhase(phaseId)

  if (projectError || !project || phaseError || !phase) {
    notFound()
  }

  // Verify that the phase belongs to the project
  if (!project.bridgeProject || phase.bridgeProjectId !== project.bridgeProject.id) {
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
        <h1 className="text-2xl font-bold">Edit Phase</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase Information</CardTitle>
          <CardDescription>Edit phase details for {project.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <PhaseForm project={{ id: project.id, bridgeProject: project.bridgeProject }} phase={phase} />
        </CardContent>
      </Card>
    </main>
  )
}
