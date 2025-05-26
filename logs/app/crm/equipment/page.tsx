/*
 * crm/equipment/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Main equipment dashboard for the CRM module. Provides a centralized view 
 *   to manage all equipment records, including their availability, status, and 
 *   category filters. Supports search, filtering, and segmented tab views.
 *
 * Features:
 *   - Displays overall equipment statistics (via `EquipmentStats`)
 *   - Search bar and (future) advanced filter button
 *   - Tabs for quick views: All, Available, On Loan, Maintenance
 *   - Lists equipment with dynamic filters and search (via `EquipmentList`)
 *   - Add new equipment via a "Plus" button
 *
 * Data:
 *   - Uses `getEquipment`, `getEquipmentStats`, and `getEquipmentCategories` from actions
 *   - Filters applied: categoryId, status, condition, search (via searchParams)
 *
 * UI Components:
 *   - Tabs, Cards, Buttons, Inputs, Lucide icons
 *   - Custom components: `EquipmentStats`, `EquipmentList`
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getEquipment, getEquipmentStats, getEquipmentCategories } from "@/app/crm/equipment/equipment"
import EquipmentStats from "../components/equipment-stats"
import EquipmentList from "../components/equipment-list"
import { EquipmentCondition, EquipmentStatus } from "@/prisma/generated/main"

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; condition?: string; search?: string }>
}) {
  // Parse filters
  const filters = {
    categoryId: (await searchParams).category !== undefined
      ? Number.parseInt((await searchParams).category!)
      : undefined,
    status: (await searchParams).status as EquipmentStatus,
    condition: (await searchParams).condition as EquipmentCondition,
    search: (await searchParams).search,
  }

  // Fetch data
  const { equipment, error: equipmentError } = await getEquipment(filters)
  const { categories } = await getEquipmentCategories()
  const stats = await getEquipmentStats()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-muted-foreground">Manage and track all equipment and tools</p>
        </div>
        <Button asChild>
          <Link href="/crm/equipment/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EquipmentStats stats={stats} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Equipment</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="on-loan">On Loan</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search equipment..."
                className="w-full pl-8"
                defaultValue={(await searchParams).search || ""}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Equipment</CardTitle>
              <CardDescription>
                Showing {equipment?.length || 0} items {filters.search ? `matching "${filters.search}"` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {equipmentError ? (
                <div className="text-center py-4">
                  <p className="text-red-500">{equipmentError}</p>
                </div>
              ) : (
                <EquipmentList equipment={equipment || []} categories={categories || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Available Equipment</CardTitle>
              <CardDescription>Equipment ready for use</CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentList
                equipment={(equipment || []).filter((item) => item.status === "AVAILABLE")}
                categories={categories || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="on-loan" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Equipment On Loan</CardTitle>
              <CardDescription>Equipment currently checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentList
                equipment={(equipment || []).filter((item) => item.status === "ON_LOAN")}
                categories={categories || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Equipment In Maintenance</CardTitle>
              <CardDescription>Equipment being repaired or serviced</CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentList
                equipment={(equipment || []).filter(
                  (item) => item.status === "IN_MAINTENANCE" || item.status === "DAMAGED",
                )}
                categories={categories || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
