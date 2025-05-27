/*
 * app/docs/layout.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A layout component for the documentation pages, providing a sidebar navigation and a search functionality.
 *   The layout includes a header with a search button that triggers a modal for searching documentation content, 
 *   and a sidebar that offers links to various sections such as "Getting Started" and individual document pages.
 *   The layout is responsive and adapts to different screen sizes, offering a mobile-friendly sidebar toggle and search options.
 *
 * Features:
 *   - Displays a sticky header with a logo, title, and a search button that activates a search modal on click
 *   - Provides a sidebar with links to different documentation sections and pages, with active page highlighting
 *   - Implements keyboard shortcut (Cmd/Ctrl + K) for opening the search modal
 *   - The sidebar can be toggled on small screens for mobile responsiveness
 *   - The main content area is dynamically rendered through the `children` prop, allowing for flexible content loading
 *   - Uses React `Suspense` for lazy loading the sidebar and search components to optimize page load performance
 *   - Includes a modal (`SearchDocs`) for searching through documentation content
 *
 * Returns:
 *   - `children`: The main content rendered within the layout, passed as a prop, allowing for dynamic rendering of page content.
 *
 * Dependencies:
 *   - React hooks: `useState`, `useEffect` for managing state and side effects
 *   - Next.js: `Link` for navigation, `usePathname` for tracking the current URL
 *   - UI components: `Button`, `Menu`, `X`, `Search` from `lucide-react` for UI icons, `SearchDocs` for search functionality
 *   - Responsive layout with TailwindCSS for styling and responsiveness
 *
 * Improvements:
 *   - Consider adding a "back to top" button for better navigation on long pages.
 *   - Lazy load additional sections in the sidebar for large documentation sets to reduce initial load time.
 */


"use client"

import type React from "react"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, FileText, Search } from "lucide-react"
import { SearchDocs } from "./search-docs"

const navigationItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Activity Table", href: "/docs/activity" },
      { title: "Admin Dashboard", href: "/docs/admin" },
      { title: "Alerts", href: "/docs/alerts" },
      { title: "Auth logs", href: "/docs/auth" },
      { title: "Chat", href: "/docs/chat" },      
      { title: "Command Matching", href: "/docs/command-matches" },
      { title: "Devices", href: "/docs/devices" },
      { title: "Docs", href: "/docs/docs" },
      { title: "Drive", href: "/docs/drive" },
      { title: "Emails", href: "/docs/email-templates" },
      { title: "Feedback", href: "/docs/feedback" },
      { title: "Forms", href: "/docs/forms" },
      { title: "SAMBA Table", href: "/docs/idap" },
      { title: "job-titles", href: "/docs/job-titles" },
      { title: "leave", href: "/docs/leave" },
      { title: "library", href: "/docs/library" },
      { title: "library-uploads", href: "/docs/library-uploads" },
      { title: "locations", href: "/docs/locations" },
      { title: "logs", href: "/docs/logs" },
      { title: "notes", href: "/docs/notes" },
      { title: "notifications", href: "/docs/notifications" },
      { title: "online", href: "/docs/online" },
      { title: "permissions", href: "/docs/permissions" },
      { title: "profile", href: "/docs/profile" },
      { title: "project-types", href: "/docs/project-types" },
      { title: "projects", href: "/docs/projects" },
      { title: "roles", href: "/docs/roles" },
      { title: "rules", href: "/docs/rules" },
      { title: "teams", href: "/docs/teams" },
      { title: "tickets", href: "/docs/tickets" },
      { title: "users", href: "/docs/users" },
      { title: "workflows", href: "/docs/workflows" },

    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-white p-5">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="sm" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold">Documentation</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900"
            >
              <Search className="h-4 w-4" />
              <span>Search docs...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] md:gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
        {/* Sidebar */}
        <Suspense fallback={<div>Loading...</div>}>
          <aside
            className={`fixed top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r bg-white md:sticky md:block ${sidebarOpen ? "block" : "hidden"} md:w-auto`}
          >
            <div className="py-6 pr-6 lg:py-8">
              <nav className="space-y-6">
                {navigationItems.map((section) => (
                  <div key={section.title}>
                    <h4 className="mb-2 px-4 text-sm font-semibold tracking-tight text-gray-900">{section.title}</h4>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 ${
                            pathname === item.href ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        </Suspense>

        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">{children}</main>
      </div>

      {/* Search Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <SearchDocs isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </Suspense>
    </div>
  )
}
