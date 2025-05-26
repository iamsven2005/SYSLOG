/**
 * Home Component
 * 
 * This component serves as the landing page that checks whether a user is authenticated and redirects them accordingly. It uses `useEffect` to check the user's authentication status and their role when the component mounts. If the user is not authenticated or does not have the correct role, they are redirected to the login page or the appropriate dashboard page.
 * 
 * Features:
 * - On mount, the component checks the user's authentication status using `getCurrentUser()`.
 * - If the user is not authenticated, they are redirected to the login page.
 * - If the user has an "admin" role, they are redirected to the logs page.
 * - If the user does not have an "admin" role, they are redirected to the notifications page.
 * - Displays a loading spinner while the authentication check is in progress.
 * 
 * Dependencies:
 * - `getCurrentUser` from `./login/auth` to retrieve the current user details.
 * - `useRouter` from `next/navigation` to handle routing logic.
 * - `Loader2` from `lucide-react` to display a loading spinner during the authentication check.
 * 
 * Methods:
 * - `checkAuth`: An asynchronous function that checks if the user is authenticated and determines their role, then redirects them accordingly.
 * 
 * State:
 * - No state is maintained in this component, as it primarily handles the routing logic based on user authentication.
 * 
 * Structure:
 * - The component renders a loading spinner and a message while it waits for the authentication check to complete. 
 * - Once the check is done, it redirects the user to the appropriate page based on their role.
 */


"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "./login/auth"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        if (user?.role?.some(role => role.toLowerCase().includes("admin"))) {
          router.push("/logs")
        } else {
          router.push("/notifications")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Redirecting...</p>
      </div>
    </div>
  )
}

