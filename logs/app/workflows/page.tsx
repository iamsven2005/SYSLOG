/**
 * HomePage Component
 * 
 * This component serves as the main landing page for the "Audit Workflows" section. It displays a list of workflows if available,
 * or prompts the user to create their first workflow if no workflows are present. It includes a search bar, a button to create a new workflow,
 * and displays a list of workflows in a card format with key information such as name, creation date, description, and the number of steps.
 * 
 * Features:
 * - Displays a search bar and button to create a new workflow.
 * - Fetches and displays a list of workflows with key details.
 * - Includes error handling if workflows cannot be fetched.
 * - Provides a link to view all workflows if there are more than three.
 * - Shows a prompt to create a workflow if none exist.
 * 
 * Dependencies:
 * - `CreateWorkflowButton`: Button component for creating a new workflow.
 * - `EmptyWorkflows`: Component displayed when no workflows are available.
 * - `WorkflowSearch`: Component for searching workflows.
 * - `Card`, `CardContent`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`: Components used to display each workflow in a card format.
 * - `getWorkflows`: Function to fetch workflows based on a search query.
 * 
 * Props:
 * - `searchParams`: A promise that resolves to the query string used for searching workflows.
 * 
 * Methods:
 * - `getWorkflows(query)`: Fetches workflows based on the provided search query.
 * - `toLocaleDateString()`: Formats the creation date of the workflow.
 */


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateWorkflowButton } from "./create-workflow-button"
import { EmptyWorkflows } from "./empty-workflows"
import { WorkflowSearch } from "./workflow-search"
import { getWorkflows } from "./actions"

export default async function HomePage({
  searchParams,
}: {
    searchParams: Promise<{ query: string }>

}) {
  const query = (await searchParams).query || ""
  const { success, data: workflows, error } = await getWorkflows(query)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Workflows</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <WorkflowSearch />
          <CreateWorkflowButton />
        </div>
      </div>

      {!success || !workflows ? (
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          Error: {error || "Failed to load workflows"}
        </div>
      ) : workflows.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Workflows</h2>
            <Button variant="outline" asChild>
              <Link href="/workflows">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.slice(0, 3).map((workflow) => (
              <Link href={`/workflows/${workflow.id}`} key={workflow.id}>
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{workflow.name}</CardTitle>
                    <CardDescription>Created on {new Date(workflow.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description || "No description provided"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">{workflow.steps.length} steps</div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <EmptyWorkflows />
      )}
    </div>
  )
}
