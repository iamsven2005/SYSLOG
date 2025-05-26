/**
 * StepLogs Component
 * 
 * This component is responsible for displaying the activity logs of a specific audit step. It allows users to add new logs, view existing logs,
 * and interact with logs related to that specific step. It also fetches the current user to associate logs with a user and updates the logs in real-time.
 * 
 * Features:
 * - Displays a list of logs for the given step, including the message, creator, and timestamp.
 * - Allows the current user to add new log messages.
 * - Provides a loading state when fetching logs.
 * - Displays an error message if logs cannot be loaded or a log cannot be added.
 * 
 * Props:
 * - `stepId` (string): The ID of the step for which the logs are to be displayed.
 * 
 * State:
 * - `logs`: An array of logs for the current step.
 * - `newLogMessage`: The value of the new log message being typed.
 * - `isLoading`: A boolean flag indicating whether the logs are being fetched.
 * - `isSubmitting`: A boolean flag indicating whether a log is being submitted.
 * - `error`: A string that holds any error message if an operation fails.
 * - `currentUser`: The current user who is adding a log or viewing logs.
 * 
 * Methods:
 * - `handleAddLog`: Adds a new log for the given step and updates the logs state.
 * 
 * Dependencies:
 * - `Button`, `Input`, `Avatar`, `AvatarFallback`: UI components for handling user input and displaying logs.
 * - `getLogsByStepId`, `createLog`, `getCurrentUser`: Functions for interacting with the backend and handling the log data.
 * 
 * Notes:
 * - The log creation is done asynchronously, with feedback shown to the user while the log is being processed.
 * - If there are no logs, a "No activity logs yet" message is displayed.
 */


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getLogsByStepId, createLog, getCurrentUser } from "./actions"
import type { StepLog } from "./types"

interface StepLogsProps {
  stepId: string
}
interface CurrentUser {
  id: number
  username?: string | null
  email?: string | null
}

export function StepLogs({ stepId }: StepLogsProps) {
  const [logs, setLogs] = useState<StepLog[]>([])
  const [newLogMessage, setNewLogMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch logs
        const logsResult = await getLogsByStepId(stepId)
        if (logsResult.success) {
          setLogs(logsResult.data ?? []) // ✅ ensure it’s never undefined
        }
        else {
          setError(logsResult.error || "Failed to load logs")
        }

        // Fetch current user
        const userResult = await getCurrentUser()
        if (userResult.success) {
          setCurrentUser(userResult.data)
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [stepId])

  const handleAddLog = async () => {
    if (!newLogMessage.trim() || !currentUser) return

    setIsSubmitting(true)
    try {
      const result = await createLog(stepId, {
        message: newLogMessage,
        createdBy: currentUser.username || currentUser.email || `User ${currentUser.id}`,
      })

      if (result.success && result.data) {
        setLogs([result.data, ...logs])
        setNewLogMessage("")
      } else {
        setError(result.error || "Failed to add log")
      }

    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="p-2 text-sm border rounded-md bg-destructive/10 text-destructive mb-2">{error}</div>}

      <div className="flex gap-2">
        <Input
          placeholder="Add a comment or log..."
          value={newLogMessage}
          onChange={(e) => setNewLogMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddLog()
            }
          }}
          disabled={isSubmitting || !currentUser}
        />
        <Button onClick={handleAddLog} disabled={isSubmitting || !currentUser}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-2">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            <span className="ml-2">Loading logs...</span>
          </div>
        ) : logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{log.createdBy.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{log.message}</div>
                <div className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No activity logs yet</p>
        )}
      </div>
    </div>
  )
}
