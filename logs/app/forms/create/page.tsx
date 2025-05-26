
import { allowed } from "@/components/navbar"
import { FormBuilder } from "../[id]/form-builder"
import { notFound } from "next/navigation"

export default async function CreateFormPage() {
  const a = await allowed("/forms/create")
  if(a === false) notFound()
  return (
      <FormBuilder />

  )
}