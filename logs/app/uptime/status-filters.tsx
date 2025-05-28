"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { format } from "date-fns"

interface StatusFiltersProps {
  onFilterChange: (filters: {
    types: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
}

export function StatusFilters({ onFilterChange }: StatusFiltersProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isTypesOpen, setIsTypesOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)

  const handleTypeChange = (type: string) => {
    let newTypes: string[]

    if (type === "all") {
      newTypes = []
    } else if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter((t) => t !== type)
    } else {
      newTypes = [...selectedTypes, type]
    }

    setSelectedTypes(newTypes)
    onFilterChange({ types: newTypes, dateRange })
  }

  const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    if (range.from) {
      onFilterChange({ types: selectedTypes, dateRange: range })
    }
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setDateRange({ from: undefined, to: undefined })
    onFilterChange({ types: [], dateRange: { from: undefined, to: undefined } })
  }

  const hasActiveFilters = selectedTypes.length > 0 || dateRange.from !== undefined

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center">
        <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Popover open={isTypesOpen} onOpenChange={setIsTypesOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            Type
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-2">
            <div className="grid gap-1">
              <Button variant="ghost" className="justify-start font-normal" onClick={() => handleTypeChange("all")}>
                All Types
              </Button>
              <Button
                variant={selectedTypes.includes("feature") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleTypeChange("feature")}
              >
                Feature
              </Button>
              <Button
                variant={selectedTypes.includes("maintenance") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleTypeChange("maintenance")}
              >
                Maintenance
              </Button>
              <Button
                variant={selectedTypes.includes("incident") ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handleTypeChange("incident")}
              >
                Incident
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
              "Date Range"
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
