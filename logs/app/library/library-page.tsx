/**
 * LibraryPage.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **LibraryPage** component provides a library management interface with search filters, a table for displaying library entries,
 *   pagination controls, and options for adding, editing, and managing library entries. It is designed for both admins and regular users.
 *   Admins have access to the functionality to add new entries, while regular users can view and search through the library entries.
 *
 * Key Features:
 *   - Displays a searchable list of library entries with pagination.
 *   - Allows admins to add new entries to the library using the **AddLibraryEntryDialog**.
 *   - Provides search filters like title, category, publication year, and attachments.
 *   - Supports pagination with controls to navigate between pages of entries.
 *   - Includes a refresh button for reloading the list of library entries.
 *   - Provides the ability to select the number of entries per page for better control over the displayed results.
 *
 * Key Components:
 *   - `LibrarySearchFilters`: A component to handle filtering options such as search query, category, publication year range, etc.
 *   - `LibraryTable`: A component to display the list of library entries in a table format with options for sorting and filtering.
 *   - `AddLibraryEntryDialog`: A dialog to allow admins to add new library entries.
 *   - `Button`: Used for actions like refreshing, pagination, and opening dialogs.
 *   - `Pagination Controls`: Enables the user to navigate between different pages of entries.
 *
 * Example Usage:
 *   ```tsx
 *   <LibraryPage
 *     entries={entries}
 *     total={totalEntries}
 *     totalPages={totalPages}
 *     currentPage={currentPage}
 *     pageSize={pageSize}
 *     isAdmin={isAdmin}
 *   />
 *   ```
 *
 * Notes:
 *   - The page includes filtering options and uses the URL query parameters to store filter values, which ensures that the user's search filters are maintained across page reloads.
 *   - Admin users have additional capabilities to manage library entries, such as adding new entries.
 *   - Pagination is implemented to allow users to navigate through large sets of entries efficiently.
 *   - The `handleSearch` function dynamically updates the search parameters and reloads the entries based on the selected filters.
 *   - **isSearching** is used to indicate that a search operation is in progress, providing feedback to the user while the results are being fetched.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { LibrarySearchFilters } from "./library-search-filters"
import { LibraryTable } from "./library-table"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { AddLibraryEntryDialog } from "./add-library-entry-dialog"
import { LibraryEntry } from "@/prisma/generated/main"
interface LibraryFilters {
  search?: string
  category?: string
  pubYearFrom?: number
  pubYearTo?: number
  creationDateFrom?: Date
  creationDateTo?: Date
  sortBy?: string
  sortOrder?: string
  hasAttachment?: boolean
}

interface LibraryPageProps {
  entries: LibraryEntry[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  isAdmin: boolean
}

export function LibraryPage({ entries, total, totalPages, currentPage, pageSize, isAdmin }: LibraryPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Track when search is in progress
  useEffect(() => {
    setIsSearching(false)
  }, [entries])

const handleSearch = (filters: LibraryFilters) => {
    setIsSearching(true)
    const params = new URLSearchParams(searchParams.toString())

    // Update search params based on filters
    if (filters.search) {
      params.set("search", filters.search)
    } else {
      params.delete("search")
    }

    if (filters.category) {
      params.set("category", filters.category)
    } else {
      params.delete("category")
    }

    if (filters.pubYearFrom) {
      params.set("pubYearFrom", filters.pubYearFrom.toString())
    } else {
      params.delete("pubYearFrom")
    }

    if (filters.pubYearTo) {
      params.set("pubYearTo", filters.pubYearTo.toString())
    } else {
      params.delete("pubYearTo")
    }

    if (filters.creationDateFrom) {
      params.set("creationDateFrom", filters.creationDateFrom.toISOString())
    } else {
      params.delete("creationDateFrom")
    }

    if (filters.creationDateTo) {
      params.set("creationDateTo", filters.creationDateTo.toISOString())
    } else {
      params.delete("creationDateTo")
    }

    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy)
    } else {
      params.delete("sortBy")
    }

    if (filters.sortOrder) {
      params.set("sortOrder", filters.sortOrder)
    } else {
      params.delete("sortOrder")
    }

    if (filters.hasAttachment !== undefined) {
      params.set("hasAttachment", filters.hasAttachment.toString())
    } else {
      params.delete("hasAttachment")
    }

    // Reset to first page on new search
    params.set("page", "1")

    // Keep the page size parameter
    if (pageSize !== 10) {
      params.set("pageSize", pageSize.toString())
    }

    // Update URL with new search params
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("page", page.toString())
    router.push(`${pathname}?${newParams.toString()}`)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          )}
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <LibrarySearchFilters onSearch={handleSearch} />

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {isSearching ? (
            <span className="animate-pulse">Searching...</span>
          ) : (
            <>
              Total {total} {total === 1 ? "entry" : "entries"}
            </>
          )}
        </p>
      </div>

      <LibraryTable entries={entries} onRefresh={handleRefresh} isAdmin={isAdmin} />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="hidden sm:flex"
            >
              <span className="sr-only">First page</span>
              <span aria-hidden="true">«</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous page</span>
              <span aria-hidden="true">‹</span>
            </Button>

            <div className="flex flex-wrap gap-1 max-w-[calc(100vw-120px)] justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .map((p) => {
                  // Show first page, last page, current page, and pages around current page
                  const showPage =
                    p === 1 ||
                    p === totalPages ||
                    (p >= currentPage - 2 && p <= currentPage + 2) ||
                    (currentPage <= 3 && p <= 5) ||
                    (currentPage >= totalPages - 2 && p >= totalPages - 4)

                  // Show ellipsis for page gaps
                  const showEllipsisBefore = p === currentPage - 3 || (currentPage > 4 && p === 2)
                  const showEllipsisAfter =
                    p === currentPage + 3 || (currentPage < totalPages - 3 && p === totalPages - 1)

                  if (showEllipsisBefore) {
                    return (
                      <span key={`ellipsis-before-${p}`} className="px-3 py-2 text-sm text-gray-500">
                        …
                      </span>
                    )
                  }

                  if (showEllipsisAfter) {
                    return (
                      <span key={`ellipsis-after-${p}`} className="px-3 py-2 text-sm text-gray-500">
                        …
                      </span>
                    )
                  }

                  if (showPage) {
                    return (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        className={p === currentPage ? "bg-blue-600 text-white" : ""}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    )
                  }

                  return null
                })
                .filter(Boolean)}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next page</span>
              <span aria-hidden="true">›</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:flex"
            >
              <span className="sr-only">Last page</span>
              <span aria-hidden="true">»</span>
            </Button>
          </nav>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Entries per page:</span>
          <select
            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams.toString())
              newParams.set("pageSize", e.target.value)
              newParams.set("page", "1") // Reset to first page when changing page size
              router.push(`${pathname}?${newParams.toString()}`)
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {isAdmin && (
        <AddLibraryEntryDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
}

