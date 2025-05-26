/*
 * ContactListSkeleton.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Renders a skeleton UI to indicate that the contact list is loading.
 *   Mimics the structure of the actual contact table with placeholders.
 *
 * Features:
 *   - Displays 5 rows of placeholder contact data
 *   - Uses <Skeleton> for each field (name, title, company, email, phone, actions)
 *   - Enhances perceived performance during async data fetches
 *
 * Usage:
 *   - Used in CRM contact pages while contact data is loading
 *
 * Notes:
 *   - Adjust the number of rows or column widths to match UI changes
 */

import { Skeleton } from "@/components/ui/skeleton"

export default function ContactListSkeleton() {
  return (
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
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 p-4">
            <div>
              <Skeleton className="h-5 w-32" />
            </div>
            <div>
              <Skeleton className="h-5 w-24" />
            </div>
            <div>
              <Skeleton className="h-5 w-40" />
            </div>
            <div>
              <Skeleton className="h-5 w-48" />
            </div>
            <div>
              <Skeleton className="h-5 w-32" />
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
