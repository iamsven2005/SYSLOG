
/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page component handles access control for the Projects page. It checks whether the current user is authorized to view the page.
 *   If the user is not authorized, it triggers a "not found" response. If authorized, it renders the `ProjectsPage` component.
 *
 * Components:
 *   - `allowed`: A function that checks if the current user has permission to access the specified page.
 *   - `ProjectsPage`: The page component that displays the list of projects.
 *   - `notFound`: A Next.js utility that renders a "not found" page if access is denied.
 *
 * Behavior:
 *   - The component first calls the `allowed` function with the `/projects` path to check if the current user is authorized.
 *   - If the user is not authorized (i.e., `allowed` returns `false`), the `notFound` function is called to render a "not found" page.
 *   - If the user is authorized, the `ProjectsPage` component is rendered, displaying the projects list.
 *
 * Notes:
 *   - The `allowed` function must be properly implemented in the `@/components/navbar` module to determine access rights.
 *   - This page is likely part of a larger authorization system that controls user access to different pages based on their roles or permissions.
 */

import { allowed } from "@/components/navbar";
import ProjectsPage from "./ProjectsPage";
import { notFound } from "next/navigation";

export default async function Page(){
    const a = await allowed("/projects")
    if(a === false) notFound()
    return(
        <ProjectsPage/>
    )
}