/**
 * page.tsx (Form Response Viewer) - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page fetches a form by ID and renders the `FormViewer` component
 *   for users to submit responses. It handles missing forms gracefully via `notFound()`.
 *
 * Key Features:
 *   - Retrieves the form using `getFormById` from server actions
 *   - Displays form title and optional description
 *   - Renders `FormViewer` with the fetched form
 *   - Uses `notFound()` from `next/navigation` to show a 404 if form is missing
 *
 * Params:
 *   - `params`: Promise resolving to an object with the `id` string representing the form ID
 *
 * Dependencies:
 *   - `getFormById`: Fetches form metadata and questions
 *   - `FormViewer`: Client component for interactive form response
 *   - `notFound`: Next.js function to trigger 404 rendering
 *
 * Notes:
 *   - Intended to be used under dynamic routing like `/forms/[id]`
 */

import { FormViewer } from "./form-viewer"
import { getFormById } from "./actions"
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
      <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
      {form.description && <p className="text-muted-foreground mb-8">{form.description}</p>}
      <FormViewer form={form} />
    </div>
  )
}
