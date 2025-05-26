/**
 * Page.tsx - 2025-05-25 by sven.tan
 *
 * Displays a detailed page for viewing a specific note, including its title and description.
 * The page includes permission checks and ensures the user is authenticated before allowing access.
 *
 * Functionality:
 * - Fetches a note from the database using its ID from the route parameters (`params.id`).
 * - Ensures the user is logged in by checking their session (`getCurrentUser`). If not logged in, redirects to the login page.
 * - Verifies that the current user has the necessary permissions to view the page using `checkUserPermission`. If permission is denied, returns a 404.
 * - Renders the note's title and description in a clean, readable format. If the description is HTML, it is rendered using `dangerouslySetInnerHTML`.
 * - Includes a button to navigate back to the "new ticket" page.
 *
 * Usage:
 * - Use this page to display notes, ensuring users are authenticated and authorized before viewing.
 * - Suitable for viewing tickets, support notes, or other similar entities where permission is required.
 *
 * Limitations:
 * - The note description is rendered as raw HTML, so it may expose vulnerabilities if the content is not sanitized properly.
 * - Relies on the user being authenticated and authorized, which may impact user experience if not managed well.
 *
 * Improvements:
 * - Consider sanitizing HTML content before rendering to avoid potential security risks.
 * - Enhance error handling in case the note does not exist or the database query fails.
 * - Add a loading state or skeleton loader for the note content to improve user experience while the data is being fetched.
 */

import { checkUserPermission } from "@/app/permissions/permission-actions"
import { getCurrentUser } from "@/app/login/auth"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const note = await db.notes.findFirst({
    where: {
      id: parseInt(params.id),
    },
  })
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }
  const perm = await checkUserPermission(currentUser.id, "/help")
  if (perm.hasPermission === false) {
    return notFound()
  }
  return (
    <div className="p-6">
      <Button asChild><Link href={"/tickets/new"}>Back to new ticket</Link></Button>
      <h1 className="text-2xl font-bold mb-4">{note?.title}</h1>

      {/* Safely render HTML */}
      {note?.description ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: note.description }}
        />
      ) : (
        <p className="text-muted-foreground">No description available.</p>
      )}
    </div>
  )
}
