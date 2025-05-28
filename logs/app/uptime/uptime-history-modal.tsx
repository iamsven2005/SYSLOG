"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UptimeHistoryGraph } from "./uptime-history-graph"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UptimeHistoryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  urlId: string
  urlName: string
}

export function UptimeHistoryModal({ isOpen, onOpenChange, urlId, urlName }: UptimeHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg sm:text-xl pr-6">Uptime History for {urlName}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="mt-4 w-full">
          <UptimeHistoryGraph urlId={urlId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
