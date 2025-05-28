"use client"

import { useEffect, useState, useCallback } from "react"
import { formatDistanceToNow, isWithinInterval, parseISO } from "date-fns"
import { AlertCircle, Zap, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditStatusUpdateModal } from "./edit-status-update-modal"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { SearchBar } from "./search-bar"
import { StatusFilters } from "./status-filters"
import { toast } from "sonner"
import { delete_status, getStatusUpdates } from "./actions"
import { StatusUpdate } from "@/prisma/generated/main"


export function StatusUpdates() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const [filteredUpdates, setFilteredUpdates] = useState<StatusUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUpdate, setEditingUpdate] = useState<StatusUpdate | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingUpdate, setDeletingUpdate] = useState<StatusUpdate | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    types: [] as string[],
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  })

  useEffect(() => {
    fetchUpdates()
  }, [])

  // Memoize the applyFilters function to prevent unnecessary re-renders
  const applyFilters = useCallback(
    (data = updates) => {
      let filtered = [...data]

      // Apply text search
      if (searchQuery) {
        filtered = filtered.filter(
          (update) =>
            update.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.type.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply type filters
      if (filters.types.length > 0) {
        filtered = filtered.filter((update) => filters.types.includes(update.type))
      }

      // Apply date range filter
      if (filters.dateRange.from) {
        filtered = filtered.filter((update) => {
          const updateDate = parseISO(update.createdAt.toString())
          if (filters.dateRange.to) {
            return isWithinInterval(updateDate, {
              start: filters.dateRange.from!,
              end: filters.dateRange.to,
            })
          } else {
            // If only "from" date is specified, filter for updates on or after that date
            return updateDate >= filters.dateRange.from!
          }
        })
      }

      setFilteredUpdates(filtered)
    },
    [searchQuery, filters, updates],
  )

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters, updates, applyFilters])

  async function fetchUpdates() {
    try {
      setLoading(true)
      const data= await  getStatusUpdates()
      setUpdates(data)
      applyFilters(data)
    } catch (error) {
      console.error("Failed to fetch status updates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: {
    types: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => {
    setFilters(newFilters)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleEdit = (update: StatusUpdate) => {


    setEditingUpdate(update)
    setIsEditModalOpen(true)
  }

  const handleDelete = (update: StatusUpdate) => {
    setDeletingUpdate(update)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingUpdate ) return

    try {
      await delete_status(deletingUpdate.id)

      toast.success("Status Update Deleted", {
        description: "The status update has been deleted successfully.",
      })

      // Refresh the list
      fetchUpdates()
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to delete status update. Please try again.",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading updates...</div>
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No status updates yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <SearchBar placeholder="Search status updates by type or message..." onSearch={handleSearch} />
        <StatusFilters onFilterChange={handleFilterChange} />
      </div>

      {filteredUpdates.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No status updates match your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <div key={update.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UpdateTypeBadge type={update.type} />
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                  </span>
                </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(update)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(update)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              <p className="text-sm">{update.message}</p>
            </div>
          ))}
        </div>
      )}

          <EditStatusUpdateModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            statusUpdate={editingUpdate}
            onUpdateSuccess={fetchUpdates}
          />

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete Status Update"
            description="Are you sure you want to delete this status update? This action cannot be undone."
            onConfirm={confirmDelete}
          />
    </div>
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
