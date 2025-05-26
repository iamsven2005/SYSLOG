/**
 * Page for creating a new interaction related to a specific project.
 * 
 * - Fetches the project details using the project ID.
 * - Displays a form to record interactions with the project.
 * - If no project is found or if an error occurs, returns a 404 error page.
 * - Includes a back button to return to the project's detail page.
 * 
 * Route Params:
 * - id: The ID of the project to associate with the interaction.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getProject } from "@/app/crm/actions/projects"
import InteractionForm from "@/app/crm/components/interaction-form"
import { Company } from "@/prisma/generated/main"
type ProjectCompanyRelation = { company: Company }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projectId = Number.parseInt(params.id)
  const { project, error } = await getProject(projectId)

  if (error || !project) {
    return notFound()
  }

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/crm/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Interaction</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Project Interaction</CardTitle>
          <CardDescription>Record a new interaction related to project: {project.name}</CardDescription>
        </CardHeader>
        <CardContent>
<InteractionForm
  projects={[project]}
  preSelectedProjectId={projectId}
companies={(project.companies || []).map((c: ProjectCompanyRelation) => c.company)}
/>


        </CardContent>
      </Card>
    </main>
  )
}
