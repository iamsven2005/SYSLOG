/*
 * CompanyListSkeleton.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Displays a skeleton placeholder for the company list while data is loading.
 *
 * Features:
 *   - Mimics the layout of the company list with loading shimmer
 *   - Helps indicate data-fetching state for better UX
 *
 * Usage:
 *   - Used in CRM CompaniesPage when `getCompanies` is still loading
 *
 * Notes:
 *   - Extend or customize the skeleton layout to match future UI changes
 */

import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyListSkeleton() {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-6 p-4 font-medium border-b">
        <div>Company Name</div>
        <div>Type</div>
        <div>Industry</div>
        <div>Specialties</div>
        <div>Rating</div>
        <div>Actions</div>
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 p-4">
            <div>
              <Skeleton className="h-5 w-40" />
            </div>
            <div>
              <Skeleton className="h-5 w-24" />
            </div>
            <div>
              <Skeleton className="h-5 w-32" />
            </div>
            <div>
              <Skeleton className="h-5 w-48" />
            </div>
            <div>
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
