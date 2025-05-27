/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page serves as the container for the `PermissionsTable` component, which manages and displays the page permissions.
 *   It first checks if the user has access to the `/permissions` route using the `allowed("/permissions")` function. If access is denied, 
 *   it redirects the user to a not-found page.
 *
 * Components:
 *   - `PermissionsTable`: Displays the permissions data, allows for creating, editing, and deleting permissions.
 *
 * Behavior:
 *   - The `allowed("/permissions")` function checks if the user has permission to access the `/permissions` route.
 *   - If the user is authorized, the `PermissionsTable` component is rendered, allowing the user to manage permissions.
 *   - If the user is not authorized, the page redirects them to a not-found page.
 */

import { allowed } from "@/components/navbar";
import PermissionsTable from "./PermissionsTable";
import { notFound } from "next/navigation";

export default async function Page() {
const a = await allowed("/permissions")
if(a === false) notFound()
  return (
    <PermissionsTable />

  )
}