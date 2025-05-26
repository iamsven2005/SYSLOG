/**
 * StepDetail Component
 * 
 * This component displays detailed information about a specific audit step, allowing the user to view and edit properties such as the 
 * title, description, status, assigned user, and due date. It also includes the ability to view activity logs associated with the step.
 * The component provides an option to save any changes made to the step and cancel the editing process.
 * 
 * Features:
 * - Allows the user to view and edit the title, description, status, assigned user, and due date of the step.
 * - Displays activity logs related to the step for tracking changes or actions.
 * - Includes a "Save Changes" button to apply updates and a "Cancel" button to discard changes.
 * - Supports the selection of a due date using a calendar popover.
 * 
 * Props:
 * - `step` (AuditStep): The step object containing the current step details to be edited.
 * - `workflowId` (string): The ID of the workflow the step belongs to.
 * - `onClose` (function): A function to close the step details modal or component.
 * - `onUpdate` (function): A function to update the step after changes are saved.
 * - `users` (User[]): A list of users available to assign to the step.
 * 
 * Methods:
 * - `handleSave`: Saves the updated step details by calling `onUpdate` and passing the edited step object.
 * - `setDate`: Updates the due date when selected from the calendar popover.
 * 
 * Dependencies:
 * - `Button`, `Input`, `Textarea`, `Label`, `Select`, `Popover`, `Calendar`: UI components for managing form inputs and UI interaction.
 * - `StepLogs`: A component that displays the activity logs for the current step.
 * - `format`: A function from `date-fns` for formatting the due date.
 * 
 * State:
 * - `editedStep`: The current state of the step being edited.
 * - `date`: The selected due date for the step.
 * - `isSaving`: A boolean flag indicating whether the save operation is in progress.
 * - `error`: Error message to be displayed if something goes wrong while saving.
 */


"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { StepLogs } from "./step-logs"
import type { AuditStep, StepStatus, User } from "./types"

interface StepDetailProps {
  step: AuditStep
  workflowId: string
  onClose: () => void
  onUpdate: (step: AuditStep) => void
  users: User[]
}

export function StepDetail({ step, onClose, onUpdate, users }: StepDetailProps) {
  const [editedStep, setEditedStep] = useState<AuditStep>({ ...step })
  const [date, setDate] = useState<Date | undefined>(step.dueDate ? new Date(step.dueDate) : undefined)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedStep = {
        ...editedStep,
        dueDate: date?.toISOString() || null,
      }
      await onUpdate(updatedStep as AuditStep)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={editedStep.title}
            onChange={(e) => setEditedStep({ ...editedStep, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={editedStep.description || ""}
            onChange={(e) => setEditedStep({ ...editedStep, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={editedStep.status}
onValueChange={(value) => setEditedStep({ ...editedStep, status: value as StepStatus })}
          >
            <SelectTrigger>
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
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select
            value={editedStep.assignedToId?.toString() || ""}
            onValueChange={(value) =>
              setEditedStep({ ...editedStep, assignedToId: value ? Number.parseInt(value) : null })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign to user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Unassigned</SelectItem>
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

        <div className="pt-4">
          <h3 className="font-medium mb-2">Activity Logs</h3>
          <StepLogs stepId={step.id.toString()} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
