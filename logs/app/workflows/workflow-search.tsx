/**
 * WorkflowSearch Component
 * 
 * This component allows users to search for workflows by updating the query parameters in the URL. 
 * It uses the `useSearchParams` hook to read and update the search query, which is debounced to optimize performance when the user types.
 * 
 * Features:
 * - Updates the search query in the URL as the user types.
 * - Debounced search to reduce the number of updates and optimize performance.
 * - Syncs the search term with the query parameter when the component mounts or the URL changes.
 * 
 * Dependencies:
 * - `useSearchParams`, `useRouter`, `usePathname` from `next/navigation` for interacting with URL search parameters and router.
 * - `useDebouncedCallback` from `use-debounce` to debounce the search query updates.
 * - `Input` component from `@/components/ui/input` to capture the search term input.
 * - `Search` icon from `lucide-react` for the search icon within the input field.
 * 
 * Usage:
 * - This component can be used in any page where you need to filter workflows by a search term. It manages the query parameters directly in the URL, making it easy to share and bookmark search results.
 */


"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export function WorkflowSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "")

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  useEffect(() => {
    setSearchTerm(searchParams.get("query") || "")
  }, [searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search workflows..."
        className="pl-8 w-full sm:w-[250px] md:w-[300px]"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          handleSearch(e.target.value)
        }}
      />
    </div>
  )
}
