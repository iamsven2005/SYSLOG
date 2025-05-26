/*
 * crm/projects/[id]/add/page.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Page to associate a company with a specific project in the CRM system.
 *
 * Features:
 *   - Displays form to select a company and assign its role in the project
 *   - Filters out companies already linked to the selected project
 *   - Handles no available companies case with redirection options
 *   - Fetches project and company data via server actions
 *
 * Notes:
 *   - Uses ShadCN UI components and Next.js routing
 *   - Relies on `getProject`, `getCompanies` and `ProjectCompanyForm`
 *   - Graceful fallback if all companies are already linked
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  ArrowLeft } from "lucide-react"
import { getProject } from "@/app/crm/actions/projects"
import { getCompanies } from "@/app/crm/actions/companies"
import ProjectCompanyForm from "@/app/crm/components/project-company-form"
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = props.params
  const projectId = Number.parseInt((await params).id)
  const { project, error: projectError } = await getProject(projectId)
  const { companies } = await getCompanies()

  if (projectError || !project) {
    return notFound()
  }

  // Filter out companies that are already associated with the project
  const availableCompanies =
    companies?.filter((company) => !project.companies?.some((pc) => pc.company.id === company.id)) || []

  return (

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/crm/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add Company to Project</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project: {project.name}</CardTitle>
            <CardDescription>Add a company to this project and define their role and contract details</CardDescription>
          </CardHeader>
          <CardContent>
            {availableCompanies.length > 0 ? (
              <ProjectCompanyForm projectId={projectId} companies={availableCompanies} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  All companies are already associated with this project or no companies exist.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/crm/companies/new">Create New Company</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/crm/projects/${projectId}`}>Back to Project</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
  )
}
