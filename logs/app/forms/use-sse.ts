/**
 * useSSE.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This custom React hook sets up a Server-Sent Event (SSE) connection to listen for real-time events sent to a specific channel.
 *   It provides listeners for opening, receiving messages, and handling errors. The hook manages the SSE connection lifecycle
 *   (open, message, error), allowing easy integration of real-time event handling in React components.
 *
 * Key Features:
 *   - Connects to a given SSE channel and listens for messages.
 *   - Exposes connection state, last event, and any errors encountered.
 *   - Provides handlers for real-time data and errors.
 *   - Automatically reconnects when the component is mounted and cleans up when unmounted.
 *
 * Key Functions:
 *   - `useEffect`: Manages the lifecycle of the SSE connection.
 *   - `onMessage`: Callback that processes the incoming event data.
 *   - `onError`: Callback that handles errors during the SSE connection.
 *   - `onOpen`: Callback that handles the opening of the SSE connection.
 *   - `close`: Method that closes the SSE connection and resets the connection state.
 *
 * Example Usage:
 *   ```tsx
 *   const { isConnected, lastEvent, error, close } = useSSE("form-1-responses", {
 *     onMessage: (data) => {
 *       console.log("New response:", data);
 *     },
 *     onError: (err) => {
 *       console.error("Error in SSE:", err);
 *     },
 *     onOpen: () => {
 *       console.log("SSE connection established");
 *     },
 *   });
 *   ```
 *
 * Notes:
 *   - `channel`: The SSE channel to listen to. This should be a unique identifier for your event source (e.g., "form-1-responses").
 *   - `onMessage`: Callback to handle incoming data. It will receive the event's data as an object.
 *   - `onError`: Callback to handle errors during the SSE connection.
 *   - `onOpen`: Callback to handle when the SSE connection is successfully established.
 *   - `enabled`: Flag to enable or disable the SSE connection. Set to `true` by default.
 *   - The hook returns connection state (`isConnected`), the last received event (`lastEvent`), and any error encountered (`error`).
 */

"use client"

import { useEffect, useState } from "react"

// Define types for SSE options
interface SSEOptions {
  onMessage?: (data: Record<string, unknown>) => void
  onError?: (error: Error | Event) => void
  onOpen?: () => void
  enabled?: boolean
}

export function useSSE(channel: string, options: SSEOptions = {}) {
  const { onMessage, onError, onOpen, enabled = true } = options
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<Record<string, unknown> | null>(null) // Typing lastEvent
  const [error, setError] = useState<Error | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    if (!enabled || !channel || typeof window === "undefined") return

    let sse: EventSource | null = null

    try {
      // Create EventSource
      sse = new EventSource(`/api/sse?channel=${encodeURIComponent(channel)}`)
      setEventSource(sse)

      // Set up event handlers
      sse.onopen = () => {
        setIsConnected(true)
        setError(null)
        onOpen?.()
      }

      sse.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          setLastEvent(data)
          onMessage?.(data)
        } catch (err) {
          console.error("Error parsing SSE message:", err)
        }
      }

      sse.onerror = (err: Event) => {
        setIsConnected(false)
        setError(err as unknown as Error)
        onError?.(err)

        // Close on error
        sse?.close()
      }
    } catch (err) {
      console.error("Error setting up SSE:", err)
      setError(err as Error)
    }

    // Clean up
    return () => {
      if (sse) {
        sse.close()
        setEventSource(null)
        setIsConnected(false)
      }
    }
  }, [channel, enabled, onError, onMessage, onOpen]) // Add missing dependencies

  return {
    isConnected,
    lastEvent,
    error,
    close: () => {
      eventSource?.close()
      setEventSource(null)
      setIsConnected(false)
    },
  }
}
