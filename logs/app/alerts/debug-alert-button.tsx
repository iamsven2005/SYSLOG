
/**
 * DebugAlertButton.tsx - 2025-05-25 by sven.tan
 *
 * Provides a manual trigger for running alert condition evaluations with debug output.
 *
 * Functionality:
 * - Calls `runAlertEvaluation()` to evaluate all active alert conditions.
 * - Displays toast notifications based on result:
 *   - Success if one or more conditions are triggered.
 *   - Info if no conditions are triggered.
 *   - Warning if the structure of the result is unexpected.
 *   - Error if the evaluation call fails.
 * - Logs the full results to the browser console for further inspection.
 *
 * Usage:
 * - Add this to a debug panel or admin-only monitoring interface for troubleshooting alerts.
 * - Can be used to manually verify new alert conditions or data ingestion.
 *
 * Limitations:
 * - Not intended for production user interaction.
 * - May consume significant resources if many alerts exist.
 *
 * Improvements:
 * - Optionally pass in a `verbose` or `createEvents` flag to `runAlertEvaluation()`.
 * - Add a loading spinner or visual feedback beyond the button text.
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { runAlertEvaluation } from "./alert-actions"
import { toast } from "sonner"

export function DebugAlertButton() {
  const [isChecking, setIsChecking] = useState(false)

const handleCheck = async () => {
  try {
    setIsChecking(true)
    toast.info("Checking alert conditions with debug logging...")

    const result = await runAlertEvaluation()

    if (
      result &&
      typeof result === "object" &&
      "results" in result &&
      Array.isArray(result.results)
    ) {
      const triggeredCount = result.results.filter((r) => r.triggered).length

      if (triggeredCount > 0) {
        toast.success(`Alert triggered! ${triggeredCount} conditions met.`)
      } else {
        toast.info("No alerts triggered. Check console for debug logs.")
      }

      console.log("Alert evaluation results:", result)
    } else {
      toast.warning("Unexpected response from alert evaluation")
      console.warn("Unexpected alert evaluation result:", result)
    }
  } catch (error) {
    console.error("Error checking alerts:", error)
    toast.error("Error checking alerts. See console for details.")
  } finally {
    setIsChecking(false)
  }
}

  return (
    <Button variant="outline" size="sm" onClick={handleCheck} disabled={isChecking}>
      {isChecking ? "Checking..." : "Debug Alert Check"}
    </Button>
  )
}

