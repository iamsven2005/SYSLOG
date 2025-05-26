/**
 * TicketDetailSkeleton.tsx - 2025-05-27 by [Your Name]
 *
 * Description:
 *   This component renders a skeleton loader UI for the Ticket Detail page. It provides a placeholder 
 *   layout for the ticket details while the actual content is being loaded asynchronously. The skeleton 
 *   is structured to mimic the design of the Ticket Detail page and provides loading indications for 
 *   various sections such as title, description, actions, and other related information.
 *
 *   - The skeleton loader is composed of multiple `Skeleton` components arranged within cards and grids 
 *     to match the structure of the Ticket Detail page.
 *   - It includes placeholders for text, such as titles and descriptions, as well as placeholders for 
 *     actions, user information, and related content.
 *
 * Components:
 *   - `Skeleton`: Placeholder component that simulates the loading state of content (text, images, etc.).
 *   - `Card`, `CardHeader`, `CardContent`: Used to structure the skeleton layout in a visually consistent 
 *     manner with the actual Ticket Detail page.
 *   - `Button`: Placeholder button components indicating actions like editing or deleting a ticket.
 *   - `Badge`: Placeholder badges for representing ticket tags, statuses, or user roles.
 * 
 * Behavior:
 *   - The component shows loading placeholders for different sections like ticket details, user information, 
 *     and actions, with appropriate spacing to reflect the actual layout.
 *   - It uses the `Array.from` method to generate multiple placeholders for related lists, such as comments or tasks.
 *   - Once the actual data is loaded, this skeleton is replaced by the real content of the Ticket Detail page.
 */


import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-[300px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-32 w-full" />

              <div className="mt-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="pt-2 border-t">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Skeleton className="h-6 w-32 mb-4" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

