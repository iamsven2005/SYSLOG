/**
 * ResponsesRealTimeIndicator.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component listens for real-time notifications of new responses submitted to a form. It displays a badge
 *   showing the number of new responses and provides a button to refresh the view and reset the badge count.
 *   It uses Server-Sent Events (SSE) to receive real-time updates and notifies the user via a toast when a new response is submitted.
 *
 * Key Features:
 *   - Listens for real-time updates for new form responses using SSE.
 *   - Displays a badge showing the number of new responses that have been submitted to the form.
 *   - Allows the user to refresh the form data and reset the badge count by clicking the badge or the refresh button.
 *   - Uses the `useSSE` hook to handle the SSE connection and the `toast` library for notifications.
 *
 * Key Functions:
 *   - `onMessage`: When a new response is submitted, it updates the `newResponses` state and shows a toast notification.
 *   - `setNewResponses`: Updates the count of new responses.
 *   - `refresh`: Clears the new responses count and forces a page refresh when the user clicks the refresh button.
 *
 * Example Usage:
 *   ```tsx
 *   <ResponsesRealTimeIndicator formId={form.id} />
 *   ```
 *
 * Notes:
 *   - The `formId` is passed as a prop to indicate which form to listen to for responses.
 *   - The `Badge` component shows the number of new responses, and clicking it will refresh the page.
 *   - The `Button` with the "Refresh" icon allows manual refresh of the page.
 *   - The component uses the `sonner` library to show success notifications when a new response is received.
 */

"use client"

import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSSE } from "./use-sse"
import { toast } from "sonner"

interface ResponsesRealTimeIndicatorProps {
  formId: number
}

export function ResponsesRealTimeIndicator({ formId }: ResponsesRealTimeIndicatorProps) {
  const router = useRouter()
  const [newResponses, setNewResponses] = useState(0)

  useSSE(`form-${formId}-responses`, {
    onMessage: (data) => {
      if (data.type === "new-response") {
        setNewResponses((prev) => prev + 1)
        toast.success("Someone has submitted a new response to this form.")
      }
    },
  })

  return (
    <div className="flex items-center gap-2">
      {newResponses > 0 && (
        <Badge
          className="cursor-pointer"
          onClick={() => {
            router.refresh()
            setNewResponses(0)
          }}
        >
          {newResponses} new {newResponses === 1 ? "response" : "responses"}
        </Badge>
      )}
      <Button variant="outline" size="sm" onClick={() => router.refresh()} className="text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
        Refresh
      </Button>
    </div>
  )
}
