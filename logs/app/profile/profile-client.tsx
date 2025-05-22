"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateUserProfile } from "@/app/email-templates/user-actions"
import EmergencyContactForm from "./emergency-contact-form"
import NdaUploadForm from "./nda-upload-form"
import AccountInfoForm from "./account-info-form"
import { toast } from "sonner"
import { User } from "@/prisma/generated/main"
import { updateEmergencyContactInfo } from "./actions"
import { EmergencyContactData } from "./type"

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

