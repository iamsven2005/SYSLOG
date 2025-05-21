import { getSession } from "@/lib/auth";
import NotesTable from "./client";
import { NextResponse } from "next/server";
import { getUserById } from "../email-templates/user-actions";
import { checkUserPermission } from "../permissions/permission-actions";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getSession()

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }


  const currentuser = await getUserById(session.user.id)
  if (!currentuser) {
    throw new Error("User not found")
  }
  const perm = await checkUserPermission(currentuser.id, "/tickets")
  if (perm.hasPermission === false) {
    return notFound()
  }
  const isAdmin = currentuser.role.includes("admin")
  return <NotesTable isAdmin={isAdmin} />
}
