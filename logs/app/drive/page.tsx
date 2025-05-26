/*
 * app/drive/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This is the main server component for the Drive module. It handles access control and renders the `DriveExplorer` client component
 *   if the current user is authenticated and authorized to access the `/drive` route.
 *
 * Key Responsibilities:
 *   - Verifies if the current user has permission to access `/drive` using the `allowed()` function.
 *   - Retrieves the authenticated user's ID via `getId()`.
 *   - If access is denied or the user is not logged in, it calls `notFound()` to render a 404 page.
 *   - Otherwise, it renders the `DriveExplorer` component with the current user's ID.
 *
 * Security:
 *   - Ensures the page cannot be accessed anonymously or by unauthorized users.
 *
 * Returns:
 *   - A rendered `<DriveExplorer />` component for authorized users
 *   - A 404 Not Found page for unauthorized or unauthenticated access attempts
 */

import { allowed } from "@/components/navbar"
import DriveExplorer from "./client"
import { notFound } from "next/navigation"
import { getId } from "../login/auth"

export default async function Page(){
const a = await allowed("/drive")
const id = await getId()
if(a === false || !id) notFound()

        return(
          <DriveExplorer id={id}/>
        )
}