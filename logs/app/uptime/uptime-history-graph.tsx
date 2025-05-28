"use client"

import { useState, useEffect } from "react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface UptimeData {
  date: string
  upPercentage: number
  totalChecks: number
  upChecks: number
  downChecks: number
  avgResponseTime: number | null
  lastCheckTime: string | null
  minResponseTime: number | null
  maxResponseTime: number | null
}

interface UptimeHistoryGraphProps {
  urlId: string
}

export function UptimeHistoryGraph({ urlId }: UptimeHistoryGraphProps) {
  const [historyData, setHistoryData] = useState<UptimeData[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("week")
  const [selectedDay, setSelectedDay] = useState<UptimeData | null>(null)

  useEffect(() => {
    fetchHistoryData(period)
  }, [urlId, period])

  const fetchHistoryData = async (timePeriod: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/uptime-history/${urlId}?period=${timePeriod}`)
      const data = await response.json()
      setHistoryData(data)
    } catch (error) {
      console.error("Failed to fetch uptime history:", error)
    } finally {
      setLoading(false)
    }
  }

  // Generate empty data for days with no checks
  const generateEmptyData = (period: string): UptimeData[] => {
    const today = new Date()
    let days = 7

    switch (period) {
      case "day":
        days = 1
        break
      case "week":
        days = 7
        break
      case "month":
        days = 30
        break
      case "year":
        days = 365
        break
    }

    const dateRange = eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today,
    })

    return dateRange.map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      upPercentage: 0,
      totalChecks: 0,
      upChecks: 0,
      downChecks: 0,
      avgResponseTime: null,
      lastCheckTime: null,
      minResponseTime: null,
      maxResponseTime: null,
    }))
  }

  const getColorClass = (upPercentage: number) => {
    if (upPercentage === 0) return "bg-gray-200 dark:bg-gray-700"
    if (upPercentage >= 99) return "bg-green-500"
    if (upPercentage >= 95) return "bg-green-400"
    if (upPercentage >= 90) return "bg-yellow-400"
    if (upPercentage >= 80) return "bg-orange-400"
    return "bg-red-500"
  }

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return "Unknown"
    }
  }

  const renderGraph = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-7 gap-px md:grid-cols-14 lg:grid-cols-30">
          {Array.from({ length: period === "day" ? 24 : period === "week" ? 7 : period === "month" ? 30 : 52 }).map(
            (_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ),
          )}
        </div>
      )
    }

    // Merge actual data with empty data to ensure all days are represented
    const emptyData = generateEmptyData(period)
    const mergedData = emptyData.map((emptyDay) => {
      const actualDay = historyData.find((d) => d.date === emptyDay.date)
      return actualDay || emptyDay
    })

    // Determine the grid columns based on period
    const getGridCols = () => {
      if (period === "day") return "grid-cols-24" // 24 hours
      if (period === "week") return "grid-cols-7" // 7 days
      if (period === "month") return "grid-cols-[repeat(31,minmax(0,1fr))]" // Up to 31 days
      return "grid-cols-[repeat(53,minmax(0,1fr))]" // Up to 53 weeks for year
    }

    // Determine the size of squares based on period
    const getSquareSize = () => {
      if (period === "year") return "h-2.5 w-2.5"
      if (period === "month") return "h-3 w-3"
      if (period === "week") return "h-4 w-4"
      return "h-3 w-3" // day view
    }

    const squareSize = getSquareSize()
    const gridCols = getGridCols()

    return (
      <div className={`grid ${gridCols} gap-px`}>
        {mergedData.map((day, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`${squareSize} rounded-none ${getColorClass(
                    day.upPercentage,
                  )} transition-opacity hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-primary`}
                  aria-label={`Uptime for ${day.date}: ${day.upPercentage}%`}
                  onClick={() => day.totalChecks > 0 && setSelectedDay(day)}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs p-2 text-xs">
                <div>
                  <p className="font-semibold">{day.date}</p>
                  <p>Uptime: {day.upPercentage.toFixed(1)}%</p>
                  <p>Checks: {day.totalChecks}</p>
                  {day.avgResponseTime && <p>Avg Response: {day.avgResponseTime.toFixed(0)}ms</p>}
                  {day.lastCheckTime && <p>Last Check: {formatTime(day.lastCheckTime)}</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  const renderDetailedView = () => {
    if (!selectedDay || selectedDay.totalChecks === 0) return null

    return (
      <div className="mt-4 p-3 border rounded-md bg-card">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Details for {selectedDay.date}</h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedDay(null)}>
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">Uptime</div>
            <div className="font-medium">{selectedDay.upPercentage.toFixed(1)}%</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">Checks</div>
            <div className="font-medium">{selectedDay.totalChecks} total</div>
            <div className="text-xs">
              <span className="text-green-500">{selectedDay.upChecks} up</span> /
              <span className="text-red-500"> {selectedDay.downChecks} down</span>
            </div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">Response Time</div>
            <div className="font-medium">
              {selectedDay.avgResponseTime ? `${selectedDay.avgResponseTime.toFixed(0)}ms avg` : "N/A"}
            </div>
            {selectedDay.minResponseTime && selectedDay.maxResponseTime && (
              <div className="text-xs">
                {selectedDay.minResponseTime.toFixed(0)}ms - {selectedDay.maxResponseTime.toFixed(0)}ms
              </div>
            )}
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">Last Check</div>
            <div className="font-medium">
              {selectedDay.lastCheckTime ? formatTime(selectedDay.lastCheckTime) : "N/A"}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render month labels for year view
  const renderMonthLabels = () => {
    if (period !== "year") return null

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return (
      <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] mb-1">
        {months.map((month, index) => (
          <div
            key={month}
            className="text-[8px] text-muted-foreground font-medium"
            style={{ gridColumnStart: Math.floor(index * 4.4) + 1 }}
          >
            {month}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <Tabs value={period} onValueChange={setPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          {period === "year" && renderMonthLabels()}
          <div className="overflow-x-visible">{renderGraph()}</div>
        </div>
        {selectedDay && renderDetailedView()}
        <div className="mt-4 flex flex-wrap justify-between gap-1 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-gray-200 dark:bg-gray-700"></div>
            <span>No data</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-red-500"></div>
            <span>&lt;80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-orange-400"></div>
            <span>&lt;90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-yellow-400"></div>
            <span>&lt;95%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-green-400"></div>
            <span>&lt;99%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-none bg-green-500"></div>
            <span>≥99%</span>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
