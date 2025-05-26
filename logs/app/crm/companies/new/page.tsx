/*
 * crm/companies/new/page.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Page for creating a new company entry in the CRM system.
 *
 * Features:
 *   - Renders a form for company data entry (CompanyForm)
 *   - Provides a back button to the companies list
 *   - Uses ShadCN UI components with consistent layout and styling
 *
 * Notes:
 *   - This page does not handle submission directly — relies on CompanyForm's internal logic
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CompanyForm from "@/app/crm/components/company-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewCompanyPage() {
  return (

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/crm/companies">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">New Company</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Add a new company to your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyForm />
          </CardContent>
        </Card>
      </main>
  )
}
