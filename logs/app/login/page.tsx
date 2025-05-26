/**
 * LoginPage.tsx - 2025-05-25 by sven.tan
 *
 * Provides the user interface for logging into the system with a username and password.
 *
 * Functionality:
 * - Handles form submission to trigger the `loginUser` function for authenticating users.
 * - Displays loading state during login processing.
 * - Redirects users based on their role (admin redirects to logs, others to notifications).
 * - Provides feedback with toast notifications:
 *   - Success on successful login, including a personalized welcome message.
 *   - Error if login fails or an unexpected error occurs.
 * - Includes a `DatabaseStatusBar` to show database connection status.
 *
 * Usage:
 * - Add this page to your authentication flow for user login.
 * - Ensure the `loginUser` function is correctly integrated for authenticating users.
 * - Customize the redirection paths based on user roles as needed.
 *
 * Limitations:
 * - Currently only handles basic username and password login without additional security features (e.g., two-factor authentication).
 * - Error handling is generic; consider expanding for more specific error cases (e.g., invalid credentials vs. server issues).
 * - Relies on the `loginUser` function to handle authentication, which could be refactored for improved security (e.g., password hashing).
 *
 * Improvements:
 * - Implement input validation (e.g., username and password strength checks).
 * - Add a loading spinner or visual feedback during the login process for better user experience.
 * - Expand error messages to provide more context (e.g., incorrect password, account locked, etc.).
 * - Integrate two-factor authentication or other secure methods for login.
 */

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "./auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { DatabaseStatusBar } from "@/components/database-status-bar"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginUser({ username, password })

      if (result?.success) {
        toast.success(`Welcome back, ${result.username}!`)

        if (result?.role?.some(role => role.toLowerCase().includes("admin"))) {
          router.push("/logs")
        } else {
          router.push("/notifications")
        }
      } else {
        toast.error(result?.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <DatabaseStatusBar />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

