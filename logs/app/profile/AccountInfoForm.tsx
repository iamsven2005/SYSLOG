/**
 * AccountInfoForm.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component renders a form for viewing and updating account information, including the username, email, 
 *   roles, and account creation date. It allows users to update their email, while the username and roles are displayed 
 *   as read-only. The form handles submission with validation to ensure proper updates.
 *
 * Components:
 *   - `Card`: A container for the form fields.
 *   - `Label`: Labels for the form fields such as username, email, role, and creation date.
 *   - `Input`: Form inputs for the username and email fields.
 *   - `Button`: A submit button that triggers the form submission.
 * 
 * Props:
 *   - `user`: An object representing the user's current account information, including username, email, roles, and created date.
 *   - `onSubmit`: A callback function that is triggered when the form is submitted with the updated data (username and email).
 *   - `isSubmitting`: A boolean flag indicating whether the form is in the process of being submitted, used to disable the submit button.
 * 
 * Behavior:
 *   - The form pre-fills with the current user’s data and allows the email to be updated.
 *   - The username field is displayed as a read-only input, while roles and the member since date are also displayed as read-only text.
 *   - When the form is submitted, the `onSubmit` callback is triggered with the updated username and email.
 *   - The submit button is disabled during submission to prevent multiple submissions.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

// Define the shape of the user prop
interface User {
  username: string | null
  email: string | null
  role: string[]
  createdAt: string | Date
}

// Define props for the component
interface AccountInfoFormProps {
  user: User
  onSubmit: (data: { username: string; email: string }) => void
  isSubmitting: boolean
}

export default function AccountInfoForm({ user, onSubmit, isSubmitting }: AccountInfoFormProps) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full"
              disabled
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <Label>Role:</Label>
            <div>{user.role.join(", ")}</div>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <Label>Member Since:</Label>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Account"}
        </Button>
      </div>
    </form>
  )
}
