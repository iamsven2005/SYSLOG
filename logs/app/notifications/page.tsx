/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for the `NotificationsClient` component. It ensures that 
 *   the user has the necessary permissions to access the notifications page by checking if they 
 *   are authenticated and authorized (based on their roles). If the user is authorized, it renders 
 *   the `NotificationsClient` component; otherwise, it redirects the user to a not-found page.
 * 
 * Components:
 *   - `NotificationsClient`: Displays the notifications interface, including creation, filtering, 
 *     and managing notices.
 *   - `Suspense`: Wraps the `NotificationsClient` component to handle loading states, showing a spinner 
 *     while the notifications data is being fetched.
 * 
 * Props:
 *   None (handled internally by `getCurrentUser` and `hasRole` functions).
 * 
 * Behavior:
 *   - The page checks whether the user has access to the `/notifications` route by calling `allowed("/notifications")`.
 *   - It retrieves the current user using `getCurrentUser()`, and if no user is found or the user is not authorized, 
 *     it redirects to a not-found page.
 *   - The user’s role is checked to determine if they are an admin (`hasRole(user, ["admin"])`).
 *   - If the user is authorized and has the admin role, the `NotificationsClient` component is rendered inside a `Suspense` 
 *     wrapper, which displays a loading spinner while data is being fetched.
 */

import { Suspense } from "react"
import NotificationsClient from "./NotificationsClient"
import { allowed } from "@/components/navbar"
import { getCurrentUser, hasRole } from "../login/auth"
import { notFound } from "next/navigation"

export default async function NotificationsPage() {
  const a = await allowed("/notifications")
  const user = await getCurrentUser()
  if(a === false || !user) notFound()
  const isadmin = await hasRole(user, ["admin"])

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <NotificationsClient isAdmin={isadmin} />
    </Suspense>
  )
}

