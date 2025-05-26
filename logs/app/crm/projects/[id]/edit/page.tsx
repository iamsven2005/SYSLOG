/**
 * app/crm/projects/[id]/edit/page.tsx
 * 
 * Page to edit an existing project.
 * 
 * Fetches the project by ID and displays a form pre-filled with project data.
 * If the project is not found, redirects to a 404 page.
 * 
 * Includes:
 * - Back button to the project details page
 * - Header with project name
 * - Editable form for project information (via ProjectForm component)
 * 
 * Route parameter:
 * - id: project ID
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getProject } from "../../../actions/projects"
import { notFound } from "next/navigation"
import ProjectForm from "../../../components/project-form"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; 
  const projectId = Number.parseInt(params.id)
  const { project, error } = await getProject(projectId)

  if (error || !project) {
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
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Edit details for {project.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>
    </main>
  )
}
