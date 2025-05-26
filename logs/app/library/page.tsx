/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **Page** component is responsible for rendering the library page with entries based on search filters, pagination, and user roles.
 *   It fetches the library entries from the database and displays them in a paginated table, with options to edit, view, or check out books.
 *   The page supports filtering by various fields such as title, category, publication year, and creation date.
 *   The page also includes role-based access control, ensuring that only authorized users (e.g., admins) can access certain features.
 *
 * Key Features:
 *   - Fetches and displays library entries based on various search filters.
 *   - Implements pagination and sorting of library entries.
 *   - Includes role-based access control, allowing only authorized users (e.g., admins) to edit, delete, or manage entries.
 *   - Utilizes query parameters to manage search filters and pagination.
 *
 * Key Components:
 *   - `getLibraryEntries`: Fetches the library entries from the backend based on the provided filters.
 *   - `LibraryPage`: Renders the library entries, pagination controls, and search filters.
 *   - `getCurrentUser`: Fetches the current logged-in user.
 *   - `hasRole`: Checks if the current user has a specific role (e.g., admin).
 *   - `allowed`: Checks if the user has access to the current page.
 *   - `notFound`: Redirects the user to the not found page if access is denied or the user is not logged in.
 *
 * Example Usage:
 *   ```tsx
 *   <Page searchParams={resolvedSearchParams} />
 *   ```
 *
 * Notes:
 *   - **Search Filters**: Supports filtering library entries by title, category, year, and other criteria.
 *   - **Pagination**: The page supports pagination for efficient display of large data sets.
 *   - **Role-based Access Control**: Only users with the "admin" role are allowed to perform certain actions, such as editing or deleting entries.
 *   - **Reactivity**: The page dynamically fetches and updates data based on the search parameters and user input.
 */

import { getLibraryEntries } from "@/app/library/library-actions"
import { LibraryPage } from "./library-page"
import { getCurrentUser, hasRole } from "../login/auth"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    pubYearFrom?: string
    pubYearTo?: string
    creationDateFrom?: string
    creationDateTo?: string
    sortBy?: string
    sortOrder?: string
    hasAttachment?: string
    page?: string
    pageSize?: string
  }>
}
export default async function Page({ searchParams }: { searchParams: PageProps["searchParams"] }) {
  const resolvedParams = await searchParams
  const a = await allowed("/library")
  const currentUser = await getCurrentUser()
  if(a === false || !currentUser) notFound()
  const isAdmin =  await hasRole(currentUser, ["admin"])

  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const pageSize = parseInt(resolvedParams.pageSize || "10")
  const search = resolvedParams.search || ""
  const category = resolvedParams.category || ""
  const pubYearFrom = resolvedParams.pubYearFrom ? parseInt(resolvedParams.pubYearFrom) : undefined
  const pubYearTo = resolvedParams.pubYearTo ? parseInt(resolvedParams.pubYearTo) : undefined
  const creationDateFrom = resolvedParams.creationDateFrom ? new Date(resolvedParams.creationDateFrom) : undefined
  const creationDateTo = resolvedParams.creationDateTo ? new Date(resolvedParams.creationDateTo) : undefined
  const sortBy = resolvedParams.sortBy || "refNo"
  const sortOrder = resolvedParams.sortOrder === "desc" ? "desc" : "asc"
  const hasAttachment = resolvedParams.hasAttachment ? resolvedParams.hasAttachment === "true" : undefined

  const { entries, total, totalPages } = await getLibraryEntries(
    page,
    pageSize,
    search,
    category,
    pubYearFrom,
    pubYearTo,
    creationDateFrom,
    creationDateTo,
    sortBy,
    sortOrder,
    hasAttachment,
  )

  return (
    <LibraryPage
      entries={entries}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      pageSize={pageSize}
      isAdmin={isAdmin}
    />
  )
}
