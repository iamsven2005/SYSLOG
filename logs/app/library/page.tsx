import { getLibraryEntries } from "@/app/library/library-actions"
import { LibraryPage } from "./library-page"
import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "../login/actions"
import { checkUserPermission } from "../permissions/permission-actions"

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

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }

  const perm = await checkUserPermission(currentUser.id, "/library")
  if (!perm.hasPermission) {
    return notFound()
  }

  const isAdmin = currentUser.role.includes("admin")

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
