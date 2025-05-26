/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for the `ProjectTypesPage` component. It checks if the user has access to the `/project-types` route 
 *   using the `allowed("/project-types")` function. If the user is authorized, the `ProjectTypesPage` is rendered, allowing the user 
 *   to manage project types. If the user is not authorized, they are redirected to a not-found page.
 *
 * Components:
 *   - `ProjectTypesPage`: Displays the UI for managing project types, including creating, editing, and deleting project types.
 *
 * Behavior:
 *   - The `allowed("/project-types")` function checks if the user has permission to access the `/project-types` route.
 *   - If the user is authorized, the `ProjectTypesPage` component is rendered to manage the project types.
 *   - If the user is not authorized, the page will redirect them to a not-found route.
 */

import { allowed } from "@/components/navbar";
import ProjectTypesPage from "./ProjectTypesPage";
import { notFound } from "next/navigation";
export default async function Page(){
      const a = await allowed("/project-types")
      if(a === false) notFound()
    return(
        <ProjectTypesPage/>
    )
}