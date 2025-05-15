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

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            <EmergencyContactForm user={user} onSubmit={handleProfileUpdate} isSubmitting={isSubmitting} />
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
            <AccountInfoForm user={user} onSubmit={handleProfileUpdate} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

