/**
 * leave-application-form.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component provides a form for users to apply for leave. It allows users to specify the leave start and end dates,
 *   leave type (full day, morning, afternoon), the approver for the leave request, and the reason for leave. The form uses
 *   React Hook Form with Zod validation and submits the data to the server for processing.
 *
 * Key Features:
 *   - Allows users to select start and end dates using a calendar picker.
 *   - Provides options to select leave type (full day, morning, afternoon).
 *   - Includes a description field to provide a reason for the leave request.
 *   - Includes an approver dropdown to select the person who will approve the leave request.
 *   - Validation ensures that the dates are correct, the reason is sufficiently long, and that the end date is after the start date.
 *   - Upon submission, the leave application is sent to the server for approval.
 *   - Displays appropriate feedback via toast notifications on success or failure.
 *
 * Key Functions:
 *   - `onSubmit`: Submits the form and sends leave data to the server via `submitLeaveApplication`.
 *   - `handleDateSelect`: Updates the start and end dates when the user selects a date.
 *   - `handleSubmit`: Handles form submission, including validation and server request.
 *
 * Example Usage:
 *   ```tsx
 *   <LeaveApplicationForm />
 *   ```
 *
 * Notes:
 *   - `APPROVERS` are predefined in this example but in a real application, they could be fetched from the database or an API.
 *   - The calendar is disabled for past dates, ensuring users can only pick future dates.
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { submitLeaveApplication } from "@/app/leave/actions"
import { toast } from "sonner"

const leaveFormSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z
      .date({
        required_error: "End date is required",
      })
      .refine((date) => date >= new Date(), {
        message: "End date cannot be in the past",
      }),
    leaveType: z.enum(["FULL_DAY", "AM", "PM"], {
      required_error: "Please select a leave type",
    }),
    reason: z.string().min(5, {
      message: "Reason must be at least 5 characters",
    }),
    approverId: z.number({
      required_error: "Please select an approver",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type LeaveFormValues = z.infer<typeof leaveFormSchema>

// This would come from your API in a real application
const APPROVERS = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" },
]

export function LeaveApplicationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      leaveType: "FULL_DAY",
      reason: "",
    },
  })

  async function onSubmit(data: LeaveFormValues) {
    setIsSubmitting(true)
    try {
      await submitLeaveApplication(data)
      toast.success("Your leave application has been submitted for approval.",)
      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Failed to submit leave application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="leaveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leave Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FULL_DAY">Full Day</SelectItem>
                    <SelectItem value="AM">Morning (AM)</SelectItem>
                    <SelectItem value="PM">Afternoon (PM)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select whether you need a full day or half day leave</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="approverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approver</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an approver" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {APPROVERS.map((approver) => (
                      <SelectItem key={approver.id} value={approver.id.toString()}>
                        {approver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the person who will approve your leave request</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Leave</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide a reason for your leave request"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Briefly explain why you are requesting leave</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Leave Application"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
