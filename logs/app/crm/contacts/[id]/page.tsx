/*
 * crm/contacts/[id]/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Contact details page for viewing a specific contact's profile and interaction history.
 *   Fetches the contact by ID, displays company affiliation, contact information,
 *   and recent interactions.
 *
 * Props:
 *   - params: Promise containing route parameters including contact `id` (string)
 *
 * Features:
 *   - Shows contact info: title, company, email, phone, expertise, remarks
 *   - Displays up to 5 recent interactions via <InteractionList />
 *   - Links to edit the contact and add new interactions
 *
 * Dependencies:
 *   - UI Components: Card, Button, Icons (Mail, Phone, Building2, Edit)
 *   - Actions: `getContact`
 *   - Component: `InteractionList`
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Building2, Edit } from "lucide-react"
import { getContact } from "@/app/crm/actions/contacts"
import { notFound } from "next/navigation"
import InteractionList from "@/app/crm/components/interaction-list"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; const contactId = Number.parseInt(params.id)
  const { contact, error } = await getContact(contactId)

  if (error || !contact) {
    notFound()
  }

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/crm/contacts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{contact.name}</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/crm/interactions/new?contactId=${contact.id}`}>New Interaction</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/crm/contacts/${contact.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Details about {contact.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 text-sm">
              {contact.title && (
                <div>
                  <dt className="font-medium text-muted-foreground">Title:</dt>
                  <dd>{contact.title}</dd>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <dt className="font-medium text-muted-foreground">Company:</dt>
                <dd>
                  <Link href={`/crm/companies/${contact.company.id}`} className="text-blue-600 hover:underline">
                    {contact.company.name}
                  </Link>
                </dd>
              </div>

              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <dt className="font-medium text-muted-foreground">Email:</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <dt className="font-medium text-muted-foreground">Phone:</dt>
                  <dd>
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              )}

              {contact.expertise && (
                <div>
                  <dt className="font-medium text-muted-foreground">Expertise:</dt>
                  <dd>{contact.expertise}</dd>
                </div>
              )}

              {contact.remarks && (
                <div className="col-span-2">
                  <dt className="font-medium text-muted-foreground">Remarks:</dt>
                  <dd className="mt-1">{contact.remarks}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
            <CardDescription>Communications with {contact.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {contact.interactions && contact.interactions.length > 0 ? (
              <InteractionList interactions={contact.interactions.slice(0, 5)} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No interactions recorded with this contact</p>
                <Button className="mt-4" asChild>
                  <Link href={`/crm/interactions/new?contactId=${contact.id}`}>Add Interaction</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
