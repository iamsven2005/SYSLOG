/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page component handles access control for the Users and Roles page. It checks whether the current user is authorized to view the page.
 *   If the user is not authorized, it triggers a "not found" response. If authorized, it renders the `UsersRolesTable` component to display and manage roles and users.
 *
 * Components:
 *   - `allowed`: A function that checks if the current user has permission to access the specified page.
 *   - `UsersRolesTable`: A component that displays roles, allows role management (add, edit, delete), and shows users associated with each role.
 *   - `notFound`: A Next.js utility that renders a "not found" page if access is denied.
 *
 * Behavior:
 *   - The component first calls the `allowed` function with the `/roles` path to check if the current user is authorized.
 *   - If the user is not authorized (i.e., `allowed` returns `false`), the `notFound` function is called to render a "not found" page.
 *   - If the user is authorized, the `UsersRolesTable` component is rendered, displaying the roles and users list.
 *
 * Notes:
 *   - The `allowed` function must be properly implemented in the `@/components/navbar` module to determine access rights.
 *   - This page is part of a larger authorization system that controls user access to different pages based on roles or permissions.
 */


import { allowed } from "@/components/navbar";
import { notFound } from "next/navigation";
import UsersRolesTable from "./UsersRolesTable";

export default async function Page(){
    const a = await allowed("/roles")
    if(a === false) notFound()
    return(
        <UsersRolesTable/>
    )
}