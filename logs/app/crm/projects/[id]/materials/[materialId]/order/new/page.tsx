/*
 * crm/projects/[id]/materials/[materialId]/order/new/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server component for the "Create Material Order" page.
 *   It fetches the material by ID and verifies it is associated with the correct project.
 *   Displays a form for creating a new order for the selected material in the specified project.
 *
 * Props:
 *   - params: Route parameters, specifically the `id` of the project and `materialId` of the material (as a string promise)
 *
 * Features:
 *   - Fetches material data via `getMaterial`
 *   - Verifies the material is associated with the correct project
 *   - Displays `MaterialOrderForm` to create a new order
 *   - If the material is not found or doesn't match the project, redirects to a "Not Found" page
 *
 * Dependencies:
 *   - UI Components: Card, Button, Link, ArrowLeft icon
 *   - Actions: `getMaterial`
 *   - Subcomponent: `MaterialOrderForm`
 *   - Uses `notFound()` to handle invalid or missing material data
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  ArrowLeft } from "lucide-react"
import { getMaterial } from "@/app/crm/actions/materials"
import MaterialOrderForm from "@/app/crm/components/material-order-form"

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
          <h1 className="text-2xl font-bold">Create Material Order</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Create a new order for {material.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialOrderForm projectId={projectId} materialId={materialId} material={material} />
          </CardContent>
        </Card>
      </main>
  )
}
