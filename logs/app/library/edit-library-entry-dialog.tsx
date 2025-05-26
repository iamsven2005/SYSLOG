/**
 * edit-library-entry-dialog.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **EditLibraryEntryDialog** component allows users to edit existing library entries.
 *   Users can modify the book's reference number, title, category, author, publication year, remarks, and attachment URL.
 *   The component is designed to work with a modal dialog that displays the form fields and provides submit and cancel buttons.
 *
 * Key Features:
 *   - **Edit Form**: Enables users to edit existing library entry details.
 *   - **Validation**: Ensures that required fields (reference number, title, and category) are filled in correctly.
 *   - **Submission Handling**: Handles submission of updated data and displays a success or error message.
 *   - **Loading State**: The save button is disabled while the form is being submitted.
 *
 * Key Components:
 *   - `Dialog`: A modal dialog that displays the edit form.
 *   - `Form`: A form built using `react-hook-form` for validation and state management.
 *   - `Button`: Buttons for submitting or canceling the form.
 *   - `toast`: Provides feedback (success or error messages) after form submission.
 *
 * Example Usage:
 *   ```tsx
 *   <EditLibraryEntryDialog entry={entry} isOpen={isOpen} onClose={handleClose} onSuccess={handleSuccess} />
 *   ```
 *
 * Notes:
 *   - **Field validation**: Ensures that required fields (like reference number, title, and category) are entered correctly.
 *   - The `handleSubmit` function handles form submission and calls the `updateLibraryEntry` function to save the changes.
 *   - If the update is successful, a success message is shown and the form is reset. If there's an error, an error message is shown instead.
 *   - The dialog is closed and refreshed upon successful submission.
 */

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateLibraryEntry } from "@/app/library/library-actions"
import { LibraryEntry } from "@/prisma/generated/main"

interface EditLibraryEntryDialogProps {
  entry: LibraryEntry
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const formSchema = z.object({
  refNo: z.string().min(1, "Reference number is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().optional(),
  pubYear: z.coerce.number().optional(),


  remarks: z.string().optional(),
  attachmentUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function EditLibraryEntryDialog({ entry, isOpen, onClose, onSuccess }: EditLibraryEntryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refNo: entry.refNo,
      title: entry.title,
      category: entry.category,
      author: entry.author || "",
      pubYear: entry.pubYear ?? undefined, // ✅ number or undefined
      remarks: entry.remarks || "",
      attachmentUrl: entry.attachmentUrl || "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      await updateLibraryEntry(entry.id, {
        ...values,
        pubYear: values.pubYear ?? null,
      })

      toast.success("Library entry updated successfully")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating library entry:", error)
      toast.error("Failed to update library entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Library Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refNo">Reference Number *</Label>
              <Input id="refNo" {...form.register("refNo")} placeholder="e.g., 0001" />
              {form.formState.errors.refNo && (
                <p className="text-sm text-red-500">{form.formState.errors.refNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" {...form.register("category")} placeholder="e.g., PM9" />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...form.register("title")} placeholder="Enter book title" />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...form.register("author")} placeholder="Enter author name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pubYear">Publication Year</Label>
              <Input id="pubYear" type="number" {...form.register("pubYear")} placeholder="e.g., 2023" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachmentUrl">Attachment URL</Label>
            <Input id="attachmentUrl" {...form.register("attachmentUrl")} placeholder="Enter URL to PDF or document" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea id="remarks" {...form.register("remarks")} placeholder="Additional notes or remarks" rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

