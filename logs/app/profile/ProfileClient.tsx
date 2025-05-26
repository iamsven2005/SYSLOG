/**
 * ProfileClient.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component renders the user profile page with tabs for managing emergency contact information, NDA document uploads, and account details.
 *   Each tab provides a form that allows the user to update their information. It uses the `Tabs` component to display the sections for emergency contacts, 
 *   NDA documents, and account information, and handles form submissions to update the respective details.
 *
 * Components:
 *   - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: Tab navigation for switching between the different sections of the profile page.
 *   - `Card`, `CardHeader`, `CardTitle`, `CardContent`: Card layout for each section, containing the form or content.
 *   - `EmergencyContactForm`: A form for updating emergency contact information.
 *   - `NdaUploadForm`: A form for uploading NDA documents.
 *   - `AccountInfoForm`: A form for updating the user’s account information (username and email).
 *   - `toast`: Used for displaying success and error notifications to the user.
 *   - `useRouter`: React hook to handle route refresh after form submissions.
 *
 * Props:
 *   - `user`: The current user's data, including their username, email, emergency contact details, and NDA document status.
 *
 * Behavior:
 *   - The component is divided into three sections: "Emergency Contacts", "NDA Documents", and "Account Information", which are managed using the `Tabs` component.
 *   - When a user submits a form (for example, to update their emergency contact information), the relevant handler is triggered, such as `handleEmergencyContactSubmit` or `handleProfileUpdate`.
 *   - After successful form submissions, a success toast is shown, and the page is refreshed using `router.refresh()` to reflect the updated data.
 *   - The `sanitizedUser` object ensures that all fields are populated with default values to avoid any issues with missing or undefined data.
 *
 * Notes:
 *   - The component supports a loading state (`isSubmitting`), which disables form submission buttons while the form is being processed.
 *   - Each form is isolated in its own tab, allowing users to focus on updating one set of information at a time.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateUserProfile } from "@/app/email-templates/user-actions"
import EmergencyContactForm from "./EmergencyContactForm"
import NdaUploadForm from "./NdaUploadForm"
import AccountInfoForm from "./AccountInfoForm"
import { toast } from "sonner"
import { User } from "@/prisma/generated/main"
import { updateEmergencyContactInfo } from "./emergency-contact-actions"
import { EmergencyContactData } from "./page"

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert nullable fields to fallback values to satisfy stricter prop types
const sanitizedUser = {
  ...user,
  username: user.username ?? "",
  email: user.email ?? "",
  updatedAt: user.updatedAt ?? new Date(),
  Mobile: user.Mobile ?? undefined,
  PrimaryContact: user.PrimaryContact ?? undefined,
  MobileContact: user.MobileContact ?? undefined,
  Relationship: user.Relationship ?? undefined,
  SecondContact: user.SecondContact ?? undefined,
  SecondMobile: user.SecondMobile ?? undefined,
  SecondRelationship: user.SecondRelationship ?? undefined,
  Remarks: user.Remarks ?? undefined,
}


  const handleProfileUpdate = async (formData: { username: string; email: string }) => {
    setIsSubmitting(true)

    try {
      const result = await updateUserProfile({
        userId: user.id,
        username: formData.username,
        email: formData.email,
      })

      if (result.success) {
        toast.success("Your profile has been updated successfully.")
        router.refresh()
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }
const handleEmergencyContactSubmit = async (data: EmergencyContactData) => {
  setIsSubmitting(true)
  try {
    // Replace this with your actual update function for emergency contact info
    const result = await updateEmergencyContactInfo(user.id, data)

    if (result.success) {
      toast.success("Emergency contact updated.")
      router.refresh()
    } else {
      toast.error("Failed to update emergency contact")
    }
  } catch (err) {
    console.error(err)
    toast.error("An error occurred")
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <Tabs defaultValue="emergency-contacts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="emergency-contacts">Emergency Contacts</TabsTrigger>
        <TabsTrigger value="nda-documents">NDA Documents</TabsTrigger>
        <TabsTrigger value="account-info">Account Information</TabsTrigger>
      </TabsList>

      <TabsContent value="emergency-contacts">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
<EmergencyContactForm
  user={sanitizedUser}
  onSubmit={handleEmergencyContactSubmit}
  isSubmitting={isSubmitting}
/>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="nda-documents">
        <Card>
          <CardHeader>
            <CardTitle>NDA Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <NdaUploadForm user={user} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account-info">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountInfoForm user={sanitizedUser} onSubmit={handleProfileUpdate} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

