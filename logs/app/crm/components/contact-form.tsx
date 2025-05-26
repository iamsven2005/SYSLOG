/*
 * crm/contacts/components/contact-form.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Form for creating or updating a contact person in the BridgeCRM system.
 *
 * Features:
 *   - Supports both new contact creation and editing of existing contacts
 *   - Validates form fields using Zod schema and react-hook-form
 *   - Fetches and displays a list of companies for association
 *   - Submits contact data via `createContact` or `updateContact` server actions
 *   - Handles submission state, error messages, and redirect upon success
 *
 * Notes:
 *   - Uses `useEffect` to load company list on client side
 *   - Accepts optional `contact` prop for editing existing records
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createContact, updateContact } from "@/app/crm/actions/contacts"
import { getCompanies } from "../actions/companies"
import { Company, ContactPerson } from "@/prisma/generated/main"

const contactSchema = z.object({
  name: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  title: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  phone: z.string().optional(),
  expertise: z.string().optional(),
  remarks: z.string().optional(),
  companyId: z.coerce.number(),
})
interface ContactFormProps {
  contact?: Partial<z.infer<typeof contactSchema>> | null
}
type CompanyWithContactsAndCounts = Company & {
  contacts: ContactPerson[]
  _count: {
    contacts: number
    projects: number
  }
}
export default function ContactForm({ contact = null }: ContactFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<CompanyWithContactsAndCounts[]>([])
  const [loading, setLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      expertise: "",
      remarks: "",
      companyId: 0,
      ...contact,
    },
  })

  // Fetch companies on component mount
  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true)
      try {
        const response = await getCompanies()
        if (response.companies) {
          setCompanies(response.companies)
        }
      } catch (error) {
        console.error("Error fetching companies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])
  type ContactFormData = z.infer<typeof contactSchema>

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)

    try {
      if (contact) {
        if (!contact.companyId) {
          throw new Error("Missing companyId")
        }
        const result = await updateContact(contact.companyId, data)

        if (result.error) {
          form.setError("root", { message: result.error })
          return
        }

        router.push(`/crm/contacts/${contact.companyId}`)
      } else {
        // Create new contact
        const result = await createContact(data)

        if (result.error) {
          form.setError("root", { message: result.error })
          return
        }

        router.push(`/crm/contacts`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      form.setError("root", { message: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Project Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expertise</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Structural Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about this contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Saving..." : "Save Contact"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
