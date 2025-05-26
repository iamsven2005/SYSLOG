/**
 * ThemeToggle Component
 * 
 * This component is responsible for toggling between dark and light themes. It uses the `next-themes` library to manage the theme state. The component ensures proper rendering on the client side by using a mounting check to prevent hydration mismatches.
 * 
 * Features:
 * - Renders a button with a sun and moon icon for switching between light and dark modes.
 * - When clicked, it toggles the theme between "dark" and "light".
 * - The component uses the `useTheme` hook from `next-themes` to manage theme state.
 * - It handles hydration issues, ensuring the component is only rendered after the client has mounted to avoid mismatches during SSR.
 * 
 * Dependencies:
 * - `useTheme` from `next-themes` to handle theme management.
 * - `Moon` and `Sun` icons from `lucide-react` for the visual representation of the theme toggle.
 * - `Button` from "@/components/ui/button" to display the toggle button.
 * 
 * Methods:
 * - `useEffect`: Sets the `mounted` state to `true` after the component mounts, ensuring no hydration issues.
 * - `setTheme`: Changes the theme when the button is clicked, toggling between "dark" and "light".
 * 
 * State:
 * - `mounted`: A boolean state to ensure that the component only renders after the client has mounted.
 * 
 * Structure:
 * - Initially, a disabled button is rendered with icons and `sr-only` text to indicate the theme toggle while the component is mounting.
 * - After mounting, a button is rendered that toggles the theme when clicked. The button changes the theme to either light or dark based on the current theme state.
 */

"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

