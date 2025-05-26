/**
 * RootLayout Component
 * 
 * This component serves as the top-level layout for the application. It includes global styles, theme management, and conditionally renders specific UI elements such as alerts and the Navbar based on the user's role.
 * 
 * Features:
 * - Manages global theme using `ThemeProvider`, enabling system theme and system-wide theme switching.
 * - Displays command match alerts and a wrapper for alert monitoring, with conditional rendering based on the user's role (admin).
 * - Includes a global `Navbar` for navigation, placed at the top of the layout.
 * - Shows notifications using `Toaster` from `sonner` to provide feedback to the user.
 * - Fetches the current user’s data using `getCurrentUser` and conditionally displays content based on the user's role.
 * 
 * Dependencies:
 * - `ThemeProvider` from `@/components/theme-provider` for managing theme preferences.
 * - `Toaster` from `sonner` for displaying toast notifications.
 * - `CommandMatchAlert` and `AlertMonitorWrapper` for handling alerts and command match notifications.
 * - `Navbar` for providing navigation throughout the app.
 * 
 * Methods:
 * - `getCurrentUser`: Fetches the current user details and determines if they have an admin role.
 * 
 * State:
 * - `user`: The current user object fetched from `getCurrentUser()`. The component checks the user's role to conditionally display certain UI elements.
 * 
 * Structure:
 * - The component wraps the children (passed by the layout) with a global theme provider and conditionally displays user-specific content.
 * - It contains a fixed alert section at the top-right of the screen (visible only if the user is an admin).
 * - The `Navbar` is always visible and serves as the main navigation for the app.
 */


import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { CommandMatchAlert } from "@/app/command-matches/command-match-alert"
import { AlertMonitorWrapper } from "@/components/alert/alert-monitor-wrapper"
import { getCurrentUser } from "./login/auth"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const user = await getCurrentUser()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">

            {user?.role.includes("admin") && (
              <CommandMatchAlert matches={[]} />

            )}
            <AlertMonitorWrapper />
          </div>
          {user && <Navbar />
          }

          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

