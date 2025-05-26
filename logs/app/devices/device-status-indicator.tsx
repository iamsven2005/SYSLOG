/*
 * device-status-indicator.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A client-side component that displays the status of a device using badges. 
 *   It visually indicates whether the device is online or offline and shows connection status.
 *   If the device is not connected, it displays a "Connecting..." badge. 
 *   If the status is unknown, it shows a "Unknown" badge.
 *
 * Features:
 *   - Displays a badge with "Online" or "Offline" status
 *   - Customizable with colors for each status (green for online, red for offline)
 *   - Shows a "Connecting..." message while waiting for connection
 *   - Displays "Unknown" when the device's status is not provided
 *   - Uses the `Badge` component for status indication
 *
 * Props:
 *   - `status`: An object containing the device's status (`online` or `offline`)
 *   - `isConnected`: A boolean indicating whether the device is connected
 *
 * Dependencies:
 *   - `Badge`: UI component for displaying status badges with different styles
 */
"use client"

import { Badge } from "@/components/ui/badge"

interface DeviceStatusIndicatorProps {
  status?: {
    status: "online" | "offline"
  }
  isConnected: boolean
}

export function DeviceStatusIndicator({ status, isConnected }: DeviceStatusIndicatorProps) {
  if (!isConnected) return <Badge variant="outline">Connecting...</Badge>
  if (!status) return <Badge variant="outline">Unknown</Badge>

  return (
    <Badge
      variant={status.status === "online" ? "outline" : "destructive"}
      className={status.status === "online" ? "bg-green-500" : "bg-red-500"}
    >
      {status.status === "online" ? "Online" : "Offline"}
    </Badge>
  )
}
