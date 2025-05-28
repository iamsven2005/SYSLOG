"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addUrl } from "./actions"
import { toast } from "sonner"
import { RotateCw } from "lucide-react"

const urlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  name: z.string().min(1, { message: "Name is required" }),
})

type FormValues = z.infer<typeof urlSchema>

export default function AddUrlForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      name: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await addUrl(data)
      form.reset()
      toast.success("URL Added", {
        description: `${data.name} has been added to monitoring.`,
      })

      // Force a page refresh to update the URL list
      window.location.reload()
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add URL. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Website" {...field} />
              </FormControl>
              <FormDescription>A friendly name for this URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>The URL you want to monitor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add URL"
          )}
        </Button>
      </form>
    </Form>
  )
}
