/*
 * create-folder-button.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Client-side component for creating a new folder in the user's drive.
 *   It opens a dialog where users can input a folder name, and upon submission, a new folder is created.
 *   The component also provides a confirmation message and updates the parent component after the folder is created.
 *
 * Features:
 *   - Allows users to create a new folder by entering a folder name
 *   - Validates that the folder name is not empty before submission
 *   - Displays a "Creating..." button state while the folder is being created
 *   - Closes the dialog upon successful folder creation and resets the input field
 *   - Sends a notification via `toast` to inform the user of the result (success or error)
 *   - Triggers an event via the `/api/drive-events` endpoint to notify the system of the new folder creation
 *   - Includes a button to open the dialog and an input field for the folder name
 *
 * Props:
 *   - `parentId`: The ID of the parent folder where the new folder will be created (can be `null` for root)
 *   - `onFolderCreated`: A callback function to trigger after the folder is created, usually used to refresh the list of folders
 *
 * Dependencies:
 *   - UI Components: `Button`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `DialogClose`, `Input`, `Label`
 *   - `createFolder`: Function that interacts with the backend to create the folder
 *   - `toast`: For displaying success and error messages
 */

"use client"

import { useState } from "react"
import { FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createFolder } from "./drive-actions"
import { toast } from "sonner"

interface CreateFolderButtonProps {
  parentId: number | null
  onFolderCreated: () => Promise<void>
}

export function CreateFolderButton({ parentId, onFolderCreated }: CreateFolderButtonProps) {
  const [folderName, setFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty")
      return
    }

    setIsCreating(true)

    try {
      await createFolder(folderName, parentId)
      await fetch("/api/drive-events", {
        method: "POST",
        body: JSON.stringify({ type: "folder_created" }),
        headers: { "Content-Type": "application/json" }
      })      
      toast.success("Folder created successfully")
      setFolderName("")
      setOpen(false)
      await onFolderCreated()
    } catch (error) {
      toast.error("Failed to create folder")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder()
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreateFolder} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

