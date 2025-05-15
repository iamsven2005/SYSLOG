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
