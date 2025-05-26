/**
 * Notes.tsx - 2025-05-25 by sven.tan
 *
 * The Notes component checks user permissions, verifies the user's role, and conditionally renders the NotesTable component 
 * with admin-specific features.
 * - Uses `allowed` from the navbar component to check if the user is authorized to access the notes page.
 * - Checks if a valid user is logged in, then verifies if the user has an "admin" role.
 * - Renders the `NotesTable` component with the `isAdmin` prop based on the user's role.
 *
 * Functionality:
 * - **Permission Check**: Verifies if the user has access to the notes page using the `allowed` function.
 * - **Admin Role Check**: Verifies if the logged-in user has an "admin" role using the `hasRole` function.
 * - **Conditional Rendering**: Renders the `NotesTable` with additional admin functionalities if the user has the "admin" role.
 * - **404 Handling**: If the user is not authorized or not logged in, the page renders a 404 error using `notFound()`.
 *
 * Usage:
 * - This component serves as a gatekeeper for the notes page, ensuring that only authorized users can access the page.
 * - Admin users are granted additional capabilities, such as managing, creating, and deleting notes.
 *
 * Limitations:
 * - Assumes the existence of helper functions like `allowed`, `getCurrentUser`, and `hasRole` for permission and role checks.
 * - This component performs server-side checks to ensure only authorized users can access sensitive information.
 * - The check for user authorization might result in a performance hit if the logic is overly complex or performs multiple database calls.
 *
 * Improvements:
 * - Introduce a loading state or skeleton screen to handle the delay from asynchronous calls when the page is fetching the user's permissions and role.
 * - Enhance the user experience by providing clearer feedback (e.g., redirecting unauthorized users to a login page).
 */

import NotesTable from "./NotesTable";
import { notFound } from "next/navigation";
import { getCurrentUser, hasRole } from "../login/auth";
import { allowed } from "@/components/navbar";

export default async function Notes() {
  const a = await allowed("/notes")
  const user = await getCurrentUser()
    if(a === false || !user) notFound()

  const isAdmin = await hasRole(user, ["admin"])
  return <NotesTable isAdmin={isAdmin} />
}
