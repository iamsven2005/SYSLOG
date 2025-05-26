/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This layout component manages access control for the job titles page. It checks if the current user is allowed
 *   to view the page and then renders the `JobTitlesPage` component.
 *
 * Key Features:
 *   - Verifies user access using the `allowed` function.
 *   - If access is denied, it triggers a `notFound` response to display a 404 error.
 *   - If access is granted, it renders the `JobTitlesPage` component to display the job titles management interface.
 *
 * Key Functions:
 *   - `allowed`: Checks whether the user has the required permissions to access the job titles page.
 *   - `notFound`: Redirects the user to a "Not Found" page if they are not authorized.
 *
 * Example Usage:
 *   ```tsx
 *   <JobTitlesLayout />
 *   ```
 *   This component will either render the `JobTitlesPage` or redirect the user based on access permissions.
 */

import type React from "react"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"
import JobTitlesPage from "./JobTitlesPage"



export default async function JobTitlesLayout() {
    const a = await allowed("/job-titles")
    if(a === false) notFound()
  return <JobTitlesPage/>
}
