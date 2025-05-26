/**
 * EditTeamForm.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component is used for editing an existing team's details. It allows the user to modify the team's name, sequence, remarks, description,
 *   leaders, members, and locations. The form uses React Hook Form with Zod validation to ensure data integrity and smooth submission.
 *
 * Components:
 *   - `useForm` (React Hook Form): Used for managing form state and validation.
 *   - `zodResolver`: Resolves the Zod validation schema for form validation.
 *   - `Button`, `Card`, `Input`, `Textarea`: UI components for creating the form and displaying input fields.
 *   - `MultiCombobox`: Custom multi-select component for selecting leaders, members, and locations.
 *   - `toast`: Used for displaying success and error messages.
 *
 * Props:
 *   - `team`: The team object containing existing team data to pre-populate the form.
 *   - `users`: A list of all users to populate the leaders and members options.
 *   - `locations`: A list of all locations to populate the locations options.
 *
 * Behavior:
 *   - The form pre-populates with the current team data.
 *   - The user can edit the team name, sequence, remarks, description, leaders, members, and locations.
 *   - Upon submission, the form validates the data and sends the update to the backend using `updateTeam`.
 *   - If successful, the user is redirected to the teams page, and the page is refreshed. If there is an error, an error toast is displayed.
 *
 * Notes:
 *   - Uses `zod` for schema-based validation and `react-hook-form` for managing form states.
 *   - Leaders, members, and locations are selected via the `MultiCombobox` component, which allows for multi-selection.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateTeam } from "@/app/teams/team-actions"
import { toast } from "sonner"
import { MultiCombobox, OptionType } from "@/components/multi-combobox"
import { User } from "@/prisma/generated/main"

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  sequence: z.coerce.number().int().positive("Sequence must be a positive number"),
  remarks: z.string().optional(),
  description: z.string().optional(),
  leaders: z.array(z.string()).min(1, "At least one leader is required"),
  members: z.array(z.string()),
  locations: z.array(z.string()).min(1, "At least one location is required"),
})

type FormValues = z.infer<typeof formSchema>



interface Location {
  id: number
  name: string
}

interface Team {
  id: number
  name: string
  sequence: number
  remarks: string
  description: string | null
  leaders: string[]
  members: string[]
  locations: string[]
}

interface EditTeamFormProps {
  team: Team
  users: User[]
  locations: Location[]
}

export function EditTeamForm({ team, users, locations }: EditTeamFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userOptions: OptionType[] = users.map((user) => ({
    label: user.username ?? user.email ?? `User ${user.id}`,
    value: user.id.toString(),
  }))


  const locationOptions: OptionType[] = locations.map((location) => ({
    label: location.name,
    value: location.id.toString(),
  }))

  // Initialize the form with team data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
      sequence: team.sequence,
      remarks: team.remarks || "",
      description: team.description || "",
      leaders: team.leaders,
      members: team.members,
      locations: team.locations,
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true)

      const result = await updateTeam(team.id, data)

      if (result.success) {
        toast.success("The team has been updated successfully.")
        router.push("/teams")
        router.refresh()
      } else {
        toast.error("Failed to update team")
      }
    } catch (error) {
      console.log(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter sequence number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter remarks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter team description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Leaders</FormLabel>
                  <FormControl>
                    <MultiCombobox
                      options={userOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select team leaders"
                      emptyText="No users found"
                    />
                  </FormControl>
                  <FormDescription>Select one or more users to be team leaders</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <MultiCombobox
                      options={userOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select team members"
                      emptyText="No users found"
                    />
                  </FormControl>
                  <FormDescription>Select users to be team members</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Locations</FormLabel>
                  <FormControl>
                    <MultiCombobox
                      options={locationOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select team locations"
                      emptyText="No locations found"
                    />
                  </FormControl>
                  <FormDescription>Select one or more locations for this team</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Team"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
