/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for the `ProfileClient` component. It checks if the user has access to the `/profile` route 
 *   using the `allowed("/profile")` function and verifies that the user is authenticated via the `getCurrentUser()` function.
 *   If the user is authorized and authenticated, the profile information is displayed using the `ProfileClient` component.
 *   If the user is not authorized or authenticated, they are redirected to a not-found page.
 *
 * Components:
 *   - `ProfileClient`: A component that displays detailed user profile information.
 *
 * Props:
 *   - `user`: The current user's data fetched from the `getCurrentUser()` function, passed to the `ProfileClient` component for rendering.
 *
 * Behavior:
 *   - The `allowed("/profile")` function checks if the user has permission to access the profile page.
 *   - The `getCurrentUser()` function fetches the current user’s data to be passed into the `ProfileClient` component.
 *   - If the user is not authorized or the user data is unavailable, the page will redirect to a not-found route.
 *   - Upon successful authorization and authentication, the page renders the `ProfileClient` component to show the user's profile.
 */
export type EmergencyContactData = {
  PrimaryContact?: string
  MobileContact?: string | number
  Relationship?: string
  SecondContact?: string
  SecondMobile?: string | number
  SecondRelationship?: string
  Remarks?: string
}


import { allowed } from "@/components/navbar"
import ProfileClient from "./ProfileClient"
import { notFound } from "next/navigation"
import { getCurrentUser } from "../login/auth"

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

