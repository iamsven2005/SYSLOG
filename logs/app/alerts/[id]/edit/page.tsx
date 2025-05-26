/*
 * alert-condition-edit-page-1.0.tsx - 2025-05-25 by sven.tan:
 * Server-side page for editing an existing alert condition.
 * Features:
 *   - Validates `id` param from route; returns 404 via `notFound()` if invalid or missing
 *   - Fetches alert condition data via `getAlertCondition(id)`
 *   - Loads available email templates via `getAllEmailTemplates()`
 *   - Formats timestamps and structure for form use
 *   - Renders <AlertConditionForm> in editing mode with prefilled data
 *   - Includes <DatabaseStatusBar> for connection health display
 *   - Handles edge cases: invalid ID, failed fetch, or missing data gracefully
 */

import { notFound } from "next/navigation"
import { AlertConditionForm } from "../../alert-condition-form"
import { getAllEmailTemplates } from "@/app/email-templates/email-template-actions"
import { DatabaseStatusBar } from "@/components/database-status-bar"
import { getAlertCondition } from "../../alert-actions"


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!params?.id || isNaN(Number(params.id))) {
    notFound()
  }

  const id = Number.parseInt(params.id, 10)

  const alertCondition = await getAlertCondition(id).catch(() => null)
  if (!alertCondition) {
    notFound()
  }

  const emailTemplates = await getAllEmailTemplates()

  const formattedTemplates = emailTemplates?.map((template) => ({
    id: template.id,
    name: template.name,
    createdAt: new Date(template.createdAt),
    updatedAt: new Date(template.updatedAt),
    subject: template.subject,
    body: template.body,
  })) || []

  return (
    <div className="container mx-auto py-6">
      <DatabaseStatusBar />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Alert Condition</h1>
        <p className="text-muted-foreground">Update the settings for this alert condition</p>
      </div>
      <div className="rounded-md border p-6">
        <AlertConditionForm
          emailTemplates={formattedTemplates}
          initialData={alertCondition}
          isEditing={true}
        />
      </div>
    </div>
  )
}

