/**
 * InteractionListSkeleton.tsx
 *
 * Skeleton loader for the interaction list UI in the CRM module.
 *
 * Purpose:
 *   - Provides a visual placeholder while interaction records are being loaded.
 *   - Enhances perceived performance and user experience during data fetches.
 *
 * Structure:
 *   - Renders 2 skeleton cards, each simulating:
 *     - An avatar circle
 *     - Name and timestamp placeholders
 *     - Two lines of message/notes
 *     - Meta fields like tags or follow-ups
 *
 * Usage:
 *   <InteractionListSkeleton />
 *   Commonly used within a <Suspense fallback={...}> block or while fetching interactions.
 *
 * Author: sven.tan
 * Date: 2025-05-26
 */

import { Skeleton } from "@/components/ui/skeleton"

export default function InteractionListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
