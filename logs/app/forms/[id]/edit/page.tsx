/**
 * edit-form-page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This server-side page loads a specific form by ID for editing and renders the `FormBuilder` component.
 *   It supports graceful handling of invalid or missing forms via `notFound()` from Next.js.
 *
 * Key Functions:
 *   - `getFormById`: Fetches form data based on the dynamic route ID.
 *   - `FormBuilder`: UI component used to render and edit the form structure.
 *
 * Parameters:
 *   - `params.id`: Dynamic route parameter representing the form's numeric ID.
 *
 * Behavior:
 *   - Converts the route param to a number and fetches the form.
 *   - If the form does not exist, the page triggers a 404.
 *   - Passes the form (with optional `description` sanitized) to `FormBuilder`.
 *
 * Notes:
 *   - This page is intended to be used at a dynamic route like `/forms/edit/[id]`.
 *   - Assumes `FormBuilder` can handle a missing or undefined `description` field.
 */

import { FormBuilder } from "../form-builder"
import { getFormById } from "../actions"
import { notFound } from "next/navigation"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const formId = Number.parseInt(params.id)
  const form = await getFormById(formId)

  if (!form) {
    notFound()
  }

  return (
    <div className="m-5 p-5">
      <h1 className="text-3xl font-bold mb-8">Edit Form</h1>
      <FormBuilder form={{ ...form, description: form.description ?? undefined }} />
    </div>
  )
}
