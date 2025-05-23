

import { allowed } from "@/components/navbar";
import UsersTable from "./client";
import { notFound } from "next/navigation";

export default async function Notes() {
  const a = await allowed("/users")
  if(a === false) notFound()

  return <UsersTable />
}
