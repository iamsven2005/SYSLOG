/**
 * app/crm/interactions/new/page.tsx
 * 
 * Description:
 *   This page provides a form to create a new CRM interaction, either 
 *   generically or pre-filled with a selected contact (if `contactId` is in query).
 * 
 * Behavior:
 *   - Fetches all companies for dropdown selection in the form.
 *   - If a `contactId` is provided via searchParams:
 *       - Fetches the contact and its associated company.
 *       - Pre-selects the company and contact in the form.
 *       - Filters the company's contacts for better UX.
 *   - Renders the `InteractionForm` with optional pre-filled data.
 *   - Includes back navigation to the interactions list.
 * 
 * Components:
 *   - `InteractionForm` handles form UI and submission.
 *   - `Card` and `Button` from ShadCN UI library for layout and UI consistency.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  ArrowLeft } from "lucide-react"
import InteractionForm from "@/app/crm/components/interaction-form"
import { getCompanies } from "@/app/crm/actions/companies"
import { getContact } from "@/app/crm/actions/contacts"
interface Company {
  id: number
  name: string
  contacts?: {
    id: number
    name: string
    phone: string | null
    email: string | null
    remarks: string | null
    createdAt: Date
    updatedAt: Date
    title: string | null
    expertise: string | null
    companyId: number
  }[]
}
export default async function NewInteractionPage({ searchParams }: { 
      searchParams: Promise<{ contactId?: string }>
 }) {
const { contactId: contactIdRaw } = await searchParams
const contactId = contactIdRaw ? Number.parseInt(contactIdRaw) : undefined

  // Fetch all companies for the dropdown
const { companies = [] } = await getCompanies()

  // If contactId is provided, fetch the contact and its company
let contact: Awaited<ReturnType<typeof getContact>>["contact"] | null = null
let preSelectedCompanyId: number | undefined = undefined
let companyContacts: Company["contacts"] = []

  if (contactId) {
    const contactResult = await getContact(contactId)
    if (!contactResult.error && contactResult.contact) {
      contact = contactResult.contact
      preSelectedCompanyId = contact.company.id

const company = companies.find((c) => c.id === preSelectedCompanyId)
  if (company?.contacts) {
    companyContacts = company.contacts
  }
    }
  }

  return (
   
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/crm/interactions">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">New Interaction</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Details</CardTitle>
            <CardDescription>
              {contact
                ? `Record a new interaction with ${contact.name}`
                : "Record details about a new interaction with a company or contact"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InteractionForm
              companies={companies}
              preSelectedCompanyId={preSelectedCompanyId}
              preSelectedContactId={contactId}
              companyContacts={companyContacts}
            />
          </CardContent>
        </Card>
      </main>
  )
}
