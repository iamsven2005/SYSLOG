
import { notFound, redirect } from "next/navigation";
import { checkUserPermission } from "../permissions/permission-actions";
import { getCurrentUser } from "../login/actions";
import { LdapUsersTable } from "./client";
// This page is for upload of books from html file
export default async function IdapPage() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        redirect("/login")
      }
      const perm = await checkUserPermission(currentUser.id, "/idap")
      if (perm.hasPermission === false) {
        return notFound()
      }
  return (
      <LdapUsersTable/>

  )
}