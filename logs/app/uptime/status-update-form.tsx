"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStatusUpdate } from "./actions"
import { toast } from "sonner"
import { RotateCw } from "lucide-react"

const statusUpdateSchema = z.object({
  type: z.enum(["feature", "maintenance", "incident"]),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
})

type FormValues = z.infer<typeof statusUpdateSchema>

export function StatusUpdateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      type: "feature",
      message: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await addStatusUpdate(data)
      form.reset()
      toast.success("Status Update Added", {
        description: "Your status update has been published.",
      })

      // Force a page refresh to update the status updates list
      window.location.reload()
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add status update. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select update type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="feature">Feature Update</SelectItem>
                  <SelectItem value="maintenance">Scheduled Maintenance</SelectItem>
                  <SelectItem value="incident">Incident Report</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The type of update you're posting</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the update or incident..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Provide details about the update or incident</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Update"
          )}
        </Button>
      </form>
    </Form>
  )
}
