"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { RotateCw } from "lucide-react"

interface Url {
  id: string
  name: string
  url: string
}

interface EditUrlModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  url: Url | null
  onUpdateSuccess: () => void
}

export function EditUrlModal({ isOpen, onOpenChange, url, onUpdateSuccess }: EditUrlModalProps) {
  const [name, setName] = useState(url?.name || "")
  const [urlValue, setUrlValue] = useState(url?.url || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens with new data
  useState(() => {
    if (url) {
      setName(url.name)
      setUrlValue(url.url)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/urls/${url.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Status": "authenticated",
        },
        body: JSON.stringify({ name, url: urlValue }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update URL")
      }

      toast.success("URL Updated", {
        description: "Your URL has been updated successfully.",
      })
      onUpdateSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update URL. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit URL</DialogTitle>
          <DialogDescription>Make changes to the monitored URL below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Website" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
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
