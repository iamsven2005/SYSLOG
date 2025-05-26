/**
 * LibrarySearchFilters.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **LibrarySearchFilters** component provides a comprehensive filtering interface for searching through the library's entries.
 *   Users can filter entries based on various criteria such as title, reference number, category, publication year, creation date, and attachment presence.
 *   It includes dropdowns for categories, sorting options, and date pickers for filtering by creation dates.
 *   The component is designed for use in library management pages to allow users to fine-tune their search results.
 *
 * Key Features:
 *   - Allows users to search by multiple fields: title, reference number, author, category, etc.
 *   - Includes options for filtering based on publication year range and creation date range.
 *   - Sort library entries by various fields such as reference number, title, and publication year.
 *   - Provides options to filter by the presence of file attachments (with options like "Any", "Has Attachment", and "No Attachment").
 *   - Includes a reset button to clear all filters and return to default search settings.
 *
 * Key Components:
 *   - `LibrarySearchFilters`: Main filtering component to handle search criteria.
 *   - `Button`: Used for submitting the search form and resetting filters.
 *   - `Input`: Allows users to type search queries for title, reference number, and author.
 *   - `Select`: Dropdown components for category, sorting, and attachment filters.
 *   - `Calendar`: Date picker to select start and end dates for creation date filtering.
 *   - `Popover` and `PopoverContent`: To display the calendar date picker popups.
 *   - `Search`: Icon button used for submitting the search form.
 *
 * Example Usage:
 *   ```tsx
 *   <LibrarySearchFilters onSearch={handleSearch} />
 *   ```
 *
 * Notes:
 *   - **Search Filters**: The component allows filtering by several parameters (e.g., title, category, pub year, creation date) and updates the search results dynamically.
 *   - **Date Pickers**: Used to select ranges for publication year and creation date.
 *   - **Sort By**: Allows users to specify how the search results should be sorted, with options for ascending or descending order.
 *   - **Reset**: Clears all selected filters and allows users to start a new search.
 */

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategories } from "@/app/library/library-actions"

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

interface LibrarySearchFiltersProps {
  onSearch: (filters: LibraryFilters) => void
}


export function LibrarySearchFilters({ onSearch }: LibrarySearchFiltersProps) {
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [pubYearFrom, setPubYearFrom] = useState(searchParams.get("pubYearFrom") || "")
  const [pubYearTo, setPubYearTo] = useState(searchParams.get("pubYearTo") || "")
  const [creationDateFrom, setCreationDateFrom] = useState<Date | undefined>(
    searchParams.get("creationDateFrom") ? new Date(searchParams.get("creationDateFrom")!) : undefined,
  )
  const [creationDateTo, setCreationDateTo] = useState<Date | undefined>(
    searchParams.get("creationDateTo") ? new Date(searchParams.get("creationDateTo")!) : undefined,
  )
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "refNo")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc")
  const [hasAttachment, setHasAttachment] = useState(searchParams.get("hasAttachment") || "any")

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [])

  const handleSearch = () => {
    const filters = {
      search,
      category,
      pubYearFrom: pubYearFrom ? Number.parseInt(pubYearFrom) : undefined,
      pubYearTo: pubYearTo ? Number.parseInt(pubYearTo) : undefined,
      creationDateFrom,
      creationDateTo,
      sortBy,
      sortOrder,
      hasAttachment: hasAttachment === "true" ? true : hasAttachment === "false" ? false : undefined,
    }

    onSearch(filters)
  }

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    setPubYearFrom("")
    setPubYearTo("")
    setCreationDateFrom(undefined)
    setCreationDateTo(undefined)
    setSortBy("refNo")
    setSortOrder("asc")
    setHasAttachment("any")

    onSearch({})
  }

  return (
    <div className="border border-blue-200 rounded-md p-4 mb-6">
      <div className="text-lg font-semibold mb-4">
        The library information listed or entered below is applicable for YWL Group.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="search" className="block mb-2 font-medium">
            Title / Ref. No / Author / Remarks
          </Label>
          <Input
            id="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="category" className="block mb-2 font-medium">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat || "new"}>
                  {cat || "new"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="hasAttachment" className="block mb-2 font-medium">
            Attached File
          </Label>
          <Select value={hasAttachment} onValueChange={setHasAttachment}>
            <SelectTrigger id="hasAttachment">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="true">Has Attachment</SelectItem>
              <SelectItem value="false">No Attachment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="pubYearFrom" className="block mb-2 font-medium">
            Pub. Year From
          </Label>
          <Input
            id="pubYearFrom"
            type="number"
            placeholder="Year"
            value={pubYearFrom}
            onChange={(e) => setPubYearFrom(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="pubYearTo" className="block mb-2 font-medium">
            Pub. Year To
          </Label>
          <Input
            id="pubYearTo"
            type="number"
            placeholder="Year"
            value={pubYearTo}
            onChange={(e) => setPubYearTo(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label className="block mb-2 font-medium">Creation Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !creationDateFrom && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {creationDateFrom ? format(creationDateFrom, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={creationDateFrom} onSelect={setCreationDateFrom} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="block mb-2 font-medium">Creation Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !creationDateTo && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {creationDateTo ? format(creationDateTo, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={creationDateTo} onSelect={setCreationDateTo} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="sortBy" className="font-medium">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy" className="w-[180px]">
              <SelectValue placeholder="Reference No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="refNo">Ref No.</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="pubYear">Publication Year</SelectItem>
              <SelectItem value="creationDate">Creation Date</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger id="sortOrder" className="w-[120px]">
              <SelectValue placeholder="Ascending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}

