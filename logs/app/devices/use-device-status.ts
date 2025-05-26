/*
 * app/crm/hooks/use-device-status.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   A custom React hook that manages and tracks the connection status of devices in real-time.
 *   It uses Server-Sent Events (SSE) to listen for updates on device statuses and updates the component state accordingly.
 *   The hook also provides the connection status (whether the device monitor is connected or not) and stores the current status for each device.
 *
 * Features:
 *   - Listens for real-time updates on device statuses (online/offline) via SSE from the `/api/device-monitor` endpoint
 *   - Tracks the connection state to the device monitor server
 *   - Stores device statuses in a state object, keyed by device ID
 *   - Handles reconnection logic in case of SSE connection errors
 *
 * Returns:
 *   - `deviceStatuses`: A record of devices, where the key is the device ID and the value is the device status (online/offline) and timestamp
 *   - `isConnected`: A boolean indicating whether the connection to the device monitor is active
 *
 * Dependencies:
 *   - React hooks: `useState`, `useEffect` for managing state and side effects
 *   - EventSource for handling SSE connections
 */

"use client"

import { useState, useEffect } from "react"

type DeviceStatus = {
  deviceId: number
  status: "online" | "offline"
  timestamp: string
}

export function useDeviceStatus() {
  const [deviceStatuses, setDeviceStatuses] = useState<Record<number, DeviceStatus>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource("/api/device-monitor")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "connected") {
          console.log("Connected to device monitor:", data.clientId)
        } else if (data.deviceId) {
          setDeviceStatuses((prev) => ({
            ...prev,
            [data.deviceId]: data,
          }))
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error)
      setIsConnected(false)

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        eventSource.close()
      }, 5000)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return { deviceStatuses, isConnected }
}

