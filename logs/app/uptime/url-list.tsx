"use client"

import { useEffect, useState, useCallback } from "react"
import { AlertCircle } from "lucide-react"
import { EditUrlModal } from "./edit-url-modal"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { SearchBar } from "./search-bar"
import { UrlFilters } from "./url-filters"
import { DraggableGrid } from "./draggable-grid"
import { UrlCard } from "./url-card"
import { StatusUpdates } from "./status-updates"
import { toast } from "sonner"
import { isWithinInterval, parseISO } from "date-fns"
import { MonitoredUrl } from "@/prisma/generated/main"
import { getUrls } from "./actions"


export default function UrlList() {
  const [urls, setUrls] = useState<MonitoredUrl[]>([])
  const [filteredUrls, setFilteredUrls] = useState<MonitoredUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUrl, setEditingUrl] = useState<MonitoredUrl | null>(null)
  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false)
  const [deletingUrl, setDeletingUrl] = useState<MonitoredUrl | null>(null)
  const [isDeleteUrlDialogOpen, setIsDeleteUrlDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    statuses: [] as string[],
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  })

  useEffect(() => {
    fetchUrls()
  }, [])

  // Memoize the applyFilters function to prevent unnecessary re-renders
  const applyFilters = useCallback(
    (data = urls) => {
      let filtered = [...data]

      // Apply text search
      if (searchQuery) {
        filtered = filtered.filter(
          (url) =>
            url.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            url.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            url.status.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply status filters
      if (filters.statuses.length > 0) {
        filtered = filtered.filter((url) => filters.statuses.includes(url.status))
      }

      // Apply date range filter
      if (filters.dateRange.from && filters.dateRange.to) {
        filtered = filtered.filter((url) => {
          if (!url.lastChecked) return false

          const checkedDate = parseISO(url.lastChecked.toString())
          return isWithinInterval(checkedDate, {
            start: filters.dateRange.from!,
            end: filters.dateRange.to!,
          })
        })
      } else if (filters.dateRange.from) {
        filtered = filtered.filter((url) => {
          if (!url.lastChecked) return false

          const checkedDate = parseISO(url.lastChecked.toString())
          return checkedDate >= filters.dateRange.from!
        })
      }

      setFilteredUrls(filtered)
    },
    [searchQuery, filters, urls],
  )

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters, urls, applyFilters])

  async function fetchUrls() {
    try {
      setLoading(true)
      const data = await getUrls()
      setUrls(data)
      applyFilters(data)
    } catch (error) {
      console.error("Failed to fetch URLs:", error)
      toast.error("Error", {
        description: "Failed to fetch URLs. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: {
    statuses: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => {
    setFilters(newFilters)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const checkUrlHealth = async (id: string) => {
    try {
      await fetch(`/api/check-url/${id}`, { method: "POST" })
      // Refresh the list after checking
      fetchUrls()
    } catch (error) {
      console.error("Failed to check URL health:", error)
      toast.error("Error", {
        description: "Failed to check URL health. Please try again.",
      })
    }
  }

  const handleEdit = (url:MonitoredUrl) => {

    setEditingUrl(url)
    setIsEditUrlModalOpen(true)
  }

  const handleDelete = (url:MonitoredUrl) => {


    setDeletingUrl(url)
    setIsDeleteUrlDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingUrl) return

    try {
      const response = await fetch(`/api/urls/${deletingUrl.id}`, {
        method: "DELETE",
        headers: {
          "X-Auth-Status": "authenticated",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete URL")
      }

      toast.success("URL Deleted", {
        description: "The URL has been deleted successfully.",
      })

      // Refresh the list
      fetchUrls()
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to delete URL. Please try again.",
      })
    }
  }

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>
  }

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No URLs added yet</h3>
        <p className="text-muted-foreground mt-2">Add your first URL to start monitoring</p>
      </div>
    )
  }

  // Prepare URL cards for the grid
  const gridItems = filteredUrls.map((url) => (
    <UrlCard
      key={`url-${url.id}`}
      url={url}
      onCheck={checkUrlHealth}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <SearchBar placeholder="Search URLs by name, address, or status..." onSearch={handleSearch} />
        <UrlFilters onFilterChange={handleFilterChange} />
      </div>

      {filteredUrls.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No URLs match your filters</p>
        </div>
      ) : (
        <DraggableGrid isEditable={true} storageKey="uptime-dashboard">
          {gridItems}
        </DraggableGrid>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Status Updates</h3>
        <StatusUpdates/>
      </div>
          <EditUrlModal
            isOpen={isEditUrlModalOpen}
            onOpenChange={setIsEditUrlModalOpen}
            url={editingUrl}
            onUpdateSuccess={fetchUrls}
          />

          <DeleteConfirmationDialog
            isOpen={isDeleteUrlDialogOpen}
            onOpenChange={setIsDeleteUrlDialogOpen}
            title="Delete URL"
            description="Are you sure you want to delete this URL? This action cannot be undone."
            onConfirm={confirmDelete}
          />
    </div>
  )
}
