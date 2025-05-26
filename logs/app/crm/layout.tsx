/*
 * app/crm/layout.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This layout component serves as the wrapper for the CRM pages. It includes a header with navigation links and checks for user access to the current page.
 *   The layout ensures that only authorized users can access the `/command-matches` route, redirecting unauthorized users to the "Not Found" page.
 *
 * Features:
 *   - Displays a sticky header with navigation buttons linking to various CRM sections (Dashboard, Projects, Companies, Contacts, Reports, Equipment)
 *   - Validates user access using the `allowed` function to check permissions for `/command-matches`
 *   - If access is denied, it redirects to the "Not Found" page using `notFound()`
 *   - Renders children components as part of the layout, making it reusable across different CRM pages
 *
 * Dependencies:
 *   - UI Components: `Button`, `Link` for navigation
 *   - `allowed` function for checking user permissions
 *   - `notFound()` for handling unauthorized access
 */

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const a = await allowed("/command-matches")
  if(a === false) notFound()
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/projects">Projects</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/companies">Companies</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/contacts">Contacts</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/reports">Reports</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/crm/equipment">Equipment</Link>
          </Button>
        </nav>
      </header>
{children}
</div>


  )
}

