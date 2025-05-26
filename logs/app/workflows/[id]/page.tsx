/**
 * Page Component
 * 
 * This component displays detailed information about a specific workflow. It includes:
 * - The workflow's name, description, and basic metadata such as creation and last update timestamps.
 * - A tabbed interface with two sections: "Steps" and "Details".
 * - The "Steps" tab displays a list of workflow steps, fetched asynchronously with a skeleton loading state.
 * - The "Details" tab provides metadata about the workflow, including the creation date, last updated date, and the total number of steps.
 * - An "Edit Workflow" button that links to the edit page for the workflow.
 * 
 * Features:
 * - Workflow metadata display (name, description, created date, updated date, step count).
 * - Tabbed navigation for viewing workflow steps and details.
 * - Skeleton loader for workflow steps while data is being fetched.
 * - Error handling in case the workflow cannot be fetched.
 * 
 * Props:
 * - `params` (Promise<{ id: string }>): A promise that resolves to an object containing the workflow's ID.
 * 
 * Dependencies:
 * - `Suspense` from React for handling asynchronous rendering of workflow steps.
 * - `Button`, `Card`, `CardContent` from the UI component library for UI elements.
 * - `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` for tabbed navigation.
 * - `WorkflowSteps` for displaying the steps of the workflow.
 * - `getWorkflowById` for fetching workflow data from the backend.
 * - `WorkflowStepsSkeleton` for rendering a loading state while workflow steps are fetched.
 * 
 * Methods:
 * - `getWorkflowById`: Fetches the workflow details by its ID.
 * 
 * State:
 * - `workflow`: The fetched workflow data.
 * - `error`: Any error that occurred while fetching the workflow data.
 */


import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkflowSteps } from "../workflow-steps"
import { getWorkflowById } from "../actions"
import { WorkflowStepsSkeleton } from "../workflow-steps-skeleton"
export default async function Page(props: { params: Promise<{ id: string }> }) {


  const { id } = await props.params; // ✅ await the promise
  const { success, data, error } = await getWorkflowById(id)

  if (!success || !data) {
    return (
      <div className="container py-10">
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          Error: {error || "Failed to load workflow"}
        </div>
      </div>
    )
  }
  const workflow = data; // ✅ TypeScript now knows it's defined

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
          <p className="text-muted-foreground mt-1">{workflow.description || "No description provided"}</p>
        </div>
        <Button>
          <Link href={`/workflows/${id}/edit`}>Edit Workflow</Link>
        </Button>
      </div>

      <Tabs defaultValue="steps">
        <TabsList className="mb-4">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <Suspense fallback={<WorkflowStepsSkeleton />}>
            <WorkflowSteps workflowId={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground">{new Date(workflow.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">{new Date(workflow.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Total Steps</h3>
                  <p className="text-sm text-muted-foreground">{workflow.steps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
