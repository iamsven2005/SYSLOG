import NotesTable from "./client";
import { notFound } from "next/navigation";
import { getCurrentUser, hasRole } from "../login/actions";
import { allowed } from "@/components/navbar";

export default async function Notes() {
  const a = await allowed("/notes")
  const user = await getCurrentUser()
    if(a === false || !user) notFound()

  const isAdmin = await hasRole(user, ["admin"])
  return <NotesTable isAdmin={isAdmin} />
}
