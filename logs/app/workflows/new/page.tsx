/**
 * NewWorkflowPage Component
 * 
 * This component is used to create a new workflow. It allows users to input workflow details, add steps to the workflow, and reorder those steps.
 * The workflow creation process includes:
 * - Adding a name and description for the workflow.
 * - Creating and managing steps for the workflow.
 * - Drag-and-drop reordering of steps within the workflow.
 * - Handling the creation of the workflow and its steps on the backend.
 * 
 * Features:
 * - Allows users to input a name and description for the workflow.
 * - Provides a drag-and-drop interface to reorder workflow steps.
 * - Supports adding new steps to the workflow dynamically.
 * - Workflow steps can be updated or deleted.
 * - The workflow and steps are saved to the backend, ensuring persistence.
 * 
 * Props:
 * - `params` (Promise<{ id: string }>): A promise that resolves to the workflow's ID.
 * 
 * Dependencies:
 * - `useState`, `useEffect` from React for managing local component state.
 * - `Button`, `Input`, `Textarea`, `Label`, `Card`, `CardContent`, `CardHeader`, `CardTitle` for UI elements.
 * - `ArrowLeft`, `GripVertical` from "lucide-react" for icons.
 * - `DragDropContext`, `Droppable`, `Draggable`, and `DropResult` from "@hello-pangea/dnd" for drag-and-drop functionality.
 * - `createWorkflow`, `createStep`, `getUsers` for backend interactions related to workflow creation, step management, and user fetching.
 * - `EditStepItem` and `AddStepForm` for displaying and adding workflow steps.
 * - `toast` for feedback on success or error states.
 * 
 * Methods:
 * - `handleDragEnd`: Handles the reordering of workflow steps when drag-and-drop occurs.
 * - `handleUpdateStep`: Updates a workflow step after editing.
 * - `handleDeleteStep`: Deletes a workflow step.
 * - `handleAddTempStep`: Adds a temporary step while the user is still creating the workflow.
 * - `handleCreateWorkflow`: Creates the workflow and associated steps on the backend.
 * 
 * State:
 * - `name`, `description`: Stores the workflow name and description input by the user.
 * - `steps`: Tracks the steps within the workflow.
 * - `isSubmitting`: Indicates whether the workflow is being created.
 * - `error`: Stores any error messages encountered during the creation process.
 * - `users`: Fetches and stores the list of users for step assignments.
 */



"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AddStepForm } from "../add-step-form"
import { ArrowLeft, GripVertical } from "lucide-react"
import { createWorkflow, createStep, getUsers } from "../actions"
import type { AuditStep, User } from "../types"
import { EditStepItem } from "../[id]/edit/edit-step-item"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { toast } from "sonner"

export default function NewWorkflowPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [steps, setSteps] = useState<AuditStep[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await getUsers()
        if (result.success && result.data) {
          setUsers(result.data)
        }

      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }

    fetchUsers()
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }))

    setSteps(updatedItems)
  }

  const handleUpdateStep = (updatedStep: AuditStep) => {
    setSteps(steps.map((step) => (step.id === updatedStep.id ? updatedStep : step)))
  }

  const handleDeleteStep = (stepId: number) => {
    const updatedSteps = steps.filter((step) => step.id !== stepId)
    // Reorder positions after deletion
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      position: index,
    }))
    setSteps(reorderedSteps)
  }

  const handleAddTempStep = (step: Omit<AuditStep, "id">) => {
    const newStep: AuditStep = {
      ...step,
      id: -Date.now(), // temp negative ID
    }

    setSteps((prev) => [
      ...prev,
      {
        ...newStep,
        position: prev.length,
      },
    ])
  }


  const handleCreateWorkflow = async () => {
    if (!name.trim()) {
      setError("Workflow name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // First create the workflow
      const workflowResult = await createWorkflow({
        name,
        description,
      })

      if (!workflowResult.success) {
        setError(workflowResult.error || "Failed to create workflow")
        return
      }

      const workflowId = workflowResult.data?.id?.toString() ?? ""

      // Then create all the steps if there are any
      if (steps.length > 0) {
        // Create steps in sequence to maintain order
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i]
          await createStep(workflowId, {
            title: step.title,
            description: step.description ?? undefined,
            status: step.status,
            assignedToId: step.assignedToId !== null ? step.assignedToId.toString() : null,
            dueDate: step.dueDate?.toISOString?.() ?? undefined,
          })

        }
      }

      toast.success("Your new workflow has been created successfully.")

      router.push(`/workflows/${workflowId}`)
    } catch (err) {
      console.error("Error creating workflow:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {error && <div className="p-4 border rounded-md bg-destructive/10 text-destructive mb-6">{error}</div>}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter workflow name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter workflow description (optional)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {steps.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mb-6">
                      {steps.map((step, index) => (
                        <Draggable key={step.id.toString()} draggableId={step.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md p-4 bg-card"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <EditStepItem
                                    step={step}
                                    users={users}
                                    onUpdate={handleUpdateStep}
                                    onDelete={() => handleDeleteStep(step.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No steps added yet. Add your first step below.</p>
              </div>
            )}

            <AddStepForm workflowId="new-workflow" onAddTempStep={handleAddTempStep} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleCreateWorkflow} disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? "Creating..." : "Create Workflow"}
          </Button>
        </div>
      </div>
    </div>
  )
}
