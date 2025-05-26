/**
 * UserActivityTable.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component displays a table of user activity logs with pagination and the ability to export the data to an Excel file. 
 *   It shows details such as the activity ID, user ID, username, page visited, and login time. Users can navigate through 
 *   different pages of activity records and download the data in an Excel format.
 *
 * Components:
 *   - `Table`: Displays user activity records in a tabular format.
 *   - `Button`: Used for exporting data to Excel and for page navigation.
 *   - `ChevronLeft`, `ChevronRight`: Used for navigating between pages of activity logs.
 *   - `FileSpreadsheet`: An icon used for the export-to-Excel button.
 * 
 * Props:
 *   - `initialData`: The initial set of user activity records to display in the table.
 *   - `totalPages`: The total number of pages available for pagination.
 *   - `currentPage`: The current page of activity records being viewed.
 *   - `totalCount`: The total number of activity records available.
 *
 * Behavior:
 *   - The table displays the user activity data, with pagination controls at the bottom to navigate between pages.
 *   - Users can export the current data shown in the table to an Excel file by clicking the "Export to Excel" button.
 *   - The pagination controls allow users to go to the previous or next page of data, while handling edge cases like the first and last pages.
 *   - The export functionality uses the `XLSX` library to generate an Excel file with the activity data, formatted appropriately for Excel.
 *   - A message is displayed when no records are available.
 */

"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"
import * as XLSX from "xlsx"

type UserActivity = {
  id: number
  userId: number
  username: string
  page: string
  loginTime: Date
}

interface UserActivityTableProps {
  initialData: UserActivity[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export default function UserActivityTable({
  initialData,
  totalPages,
  currentPage,
  totalCount,
}: UserActivityTableProps) {
  const [data] = useState<UserActivity[]>(initialData)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Format the data for Excel
    const formattedData = data.map((item) => ({
      ID: item.id,
      "User ID": item.userId,
      Username: item.username,
      Page: item.page,
      "Login Time": format(new Date(item.loginTime), "yyyy-MM-dd HH:mm:ss"),
    }))

    // Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Activity")

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `user-activity-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {data.length} of {totalCount} entries
        </div>
        <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Login Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.userId}</TableCell>
                <TableCell>{activity.username}</TableCell>
                <TableCell>{activity.page}</TableCell>
                <TableCell>{format(new Date(activity.loginTime), "yyyy-MM-dd HH:mm:ss")}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No activity records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
