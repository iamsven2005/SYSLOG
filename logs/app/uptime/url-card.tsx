"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Clock, MoreVertical, Pencil, Trash2, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UptimeHistoryModal } from "./uptime-history-modal"
import { MonitoredUrl } from "@/prisma/generated/main"


interface MonitoredUrlCardProps {
  url: MonitoredUrl
  onCheck: (id: string) => Promise<void>
  onEdit: (url: MonitoredUrl) => void
  onDelete: (url: MonitoredUrl) => void
  onView: (url: MonitoredUrl) => void
}

export function UrlCard({ url, onCheck, onEdit, onDelete, onView }: MonitoredUrlCardProps) {

  return (
    <Card className="h-full">
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">{url.name}</h3>
              <StatusBadge status={url.status} />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground break-all">{url.url}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(url)}>
                  <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCheck(url.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Check Now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(url)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(url)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <span>
              Last checked:{" "}
              {url.lastChecked ? formatDistanceToNow(new Date(url.lastChecked), { addSuffix: true }) : "Never"}
            </span>
          </div>
          {url.responseTime && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Response time: {url.responseTime}ms</span>
            </div>
          )}
        </div>


      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "up":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 text-xs h-5"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Up
        </Badge>
      )
    case "down":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800 text-xs h-5"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Down
        </Badge>
      )
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 text-xs h-5"
        >
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 text-xs h-5"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          Unknown
        </Badge>
      )
  }
}
