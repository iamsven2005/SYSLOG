/**
 * Page for editing the details of a material for a specific project.
 * 
 * - Fetches the material data using the materialId and ensures it is associated with the correct project.
 * - Displays the material details in a form for editing.
 * - Provides a back button to return to the project's detail page.
 * - If the material is not found or if the project ID does not match, returns a 404 error page.
 * 
 * Route Params:
 * - id: The ID of the project.
 * - materialId: The ID of the material to edit.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getMaterial } from "@/app/crm/actions/materials"
import MaterialForm from "@/app/crm/components/material-form"

export default async function Page(props: { params: Promise<{ id: string, materialId: string }> }) {
  const params = await props.params;
  const projectId = Number.parseInt(params.id)
  const materialId = Number.parseInt(params.materialId)

  const { material, error } = await getMaterial(materialId)

  if (error || !material || material.bridgeProject.projectId !== projectId) {
    return notFound()
  }

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Material</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Details</CardTitle>
          <CardDescription>Edit material for project: {material.bridgeProject.project.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialForm projectId={projectId} material={material} />
        </CardContent>
      </Card>
    </main>
  )
}
