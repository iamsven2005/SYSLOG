

import { allowed } from "@/components/navbar";
import { LdapUsersTable } from "./client";
import { notFound } from "next/navigation";
// This page is for upload of books from html file
export default async function IdapPage() {
  const a = await allowed("/idap")
  if(a === false) notFound()
  return (
      <LdapUsersTable/>

  )
}