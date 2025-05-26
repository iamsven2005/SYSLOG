/**
 * page.tsx (form) - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component displays the main page of the form builder, showcasing a list of forms that have been created,
 *   and provides options to search, filter, and create new forms. It also handles sorting of forms based on various criteria.
 *
 * Key Features:
 *   - Displays a list of forms with options to filter and search by form title or description.
 *   - Allows users to sort forms by the following criteria: newest, oldest, alphabetical, or number of responses.
 *   - Provides a button to create a new form, leading to a form creation page.
 *   - Includes a `SearchAndFilterBar` for querying and sorting forms.
 *   - Displays form details (title, description, number of questions, responses) using the `FormCard` component.
 *   - Handles the display of messages when no forms match the search or when there are no forms created yet.
 *
 * Key Functions:
 *   - `getForms`: Fetches all forms from the backend.
 *   - `filteredForms`: Filters the forms based on the search query entered by the user.
 *   - `sortedForms`: Sorts the filtered forms based on the selected sort option (newest, oldest, alphabetical, responses).
 *
 * Notes:
 *   - The `searchParams` prop is passed to the component, allowing it to handle dynamic queries like search (`q`) and sort options (`sort`).
 *   - If no forms match the search or there are no forms available, a message is displayed guiding the user to create a form or clear the search.
 *   - Sorting by responses counts the number of responses attached to each form.
 *   - The page is designed to show a clean and user-friendly UI for form management.
 *
 * Example Usage:
 *   ```tsx
 *   <Home searchParams={{ q: "feedback", sort: "responses" }} />
 *   ```
 *
 *   - The component integrates search, filter, and sort functionality for a seamless form management experience.
 */

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getForms } from "./[id]/actions"
import { SearchAndFilterBar } from "./search-and-filter-bar";
import { FormCard } from "./form-card";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const forms = await getForms()
  const searchQuery = (await searchParams).q?.toLowerCase() || ""
  const sortOption = (await searchParams).sort || "newest"

  // Filter forms based on search query
  const filteredForms = searchQuery
    ? forms.filter(
      (form) =>
        form.title.toLowerCase().includes(searchQuery) ||
        (form.description && form.description.toLowerCase().includes(searchQuery)),
    )
    : forms

  // Sort forms based on sort option
  const sortedForms = [...filteredForms].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title)
    } else if (sortOption === "responses") {
      return b.responses.length - a.responses.length
    }
    return 0
  })

  return (
    <div className="m-5 p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <Link href="/forms/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      <SearchAndFilterBar />

      {sortedForms.length === 0 && (
        <div className="text-center py-10">
          {searchQuery ? (
            <div>
              <h2 className="text-xl font-medium text-muted-foreground mb-4">
                No forms found matching &quot;{searchQuery}&quot;
              </h2>
              <Link href="/forms">
                <Button variant="outline">Clear Search</Button>
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-medium text-muted-foreground mb-4">No forms created yet</h2>
              <Link href="/forms/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first form
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {sortedForms.map((form) => (
        <FormCard
          key={form.id}
          form={{
            ...form,
            description: form.description ?? undefined,
          }}
        />
      ))}

    </div>
  )
}
