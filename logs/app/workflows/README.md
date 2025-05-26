# Workflow Management System

This project allows users to manage audit workflows and their associated steps. It supports the creation, updating, and tracking of workflows and steps, as well as activity logging and real-time updates.

## Components Overview

1. **HomePage**: Displays a list of existing workflows or a prompt to create the first workflow. It includes a search feature and a button for creating new workflows.

   * **Features**: Search bar, workflow listing, create new workflow button, error handling for workflow loading issues.
   * **Dependencies**: `CreateWorkflowButton`, `EmptyWorkflows`, `WorkflowSearch`, `Card`, `Button`.

2. **CreateWorkflowButton**: A button that navigates to the "Create Workflow" page.

   * **Props**: `variant` (optional), `size` (optional), `className` (optional).

3. **EmptyWorkflows**: Displays a message and a button to create a new workflow when no workflows exist.

   * **Dependencies**: `CreateWorkflowButton`.

4. **WorkflowSteps**: Displays and manages the steps within a specific workflow.

   * **Features**: Search/filter steps, drag-and-drop reordering, step selection for detailed view, step editing and syncing with the server.
   * **Dependencies**: `StepDetail`, `WorkflowSearch`, `Card`, `Badge`, `Avatar`, `AvatarFallback`, `Input`.

5. **StepDetail**: Displays detailed information about a specific audit step, allowing users to edit its properties, view activity logs, and update it.

   * **Features**: Edit title, description, status, assigned user, and due date. View activity logs. Save changes or cancel.
   * **Dependencies**: `Button`, `Input`, `Textarea`, `Select`, `Popover`, `Calendar`, `StepLogs`.

6. **StepLogs**: Displays activity logs for a specific step. Users can add new logs and view existing ones.

   * **Features**: Add new logs, display existing logs with timestamps and creators, error handling for log fetching and adding.
   * **Dependencies**: `Button`, `Input`, `Avatar`, `AvatarFallback`.

7. **WorkflowSearch**: A search component for filtering workflows by a query string. Updates the URL with the search query and debounces the search for performance.

   * **Dependencies**: `Input`, `Search`.

8. **AddStepForm**: A form for adding a new step to a workflow. It allows input of the step's title, description, status, assignee, and due date.

   * **Features**: Input validation, dynamic addition of new steps, temporary step creation for new workflows.
   * **Dependencies**: `Button`, `Input`, `Textarea`, `Select`, `Popover`, `Calendar`.