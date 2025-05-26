/*
 * crm/companies/[id]/edit/page.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Page component for editing a company’s details in the CRM system.
 *
 * Features:
 *   - Fetches company data using `getCompany` based on dynamic route param
 *   - Displays editable form via `CompanyForm` with prefilled values
 *   - Handles not-found scenario with `notFound()` fallback
 *   - Navigation button back to the company detail view
 *
 * Notes:
 *   - Leverages ShadCN UI components for consistent styling
 *   - Ensures server-side validation of company existence before rendering
 *
 * Dependencies:
 *   - `getCompany` action from `actions/companies`
 *   - UI components from ShadCN (`Button`, `Card`, etc.)
 *   - `CompanyForm` for editing company info
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getCompany } from "../../../actions/companies"
import { notFound } from "next/navigation"
import CompanyForm from "../../../components/company-form"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; const companyId = Number.parseInt(params.id)
  const { company, error } = await getCompany(companyId)

  if (error || !company) {
    notFound()
  }

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/crm/companies/${company.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Company</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Edit details for {company.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm company={company} />
        </CardContent>
      </Card>
    </main>
  )
}
