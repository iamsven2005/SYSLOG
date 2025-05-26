/*
 * crm/contacts/[id]/edit/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server-side page component for editing a contact's information.
 *   It fetches the contact by ID, converts it to a format compatible with the contact form,
 *   and renders the editable `ContactForm`.
 *
 * Props:
 *   - params: Promise containing route parameters, specifically the contact `id` (string)
 *
 * Features:
 *   - Fetches contact data using `getContact`
 *   - Handles missing or invalid contact data with `notFound()`
 *   - Renders a prefilled `ContactForm` with existing data
 *   - Includes a back button to return to the contact details page
 *
 * Dependencies:
 *   - UI Components: Card, Button, Link, ArrowLeft icon
 *   - Actions: `getContact`
 *   - Form Component: `ContactForm`
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getContact } from "@/app/crm/actions/contacts"
import { notFound } from "next/navigation"
import ContactForm from "@/app/crm/components/contact-form"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = Number.parseInt(params.id);
  const { contact, error } = await getContact(contactId);

  if (error || !contact) {
    notFound();
  }

  // Map the Prisma contact to the form schema type
  const formCompatibleContact = {
    name: contact.name ?? "",
    title: contact.title ?? undefined,
    email: contact.email ?? undefined,
    phone: contact.phone ?? undefined,
    expertise: contact.expertise ?? undefined,
    remarks: contact.remarks ?? undefined,
    companyId: contact.companyId,
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/crm/contacts/${contact.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Contact</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Edit details for {contact.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm contact={formCompatibleContact} />
        </CardContent>
      </Card>
    </main>
  );
}

