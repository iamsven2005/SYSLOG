/**
 * EmergencyContactForm.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This form component allows users to input and update their emergency contact information. 
 *   The form includes fields for both primary and secondary emergency contacts, with optional fields for remarks.
 *   It also allows updating the user's own mobile number. The form is designed to handle submission, 
 *   validation, and saving of the updated emergency contact details.
 *
 * Components:
 *   - `Button`: Submit button to save the updated emergency contact information.
 *   - `Input`: Form inputs for capturing contact details like mobile number, primary and secondary contact names, and relationships.
 *   - `Textarea`: A text area for entering remarks regarding the emergency contacts.
 *   - `Label`: Provides labels for form fields.
 *   - `Card`: A container for the form fields.
 *
 * Props:
 *   - `user`: The user's current emergency contact data, including their mobile number, primary contact, secondary contact, and remarks.
 *   - `onSubmit`: A callback function that is called when the form is submitted, passing the updated contact information.
 *   - `isSubmitting`: A boolean flag indicating whether the form is in the process of being submitted. It disables the submit button during submission.
 *
 * Behavior:
 *   - The form pre-fills with the user's current contact information and allows editing of the fields.
 *   - The mobile numbers are parsed as numbers and validated before submission.
 *   - The form includes both mandatory and optional fields for emergency contacts, with all fields displayed as inputs or text areas.
 *   - On submission, the updated data is passed to the `onSubmit` function, and the submit button is disabled while the form is being processed.
 *   - A timestamp is displayed showing when the form was last saved, using the `updatedAt` property of the user.
 * 
 * Notes:
 *   - The form includes basic client-side validation to ensure that the mobile contact fields are numeric.
 *   - The `Remarks` field is optional and can be left empty.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EmergencyContactData {
  Mobile: number | string
  PrimaryContact: string
  MobileContact: number | string
  Relationship: string
  SecondContact: string
  SecondMobile: number | string
  SecondRelationship: string
  Remarks: string
}

interface EmergencyContactFormProps {
  user: {
    username: string
    updatedAt: string | Date
    Mobile?: number | string
    PrimaryContact?: string
    MobileContact?: number | string
    Relationship?: string
    SecondContact?: string
    SecondMobile?: number | string
    SecondRelationship?: string
    Remarks?: string
  }
  onSubmit: (data: EmergencyContactData) => void
  isSubmitting: boolean
}

export default function EmergencyContactForm({
  user,
  onSubmit,
  isSubmitting,
}: EmergencyContactFormProps) {  const [formData, setFormData] = useState({
    Mobile: user.Mobile || "",
    PrimaryContact: user.PrimaryContact || "",
    MobileContact: user.MobileContact || "",
    Relationship: user.Relationship || "",
    SecondContact: user.SecondContact || "",
    SecondMobile: user.SecondMobile || "",
    SecondRelationship: user.SecondRelationship || "",
    Remarks: user.Remarks || "",
  })

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Mobile") ? (value ? Number.parseInt(value) : "") : value,
    }))
  }

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-500 text-white p-2 font-medium">
        In the event of an emergency, please list the name and mobile number of the person to contact:
      </div>

      <div className="grid grid-cols-[150px_1fr] items-center gap-2">
        <Label htmlFor="staffName" className="bg-blue-400 text-white p-2">
          Staff Name:
        </Label>
        <div className="font-medium">{user.username}</div>

        <Label htmlFor="Mobile" className="bg-blue-400 text-white p-2">
          Mobile No.
        </Label>
        <Input
          id="Mobile"
          name="Mobile"
          type="number"
          value={formData.Mobile || ""}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mt-8 mb-4 font-medium">Emergency Contact Information</div>

      <div className="grid grid-cols-[200px_1fr] items-center gap-2">
        <Label htmlFor="PrimaryContact" className="bg-blue-400 text-white p-2">
          Primary Contact Name:
        </Label>
        <Input
          id="PrimaryContact"
          name="PrimaryContact"
          value={formData.PrimaryContact || ""}
          onChange={handleChange}
          className="w-full"
        />

        <Label htmlFor="MobileContact" className="bg-blue-400 text-white p-2">
          Mobile No.:
        </Label>
        <Input
          id="MobileContact"
          name="MobileContact"
          type="number"
          value={formData.MobileContact || ""}
          onChange={handleChange}
          className="w-full"
        />

        <Label htmlFor="Relationship" className="bg-blue-400 text-white p-2">
          Relationship:
        </Label>
        <Input
          id="Relationship"
          name="Relationship"
          value={formData.Relationship || ""}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mt-8 mb-4 font-medium">Optional:</div>

      <div className="grid grid-cols-[200px_1fr] items-center gap-2">
        <Label htmlFor="SecondContact" className="bg-blue-400 text-white p-2">
          Secondary Contact Name:
        </Label>
        <Input
          id="SecondContact"
          name="SecondContact"
          value={formData.SecondContact || ""}
          onChange={handleChange}
          className="w-full"
        />

        <Label htmlFor="SecondMobile" className="bg-blue-400 text-white p-2">
          Mobile No.:
        </Label>
        <Input
          id="SecondMobile"
          name="SecondMobile"
          type="number"
          value={formData.SecondMobile || ""}
          onChange={handleChange}
          className="w-full"
        />

        <Label htmlFor="SecondRelationship" className="bg-blue-400 text-white p-2">
          Relationship:
        </Label>
        <Input
          id="SecondRelationship"
          name="SecondRelationship"
          value={formData.SecondRelationship || ""}
          onChange={handleChange}
          className="w-full"
        />

        <Label htmlFor="Remarks" className="bg-blue-400 text-white p-2 h-full">
          Remarks:
        </Label>
        <Textarea
          id="Remarks"
          name="Remarks"
          value={formData.Remarks || ""}
          onChange={handleChange}
          className="w-full min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        Last saved by {user.username} on {new Date(user.updatedAt).toLocaleString()}
      </div>
    </form>
  )
}

