"use client"

import { AlertCircle, Zap, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface StatusUpdate {
  id: string
  type: string
  message: string
  createdAt: string
}

interface StatusUpdateCardProps {
  update: StatusUpdate
  isAuthenticated: boolean
  onEdit: (update: StatusUpdate) => void
  onDelete: (update: StatusUpdate) => void
}

export function StatusUpdateCard({ update, isAuthenticated, onEdit, onDelete }: StatusUpdateCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UpdateTypeBadge type={update.type} />
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
            </span>
          </div>
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(update)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(update)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm flex-grow">{update.message}</p>
      </CardContent>
    </Card>
  )
}

function UpdateTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "feature":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
        >
          <Zap className="h-3.5 w-3.5 mr-1" />
          Feature
        </Badge>
      )
    case "maintenance":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
        >
          <Clock className="h-3.5 w-3.5 mr-1" />
          Maintenance
        </Badge>
      )
    case "incident":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
        >
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          Incident
        </Badge>
      )
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}
