/**
 * page.tsx (create form) - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page component is responsible for rendering the form creation interface, specifically the `FormBuilder` component, 
 *   if the user is authorized to create forms.
 *   It checks if the user has the appropriate permissions to access the form creation page.
 *
 * Key Features:
 *   - Calls the `allowed` function to verify if the user has permission to access the "Create Form" page.
 *   - If the user is authorized, the page renders the `FormBuilder` component where users can create a new form.
 *   - If the user is not authorized, the page triggers a `notFound` response to deny access.
 *
 * Behavior:
 *   - The `allowed` function is invoked with the path `/forms/create` to check if the current user has permission to access the page.
 *   - If the user is authorized, the page will render the `FormBuilder` component for creating a new form.
 *   - If the user is not authorized (i.e., the result of `allowed` is `false`), the page triggers the `notFound` function 
 *     which returns a 404 error page indicating that the page cannot be found or the user is unauthorized.
 *
 * Components:
 *   - `FormBuilder`: A component responsible for providing the interface to build and customize a form.
 *
 * Notes:
 *   - This page serves as an entry point for users to create new forms, only accessible to authorized users.
 */
import { allowed } from "@/components/navbar"
import { FormBuilder } from "../[id]/form-builder"
import { notFound } from "next/navigation"

export default async function CreateFormPage() {
  const a = await allowed("/forms/create")
  if(a === false) notFound()
  return (
      <FormBuilder />

  )
}