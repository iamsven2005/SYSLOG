/**
 * EmptyWorkflows Component
 * 
 * This component is displayed when there are no workflows available. It provides a message prompting the user to create their first
 * audit workflow. It includes a title, a brief description, and a button that navigates to the "Create Workflow" page.
 * 
 * Features:
 * - Displays a message when no workflows exist.
 * - Prompts the user to create their first workflow.
 * - Includes the `CreateWorkflowButton` for easy navigation to the creation page.
 * 
 * Dependencies:
 * - `CreateWorkflowButton`: A button that redirects the user to the "Create Workflow" page.
 */

import { CreateWorkflowButton } from "./create-workflow-button";

export function EmptyWorkflows() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <h2 className="text-2xl font-bold mb-2">No workflows yet</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Create your first audit workflow to start managing your engineering processes
      </p>
      <CreateWorkflowButton />
    </div>
  )
}
