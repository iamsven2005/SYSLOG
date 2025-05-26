/**
 * leave/actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains server-side functions for handling leave applications, including submission, approval, rejection, and fetching of leave data.
 *   It also includes functions for retrieving pending and approved leave requests, utilizing Prisma for database operations.
 *   The functions work with a leave form schema, handle validations using Zod, and provide revalidation for paths to update the leave status.
 *
 * Key Functions:
 *   - `submitLeaveApplication`: Submits a new leave application by validating the input data and storing it in the database.
 *   - `approveLeave`: Approves a leave application and records the approval with comments and timestamp.
 *   - `rejectLeave`: Rejects a leave application and records the rejection with comments and timestamp.
 *   - `getLeavesByDateRange`: Fetches approved leaves within a specific date range.
 *   - `getPendingLeaves`: Fetches all pending leave requests for approval.
 *   - `getApprovedLeaves`: Fetches all approved leave requests.
 *
 * Example Usage:
 *   ```ts
 *   await submitLeaveApplication({ startDate, endDate, leaveType, reason, approverId });
 *   await approveLeave(leaveId, "Approved for annual leave.");
 *   await rejectLeave(leaveId, "Insufficient reason for leave.");
 *   const pendingLeaves = await getPendingLeaves();
 *   const approvedLeaves = await getApprovedLeaves();
 *   ```
 *
 * Notes:
 *   - The `leaveFormSchema` defined using Zod ensures that leave applications are validated before they are submitted to the database.
 *   - The `approveLeave` and `rejectLeave` functions update the leave status and add comments along with timestamps.
 *   - `getLeavesByDateRange` checks for overlapping leave dates to determine if there is any conflict with other approved leaves.
 *   - The system utilizes `revalidatePath` to refresh pages related to leave data whenever changes occur.
 */
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getId } from "../login/auth"
const leaveFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  leaveType: z.enum(["FULL_DAY", "AM", "PM"]),
  reason: z.string().min(5),
  approverId: z.number(),
})

type LeaveFormValues = z.infer<typeof leaveFormSchema>

export async function submitLeaveApplication(data: LeaveFormValues) {
  const validatedData = leaveFormSchema.parse(data)
  const id = await getId() || 0
  await db.leave.create({
    data: {
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      leaveType: validatedData.leaveType,
      reason: validatedData.reason,
      status: "PENDING",
      user: { connect: { id } },
      approver: { connect: { id: validatedData.approverId } },
    },
  })

  revalidatePath("/leave")
  revalidatePath("/leave/approval")

  return { success: true }
}

export async function approveLeave(leaveId: number, comment: string) {
  await db.leave.update({
    where: { id: leaveId },
    data: {
      status: "APPROVED",
      approverComment: comment,
      approvedAt: new Date(),
    },
  })

  revalidatePath("/leave")
  revalidatePath("/leave/approval")

  return { success: true }
}

export async function rejectLeave(leaveId: number, comment: string) {
  await db.leave.update({
    where: { id: leaveId },
    data: {
      status: "REJECTED",
      approverComment: comment,
      rejectedAt: new Date(),
    },
  })

  revalidatePath("/leave")
  revalidatePath("/leave/approval")

  return { success: true }
}

export async function getLeavesByDateRange(startDate: Date, endDate: Date) {
  const leaves = await db.leave.findMany({
    where: {
      status: "APPROVED",
      OR: [
        {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }],
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  })

  return leaves
}

// Add a function to get pending leave requests
export async function getPendingLeaves() {
  const pendingLeaves = await db.leave.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return pendingLeaves
}

// Add a function to get all approved leaves
export async function getApprovedLeaves() {
  const approvedLeaves = await db.leave.findMany({
    where: {
      status: "APPROVED",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  })

  return approvedLeaves
}
