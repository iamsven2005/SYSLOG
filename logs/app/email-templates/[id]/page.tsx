/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for the `EmailTemplateDetailPage` component.
 *   It fetches the `id` parameter from the route and passes it as a prop to the `EmailTemplateDetailPage` for rendering.
 * 
 * Components:
 *   - `EmailTemplateDetailPage`: Displays the details of a specific email template, including metadata, body preview, and edit form.
 * 
 * Props:
 *   - `params`: The route parameters containing the `id` of the email template to display (as a string).
 * 
 * Behavior:
 *   - This component uses `await` to fetch the `params` from `props` and then renders the `EmailTemplateDetailPage` with the extracted `id`.
 */

import EmailTemplateDetailPage from "./emailclient"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return <EmailTemplateDetailPage params={params} />
}