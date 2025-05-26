/*
 * crm/contacts/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This is the main Contacts Directory page in the CRM system. It displays all contact entries
 *   with filtering via search parameters. Includes links to view, edit, and create contacts.
 *
 * Features:
 *   - Fetches all contacts with associated companies
 *   - Supports client-side filtering by name, title, email, phone, or company name
 *   - Displays contact information in a responsive table
 *   - Provides quick access to "Add Contact", "View", and "Edit" actions
 *
 * Props:
 *   - searchParams (from Next.js route): { search?: string }
 *
 * Dependencies:
 *   - Components: Button, Card, Input, Table
 *   - Icons: Mail, Phone, Search, Plus
 *   - Actions: `getContacts`
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Mail, Phone } from "lucide-react"
import { getContacts } from "../actions/contacts"
import ContactListSkeleton from "./contact-list-skeleton"

export default async function ContactsPage({
  searchParams,
}: {
      searchParams: Promise< { search?: string }>
  
}) {
  const { contacts, error } = await getContacts()

  const search = (await searchParams).search?.toLowerCase() || ""

  const filteredContacts = search
    ? contacts?.filter((c) =>
      [c.name, c.title, c.email, c.phone, c.company?.name]
        .filter((field): field is string => typeof field === "string")
        .some((field) => field.toLowerCase().includes(search))
    )
    : contacts

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button asChild>
          <Link href="/crm/contacts/new">
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <form method="get" className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search contacts..."
            className="w-full pl-8"
            defaultValue={(await searchParams).search || ""}
          />
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>Manage your contacts across all companies</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <ContactListSkeleton />
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-6 p-4 font-medium border-b">
                <div>Name</div>
                <div>Title</div>
                <div>Company</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {filteredContacts && filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (

                    <div key={contact.id} className="grid grid-cols-6 p-4 hover:bg-muted/50">
                      <div className="font-medium">
                        <Link href={`/crm/contacts/${contact.id}`} className="hover:underline">
                          {contact.name}
                        </Link>
                      </div>
                      <div>{contact.title || "N/A"}</div>
                      <div>
                        <Link href={`/crm/companies/${contact.company.id}`} className="hover:underline">
                          {contact.company.name}
                        </Link>
                      </div>
                      <div>
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Mail className="h-3 w-3" /> {contact.email}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <div>
                        {contact.phone ? (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Phone className="h-3 w-3" /> {contact.phone}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/crm/contacts/${contact.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/crm/contacts/${contact.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No contacts found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
