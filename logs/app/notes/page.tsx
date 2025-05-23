import NotesTable from "./client";
import { checkUserPermission } from "../permissions/permission-actions";
import { notFound } from "next/navigation";
import { getCurrentUser } from "../login/actions";

export default async function Notes() {
    const user = await getCurrentUser()
    if(!user) notFound()
  const perm = await checkUserPermission(user.id, "/tickets")
  if (perm.hasPermission === false) {
    return notFound()
  }
  const isAdmin = user.role.includes("admin")
  return <NotesTable isAdmin={isAdmin} />
}
