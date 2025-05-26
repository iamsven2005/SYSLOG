/*
 * app/docs/search-docs.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A modal component that allows users to search through the documentation content. 
 *   It provides an input field where users can type their search query, and it shows results in real time as they type.
 *   The search results are highlighted and linked to the relevant documentation pages. 
 *   The modal also supports keyboard navigation with the `Escape` key to close it and `Cmd/Ctrl + K` for activating the search.
 *
 * Features:
 *   - **Search Input**: Allows users to type a search query, triggering a fetch request to the server to get documentation results.
 *   - **Real-Time Search**: Implements a debounce mechanism to prevent excessive API calls while typing.
 *   - **Results Display**: Shows search results with the title, excerpt, and matching lines highlighted. Results link to the corresponding documentation page.
 *   - **Highlighting**: The query term is highlighted in the results for easy identification of matches.
 *   - **Loading State**: Displays a spinner while the search is in progress.
 *   - **Empty State**: If no results are found or if the search query is empty, an appropriate message is shown.
 *   - **Keyboard Shortcuts**: Supports closing the modal with the `Escape` key and activating search with `Cmd/Ctrl + K`.
 *
 * Returns:
 *   - Renders a search modal with results displayed below the search input, including the option to click and navigate to the documentation.
 *
 * Dependencies:
 *   - React hooks: `useState`, `useEffect`, `useRef` for managing state, side effects, and focus handling.
 *   - UI components: `Card`, `Input`, `Button` from the `@/components/ui` library.
 *   - `lucide-react` for icons like `Search`, `X`, and `FileText`.
 *   - Fetching search results from the `/api/search` endpoint with the search query.
 *
 * Improvements:
 *   - Consider implementing pagination or infinite scroll for search results to handle large documentation datasets.
 *   - Enhance error handling for cases where the API call fails.
 */


"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface SearchResult {
  title: string
  slug: string
  excerpt: string
  matches: string[]
}

interface SearchDocsProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDocs({ isOpen, onClose }: SearchDocsProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by the parent component
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const searchDocs = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchDocs(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]">
      <Card className="w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <Link
                  key={index}
                  href={`/docs/${result.slug}`}
                  onClick={onClose}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{highlightText(result.title, query)}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{highlightText(result.excerpt, query)}</p>
                      {result.matches.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {result.matches.slice(0, 3).map((match, matchIndex) => (
                            <span key={matchIndex} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {highlightText(match, query)}
                            </span>
                          ))}
                          {result.matches.length > 3 && (
                            <span className="text-xs text-gray-500">+{result.matches.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Start typing to search documentation</p>
              <div className="mt-4 text-xs text-gray-400">
                <p>
                  Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Esc</kbd> to close
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
