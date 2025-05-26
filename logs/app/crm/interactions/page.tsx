/**
 * app/crm/interactions/page.tsx
 *
 * Description:
 *   Displays a searchable and filterable list of CRM interactions.
 *   Includes interaction creation and detailed viewing functionality.
 *
 * Features:
 *   - Fetches all CRM interactions from the database via `getInteractions`.
 *   - Parses search and type filters from `searchParams` to dynamically update results.
 *   - Maps contact names into firstName and lastName fields for more structured display.
 *   - Provides controls for searching and filtering via `InteractionControls`.
 *   - Includes loading skeleton (`InteractionListSkeleton`) for smoother UX on slow fetches.
 *
 * Usage:
 *   Rendered at `/crm/interactions` via Next.js routing.
 *   Accessible via sidebar or interaction-related views across the CRM.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getInteractions } from "../actions/interactions"
import InteractionList from "@/app/crm/components/interaction-list"
import InteractionListSkeleton from "@/app/crm/interactions/interaction-list-skeleton"
import InteractionControls from "./interaction-controls"
import { Plus } from "lucide-react"
type RawContact = {
  id: number
  name: string
}
export default async function InteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>
}) {
  const { interactions, error } = await getInteractions()

  // Map contact.name → firstName + lastName BEFORE stripping it
const mappedInteractions = interactions?.map((i) => {
  const contact = i.contact as RawContact | null

  let firstName = ""
  let lastName = ""

  if (contact?.name) {
    const [first, ...rest] = contact.name.split(" ")
    firstName = first
    lastName = rest.join(" ")
  }

  return {
    ...i,
    contact: contact
      ? {
          id: contact.id,
          firstName,
          lastName,
        }
      : null,
  }
})



  const params = await searchParams

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interactions</h1>
        <Button asChild>
          <Link href="/crm/interactions/new">
            <Plus className="mr-2 h-4 w-4" /> New Interaction
          </Link>
        </Button>
      </div>

      <InteractionControls initialSearch={params.search} initialType={params.type} />

      <Card>
        <CardHeader>
          <CardTitle>
            {params.type && params.type !== "all" ? `${params.type} Interactions` : "All Interactions"}
          </CardTitle>
          <CardDescription>Track communications with contractors, vendors, and other stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? <InteractionListSkeleton /> : <InteractionList interactions={mappedInteractions || []} />}
        </CardContent>
      </Card>
    </main>
  )
}

