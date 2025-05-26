/**
 * InteractionControls.tsx
 * 
 * Description:
 *   A client-side search control component for the CRM Interactions page.
 * 
 * Features:
 *   - Renders a search input field with a search icon.
 *   - On form submit, updates the URL query parameters to reflect the search term.
 *   - Preserves other URL query parameters using `useSearchParams`.
 *   - Uses Next.js's `useRouter` for client-side navigation.
 * 
 * Props:
 *   - `initialSearch` (optional): Prefills the search input when provided.
 * 
 * Usage:
 *   Should be placed above or near the interaction list to enable search filtering.
 */

"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"


export default function InteractionControls({
  initialSearch = "",
}: {
  initialSearch?: string
  initialType?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch || "")
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/crm/interactions?${params.toString()}`)
  }


  return (
    <div className="flex items-center gap-4">
      <form className="relative flex-1" onSubmit={handleSearch}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search interactions..."
          className="w-full pl-8"
        />
      </form>


    </div>
  )
}
