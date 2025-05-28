"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { format } from "date-fns"

interface UrlFiltersProps {
  onFilterChange: (filters: {
    statuses: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
}

export function UrlFilters({ onFilterChange }: UrlFiltersProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isStatusesOpen, setIsStatusesOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)

  const handleStatusChange = (status: string) => {
    let newStatuses: string[]

    if (status === "all") {
      newStatuses = []
    } else if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter((s) => s !== status)
    } else {
      newStatuses = [...selectedStatuses, status]
    }

    setSelectedStatuses(newStatuses)
    onFilterChange({ statuses: newStatuses, dateRange })
  }

  const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    if (range.from) {
      onFilterChange({ statuses: selectedStatuses, dateRange: range })
    }
  }

  const clearFilters = () => {
    setSelectedStatuses([])
    setDateRange({ from: undefined, to: undefined })
    onFilterChange({ statuses: [], dateRange: { from: undefined, to: undefined } })
  }

  const hasActiveFilters = selectedStatuses.length > 0 || dateRange.from !== undefined

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center">
        <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Popover open={isStatusesOpen} onOpenChange={setIsStatusesOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            Status
            {selectedStatuses.length > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                {selectedStatuses.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-2">
            <div className="grid gap-1">
              <Button variant="ghost" className="justify-start font-normal" onClick={() => handleStatusChange("all")}>
                All Statuses
              </Button>
              <Button
                variant={selectedStatuses.includes("up") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleStatusChange("up")}
              >
                Up
              </Button>
              <Button
                variant={selectedStatuses.includes("down") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleStatusChange("down")}
              >
                Down
              </Button>
              <Button
                variant={selectedStatuses.includes("pending") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleStatusChange("pending")}
              >
                Pending
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Last Checked"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
