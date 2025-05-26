/**
 * IdapPage.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page is designed to display a table of LDAP users. It checks if the user has the necessary permissions
 *   to view the LDAP data. If the user is authorized, it renders the `LdapUsersTable` component to show the data.
 *   If the user is not authorized, it triggers a `notFound()` error to deny access to the page.
 *
 * Key Features:
 *   - Checks user authorization using the `allowed` function imported from the navbar component.
 *   - Displays the `LdapUsersTable` component for authorized users to view LDAP user data.
 *   - Redirects unauthorized users to a "not found" state using `notFound()` from the Next.js navigation.
 *
 * Example Usage:
 *   ```tsx
 *   <LdapUsersTable />
 *   ```
 *
 * Notes:
 *   - The `allowed` function is used to verify if the current user has the right permissions to access this page.
 *   - If the permission check fails, the user is redirected to a 404 page.
 *   - The `LdapUsersTable` component displays the LDAP users, allows for search and pagination, and supports exporting the data to Excel.
 */

import { allowed } from "@/components/navbar";
import { LdapUsersTable } from "./LdapUsersTable";
import { notFound } from "next/navigation";
// This page is for upload of books from html file
export default async function IdapPage() {
  const a = await allowed("/idap")
  if(a === false) notFound()
  return (
      <LdapUsersTable/>

  )
}