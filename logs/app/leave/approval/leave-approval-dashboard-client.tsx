/**
 * LeaveApprovalDashboardClient.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component handles the display and management of pending leave applications. It allows admins to approve or reject leave applications and provides the option to add comments for each action.
 *   The component also handles the dynamic update of pending leaves and the associated UI, including badges, dates, and reason descriptions.
 *
 * Key Features:
 *   - Displays a list of pending leave applications with options to approve or reject.
 *   - Supports leave type badges, including "Full Day", "Morning", and "Afternoon" labels.
 *   - Allows admins to provide comments when approving or rejecting leave requests.
 *   - Displays a dialog for confirming approval or rejection with the relevant details of the leave request.
 *   - Includes feedback for successful actions, and errors in case of failure.
 *
 * Key Functions:
 *   - `handleOpenDialog`: Opens the dialog for approving or rejecting a leave request.
 *   - `handleSubmit`: Submits the approval or rejection of a leave request, along with any comments.
 *   - `getLeaveTypeBadge`: Generates the appropriate badge for each leave type (Full Day, Morning, Afternoon).
 *   - The component updates the UI state after a leave request is processed (approved or rejected), ensuring the leave is removed from the list and the UI is refreshed.
 *
 * Example Usage:
 *   ```tsx
 *   <LeaveApprovalDashboardClient pendingLeaves={pendingLeavesData} />
 *   ```
 *   This component expects a list of `pendingLeaves` and provides a UI for approving or rejecting each request.
 *
 * Notes:
 *   - The component makes use of the `Dialog` component for the leave approval/rejection process, with a separate dialog for each action.
 *   - If no pending leaves exist, it will display a message indicating so.
 *   - Toast notifications are used to provide feedback to the user on success or failure of the leave actions.
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Check, X, Clock, CalendarIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { approveLeave, rejectLeave } from "@/app/leave/actions"
import { toast } from "sonner"

type Leave = {
  id: number
  userId: number
  userName: string
  startDate: Date
  endDate: Date
  leaveType: string
  reason: string
  status: string
  createdAt: Date
}

interface LeaveApprovalDashboardClientProps {
  pendingLeaves: Leave[]
}

export function LeaveApprovalDashboardClient({
  pendingLeaves: initialPendingLeaves,
}: LeaveApprovalDashboardClientProps) {
  const router = useRouter()
  const [pendingLeaves, setPendingLeaves] = useState(initialPendingLeaves)
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const handleOpenDialog = (leave: Leave, actionType: "approve" | "reject") => {
    setSelectedLeave(leave)
    setAction(actionType)
    setComment("")
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedLeave || !action) return

    setIsSubmitting(true)
    try {
      if (action === "approve") {
        await approveLeave(selectedLeave.id, comment)
        toast.success( "The leave application has been approved successfully.")
      } else {
        await rejectLeave(selectedLeave.id, comment)
        toast.error("The leave application has been rejected.",)
      }

      // Update local state to remove the processed leave
      setPendingLeaves(pendingLeaves.filter((leave) => leave.id !== selectedLeave.id))
      setDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error(`Failed to ${action} leave application. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLeaveTypeBadge = (leaveType: string) => {
    switch (leaveType) {
      case "FULL_DAY":
        return <Badge className="bg-blue-500">Full Day</Badge>
      case "AM":
        return <Badge className="bg-amber-500">Morning</Badge>
      case "PM":
        return <Badge className="bg-purple-500">Afternoon</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {pendingLeaves.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Check className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No Pending Approvals</h3>
            <p className="text-muted-foreground text-center mt-2">
              There are no leave applications waiting for your approval.
            </p>
          </CardContent>
        </Card>
      ) : (
        pendingLeaves.map((leave) => (
          <Card key={leave.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{leave.userName}</CardTitle>
                  <CardDescription>Submitted on {format(new Date(leave.createdAt), "PPP")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                  {getLeaveTypeBadge(leave.leaveType)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Start Date:</span>
                  <span>{format(new Date(leave.startDate), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">End Date:</span>
                  <span>{format(new Date(leave.endDate), "PPP")}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Reason:</h4>
                <p className="text-sm text-muted-foreground">{leave.reason}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleOpenDialog(leave, "reject")}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => handleOpenDialog(leave, "approve")} className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </CardFooter>
          </Card>
        ))
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve Leave" : "Reject Leave"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Add an optional comment for approving this leave request."
                : "Please provide a reason for rejecting this leave request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Employee:</span>
                <p className="text-muted-foreground">{selectedLeave?.userName}</p>
              </div>
              <div>
                <span className="font-medium">Leave Type:</span>
                <p className="text-muted-foreground">
                  {selectedLeave?.leaveType === "FULL_DAY"
                    ? "Full Day"
                    : selectedLeave?.leaveType === "AM"
                      ? "Morning (AM)"
                      : "Afternoon (PM)"}
                </p>
              </div>
              <div>
                <span className="font-medium">Start Date:</span>
                <p className="text-muted-foreground">
                  {selectedLeave ? format(new Date(selectedLeave.startDate), "PPP") : ""}
                </p>
              </div>
              <div>
                <span className="font-medium">End Date:</span>
                <p className="text-muted-foreground">
                  {selectedLeave ? format(new Date(selectedLeave.endDate), "PPP") : ""}
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="text-sm font-medium">
                {action === "approve" ? "Comment (Optional)" : "Reason for Rejection"}
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "Add any comments about this approval..."
                    : "Please explain why this leave is being rejected..."
                }
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (action === "reject" && !comment)}
              variant={action === "approve" ? "default" : "destructive"}
            >
              {isSubmitting ? "Processing..." : action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
