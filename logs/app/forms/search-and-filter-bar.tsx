/**
 * SearchAndFilterBar.tsx - 2025-05-26
 * 
 * Description:
 *   A component that allows users to search and filter forms by query and sort option. The search bar filters forms by their title and description, and the sort dropdown lets users choose sorting by newest, oldest, alphabetical order, or number of responses.
 *   This component dynamically updates the URL with search and sort parameters and triggers the routing update when either of the parameters changes.
 *
 * Key Features:
 *   - Users can input search queries to filter forms based on their title or description.
 *   - Sort options available: "Newest First", "Oldest First", "Alphabetical", and "Most Responses".
 *   - Automatically updates the URL query parameters when the search query or sort option is changed.
 *   - A button that allows submitting the search query, which then updates the page content.
 *
 * Key Functions:
 *   - `useEffect`: Updates the URL with the current search and sort parameters whenever they change.
 *   - `handleSearch`: Handles the form submission for search, triggering a router push with the search query in the URL.
 *
 * Example Usage:
 *   ```tsx
 *   <SearchAndFilterBar />
 *   ```
 *
 * Notes:
 *   - The `router.push` method is used to update the URL and reflect the current search and sort options.
 *   - The `Select` component is used to manage the sort options, and the `Input` field captures the user's search query.
 *   - This component uses Next.js hooks, including `useRouter` and `useSearchParams`, to manage the query parameters and URL navigation.
 */

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchAndFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest")

  // Update the URL when search or sort changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (sortOption) params.set("sort", sortOption)

    const url = params.toString() ? `/forms/?${params.toString()}` : "/forms"
    router.push(url)
  }, [searchQuery, sortOption, router])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    const url = params.toString() ? `/forms/?${params.toString()}` : "/forms"
    router.push(url)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
        <Input
          type="search"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="responses">Most Responses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
