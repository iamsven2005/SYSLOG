"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { RotateCw } from "lucide-react"
import { update_status } from "./actions"

interface StatusUpdate {
  id: string
  type: string
  message: string
}

interface EditStatusUpdateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  statusUpdate: StatusUpdate | null
  onUpdateSuccess: () => void
}

export function EditStatusUpdateModal({
  isOpen,
  onOpenChange,
  statusUpdate,
  onUpdateSuccess,
}: EditStatusUpdateModalProps) {
  const [type, setType] = useState(statusUpdate?.type || "feature")
  const [message, setMessage] = useState(statusUpdate?.message || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens with new data
  useState(() => {
    if (statusUpdate) {
      setType(statusUpdate.type)
      setMessage(statusUpdate.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!statusUpdate) return

    setIsSubmitting(true)
    try {
      await update_status(statusUpdate.id, type, message)


      toast.success("Status Update Updated", {
        description: "Your status update has been updated successfully.",
      })
      onUpdateSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update status. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Status Update</DialogTitle>
          <DialogDescription>Make changes to the status update below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Update Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select update type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Update</SelectItem>
                  <SelectItem value="maintenance">Scheduled Maintenance</SelectItem>
                  <SelectItem value="incident">Incident Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the update or incident..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
