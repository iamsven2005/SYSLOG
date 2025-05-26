/**
 * app/crm/orders/new/page.tsx
 *
 * Description:
 *   Provides a UI page for creating a new material order within the CRM system.
 *
 * Features:
 *   - Header with navigation back to the main Orders list.
 *   - Encapsulates the `OrderForm` component to handle form input and submission.
 *   - Utilizes ShadCN UI components (Card, Button, etc.) for consistent styling.
 *
 * Usage:
 *   Accessed via `/crm/orders/new`.
 *   Typically navigated from a project materials page or the orders overview.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import OrderForm from "@/app/crm/components/order-form"

export default function NewOrderPage() {
  return (
   
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/crm/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">New Material Order</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Create a new material order for your project</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderForm />
          </CardContent>
        </Card>
      </main>
  )
}
