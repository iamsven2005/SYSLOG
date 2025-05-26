/**
 * AddProjectModal.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component renders a modal dialog for creating a new project. The user can input the project details, including the business 
 *   code, project code, and project name. Once the form is submitted, it calls the `createProject` function to create the project and 
 *   displays success or error messages using `toast`. The modal will close after a successful creation, and the parent component can 
 *   refresh its data by calling the `onSuccess` callback.
 *
 * Components:
 *   - `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`: Modal dialog components used to create a popup form.
 *   - `Button`: A button used to trigger the project creation.
 *   - `Input`: Form fields for the business code, project code, and project name.
 *   - `Label`: Labels for the form fields.
 *   - `toast`: Used for displaying success and error notifications.
 * 
 * Props:
 *   - `isOpen`: A boolean flag that controls whether the modal is open or closed.
 *   - `onClose`: A function to close the modal when called.
 *   - `onSuccess`: A function to trigger when the project creation is successful, typically used to refresh the project list.
 *
 * Behavior:
 *   - The modal will be displayed if the `isOpen` prop is true. It contains input fields for the project details and a submit button.
 *   - When the "Create Project" button is clicked, the `handleCreateProject` function is triggered, which calls the `createProject` 
 *     function with the provided data.
 *   - If the project creation is successful, a success message is shown, the modal is closed, and the `onSuccess` callback is called.
 *   - If the creation fails, an error message is displayed.
 * 
 * Notes:
 *   - The form's submit button is disabled while the project creation is in progress to prevent multiple submissions.
 *   - After the form is successfully submitted, the modal is closed, and the form fields are reset.
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createProject } from "./project-actions"

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [businessCode, setBusinessCode] = useState("")
  const [projectCode, setProjectCode] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateProject = async () => {
    try {
      setLoading(true)
      await createProject({
        businessCode,
        projectCode,
        name,
      })
      toast.success("Project created successfully")
      onSuccess() // Refresh project data
      onClose()
    } catch (error) {
      console.error("Failed to create project:", error)
      toast.error("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label htmlFor="businessCode">Business Code</Label>
          <Input
            id="businessCode"
            value={businessCode}
            onChange={(e) => setBusinessCode(e.target.value)}
            placeholder="e.g., YWL"
          />

          <Label htmlFor="projectCode">Project Code</Label>
          <Input
            id="projectCode"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            placeholder="e.g., 00001"
          />

          <Label htmlFor="name">Project Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" />
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleCreateProject} disabled={loading}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

