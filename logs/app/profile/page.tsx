import { allowed } from "@/components/navbar"
import ProfileClient from "./profile-client"
import { notFound } from "next/navigation"
import { getCurrentUser } from "../login/actions"

export default async function ProfilePage() {
  const a = await allowed("/profile")
  const user = await getCurrentUser()

  if (a === false || !user) notFound()
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileClient user={user} />
    </div>
  )
}

