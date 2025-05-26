/**
 * CreateWorkflowButton Component
 * 
 * This component renders a button that allows the user to navigate to the "Create Workflow" page. The button can be customized
 * with different variants, sizes, and additional class names. It includes a plus-circle icon and the text "Create Workflow".
 * 
 * Features:
 * - Customizable button with different styles (default, outline, secondary, ghost, etc.).
 * - Redirects to the "Create Workflow" page when clicked.
 * - Icon and text inside the button to indicate the action of creating a new workflow.
 * 
 * Props:
 * - `variant` (string, optional): Defines the visual style of the button. Default is "default". Options include "outline", "secondary", "ghost", "link", and "destructive".
 * - `size` (string, optional): Defines the size of the button. Default is "default". Options include "sm", "lg", and "icon".
 * - `className` (string, optional): Additional custom CSS classes for further styling.
 * 
 * Dependencies:
 * - `Button`: UI component for the button element.
 * - `Link`: Navigates to the "Create Workflow" page.
 * - `PlusCircle`: Icon displayed inside the button.
 */


"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface CreateWorkflowButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CreateWorkflowButton({ variant = "default", size = "default", className }: CreateWorkflowButtonProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href="/workflows/new">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Workflow
      </Link>
    </Button>
  )
}
