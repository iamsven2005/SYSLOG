"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DatePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (date: Date | undefined, title?: string) => void
}

export function DatePickerDialog({ open, onOpenChange, onSelect }: DatePickerDialogProps) {
  const [date, setDate] = React.useState<Date>()
  const [title, setTitle] = React.useState("")

  const handleSelect = () => {
    onSelect(date, title)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
          <DialogDescription>Choose a date and add an optional title for your event.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title (optional)</Label>
            <Input
              id="title"
              placeholder="Meeting, Reminder, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!date}>
            Insert Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
