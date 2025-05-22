import { notFound, redirect } from "next/navigation";

import PermissionsTable from "./client";
import { getCurrentUser } from "../login/actions";
import { checkUserPermission } from "./permission-actions";

export default async function CreateFormPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }
  const perm = await checkUserPermission(currentUser.id, "/permissions")
  if (perm.hasPermission === false) {
    return notFound()
  }
  return (
    <PermissionsTable />

  )
}