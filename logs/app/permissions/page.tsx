import { allowed } from "@/components/navbar";
import PermissionsTable from "./client";
import { notFound } from "next/navigation";

export default async function CreateFormPage() {
const a = await allowed("/permissions")
if(a === false) notFound()
  return (
    <PermissionsTable />

  )
}