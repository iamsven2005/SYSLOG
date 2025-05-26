/**
 * AddStepForm Component
 * 
 * This component allows the user to add a new step to a workflow. It includes a form where the user can input step details 
 * such as the title, description, status, assignee, and due date. It also provides functionality to temporarily add steps 
 * in the "new workflow" mode before the workflow is saved.
 * 
 * Features:
 * - Inputs for step title, description, status, assignee, and due date.
 * - Status and assignee selection with options for various states and users.
 * - Supports dynamic addition of new steps during the workflow creation process.
 * - Handles form submission and step creation through API interaction.
 * 
 * Props:
 * - `workflowId` (string): The ID of the workflow to which the step will be added.
 * - `onAddTempStep` (function, optional): Callback for adding temporary steps during workflow creation.
 * 
 * Dependencies:
 * - `getUsers`: Fetches the list of users to assign steps.
 * - `createStep`: API function to create a new step in the workflow.
 * - `Button`, `Input`, `Label`, `Textarea`: UI components for form fields and actions.
 * - `Select`, `Popover`, `Calendar`: UI components for selecting status, assignee, and due date.
 * 
 * State:
 * - `title`, `description`, `status`, `assignedToId`, `date`: Form input values for creating a new step.
 * - `isSubmitting`: Indicates if the step is currently being added.
 * - `error`: Holds any error message if something goes wrong during step creation.
 * - `users`: Stores the list of users fetched for assigning to the step.
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUsers, createStep } from "./actions"
import type { AuditStep, StepStatus, User } from "./types"

interface AddStepFormProps {
  workflowId: string
  onAddTempStep?: (step: Omit<AuditStep, "id">) => void
}
interface TempAuditStep extends Omit<AuditStep, "id"> {
  id: number
  createdAt: string
  updatedAt: string
}

export function AddStepForm({ workflowId, onAddTempStep }: AddStepFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
const [status, setStatus] = useState<StepStatus>("PENDING")
const [assignedToId, setAssignedToId] = useState<number | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [users, setUsers] = useState<User[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if we're in "new workflow" mode
  const isNewWorkflow = workflowId === "new-workflow"

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

    if (isAdding) {
      fetchUsers()
    }
  }, [isAdding])

  const handleAddStep = async () => {
    if (!title.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // If we're creating a new workflow, add the step to the temporary steps
      if (isNewWorkflow && onAddTempStep) {
        // Create a temporary step with a temporary ID
        const tempStep: TempAuditStep = {
          id: -Date.now(),
          title,
          description,
          status,
          assignedToId,
          dueDate: date ?? null,
          position: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workflowId: 0
        }


        onAddTempStep(tempStep)
        resetForm()
        return
      }

      // Otherwise, add the step to an existing workflow
      const result = await createStep(workflowId, {
        title,
        description: description || undefined,
        status,
        assignedToId: assignedToId !== null ? assignedToId.toString() : null,
        dueDate: date?.toISOString() || undefined,
      })

      if (result.success) {
        resetForm()
      } else {
        setError(result.error || "Failed to add step")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("PENDING")
    setAssignedToId(null)
    setDate(undefined)
    setIsAdding(false)
    setError(null)
  }

  if (!isAdding) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Step
      </Button>
    )
  }

  return (
    <div className="border rounded-md p-4 space-y-4">
      <h3 className="font-medium">Add New Step</h3>

      {error && <div className="p-2 text-sm border rounded-md bg-destructive/10 text-destructive">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="new-step-title">Title</Label>
        <Input id="new-step-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Step title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-step-description">Description</Label>
        <Textarea
          id="new-step-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Step description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="new-step-status">Status</Label>
<Select
  value={assignedToId?.toString() || ""}
  onValueChange={(value) => setAssignedToId(value === "" ? null : Number(value))}
>
            <SelectTrigger id="new-step-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="REVIEW">Review</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-step-assignee">Assigned To</Label>
<Select
  value={assignedToId !== null ? assignedToId.toString() : ""}
  onValueChange={(value) => setAssignedToId(value === "" ? null : Number(value))}
>
            <SelectTrigger id="new-step-assignee">
              <SelectValue placeholder="Assign to user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.username || user.email || `User ${user.id}`} ({user.role.join(", ")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleAddStep} disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? "Adding..." : "Add Step"}
        </Button>
      </div>
    </div>
  )
}
