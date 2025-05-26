/**
 * Notes Component
 * 
 * This component is responsible for rendering the `UsersTable` component, which displays the list of users.
 * It checks if the current user is authorized to access the `/users` page using the `allowed` function.
 * If the user is not authorized, it redirects to a 404 page using `notFound`.
 * 
 * Dependencies:
 * - `allowed` from `@/components/navbar`: A function that checks if the current user has permission to access the page.
 * - `UsersTable`: A component that displays the list of users.
 * - `notFound` from `next/navigation`: A function that triggers a 404 page if the user is not authorized.
 * 
 * Logic:
 * - The component first checks if the user is allowed to access the `/users` page.
 * - If the user is not authorized, the page will return a 404 error using `notFound()`.
 * - If the user is authorized, it renders the `UsersTable` component.
 */

import { allowed } from "@/components/navbar";
import UsersTable from "./client";
import { notFound } from "next/navigation";

export default async function Notes() {
  const a = await allowed("/users")
  if(a === false) notFound()

  return <UsersTable />
}
