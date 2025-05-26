
/**
 * TicketsTable Component
 * 
 * This component displays a table of support tickets with various filtering options, including status and priority.
 * It provides pagination controls to navigate through large sets of tickets and includes a search function to find specific tickets.
 * Admin users have additional features such as filtering by priority and viewing the priority of each ticket.
 * 
 * Features:
 * - Allows filtering tickets by status (e.g., open, in progress, resolved) and priority (e.g., low, medium, high, critical).
 * - Supports pagination to display a manageable number of tickets per page.
 * - Provides a search bar to find tickets by title or description.
 * - Displays ticket details such as ID, title, status, priority, created by, and assigned to.
 * - Admins can view and filter tickets by priority.
 * - Displays badges for ticket status and priority, color-coded for easy recognition.
 * 
 * Dependencies:
 * - `Button`, `Input` from `@/components/ui/button` and `@/components/ui/input` for UI elements.
 * - `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow` from `@/components/ui/table` for rendering ticket data.
 * - `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `@/components/ui/select` for filter controls.
 * - `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious` for pagination functionality.
 * - `Badge` from `@/components/ui/badge` for status and priority labels.
 * - `getTickets` from `@/app/tickets/ticket-actions` to fetch ticket data based on filter criteria.
 * - `formatDate` from `@/lib/utils` for formatting ticket creation dates.
 * 
 * State:
 * - `tickets`: Stores the list of tickets fetched from the server.
 * - `pageCount`: Total number of pages for pagination.
 * - `loading`: Tracks the loading state while ticket data is being fetched.
 * - `searchInput`: Stores the value of the search input for filtering tickets.
 * 
 * Methods:
 * - `handleStatusChange`: Handles status filter changes and updates the query parameters.
 * - `handlePriorityChange`: Handles priority filter changes and updates the query parameters.
 * - `handleSearch`: Handles the search form submission and updates the query parameters.
 * - `createQueryString`: Builds a query string from the selected filters and page number.
 * 
 * Pagination:
 * - Provides links to navigate through pages of tickets.
 * - The `PaginationPrevious` and `PaginationNext` buttons allow the user to go to the previous or next page.
 * - The page numbers are clickable and highlight the current page.
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { getTickets } from "@/app/tickets/ticket-actions"
import { formatDate } from "@/lib/utils"

// Status and priority options
const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
]

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]

// Status badge colors
const statusColors: Record<string, string> = {
  open: "bg-blue-500 hover:bg-blue-600",
  in_progress: "bg-yellow-500 hover:bg-yellow-600",
  resolved: "bg-green-500 hover:bg-green-600",
  closed: "bg-gray-500 hover:bg-gray-600",
}

// Priority badge colors
const priorityColors: Record<string, string> = {
  low: "bg-gray-500 hover:bg-gray-600",
  medium: "bg-blue-500 hover:bg-blue-600",
  high: "bg-yellow-500 hover:bg-yellow-600",
  critical: "bg-red-500 hover:bg-red-600",
}
interface Props {
  isAdmin: boolean
  id: number
}

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  createdAt: Date // 👈 Match what the backend returns
  createdBy: {
    id: number
    username: string | null
  }
  assignedTo?: {
    id: number
    username: string | null
  } | null
  relatedDevice?: {
    id: number
    name: string
  } | null
  _count: {
    attachments: number
    comments: number
  }
}


export function TicketsTable({ isAdmin, id }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get search params with defaults
  const page = Number(searchParams.get("page") || "1")
  const status = searchParams.get("status") || ""
  const priority = searchParams.get("priority") || ""
  const search = searchParams.get("search") || ""

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(search)

  // Fetch tickets
  useEffect(() => {
    async function fetchTickets() {
      setLoading(true)
      try {
        const createdById = !isAdmin ? id : undefined

        const result = await getTickets({
          status: status || undefined,
          priority: priority || undefined,
          page,
          pageSize: 10,
          search,
          createdById,
        })
        setTickets(result.tickets)
        setPageCount(result.pageCount)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [page, status, priority, search, isAdmin, id]) // ✅

  // Create URL with updated search params
  const createQueryString = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    return newParams.toString()
  }

  // Handle status change
  const handleStatusChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        status: value === "all" ? "" : value,
        page: 1,
      })}`,
    )
  }

  // Handle priority change
  const handlePriorityChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        priority: value === "all" ? "" : value,
        page: 1,
      })}`,
    )
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(
      `${pathname}?${createQueryString({
        search: searchInput,
        page: 1,
      })}`,
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/3">
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:justify-end">
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority || "all"} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link href="/tickets/new">New Ticket</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              {isAdmin && (
                <TableHead className="hidden md:table-cell">Priority</TableHead>
              )}
              <TableHead className="hidden lg:table-cell">Created By</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                    <div className="md:hidden flex flex-wrap gap-2 mt-1">
                      <Badge className={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                      <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="hidden md:table-cell">
                      <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    </TableCell>
                  )}

                  <TableCell className="hidden lg:table-cell">{ticket.createdBy.username}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {ticket.assignedTo ? ticket.assignedTo.username : "Unassigned"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `${pathname}?${createQueryString({ page: page - 1 })}` : "#"}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`${pathname}?${createQueryString({ page: pageNum })}`}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={page < pageCount ? `${pathname}?${createQueryString({ page: page + 1 })}` : "#"}
                className={page >= pageCount ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

