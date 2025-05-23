
import { notFound } from "next/navigation";
import LogsPage from "./client";
import { allowed} from "@/components/navbar";

export default async function CreateFormPage() {
 const a  = await allowed("/admin")
  if(a === false) notFound()
  return (
      <  LogsPage/>

  )
}