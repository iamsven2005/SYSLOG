import { FormBuilder } from "../form-builder"
import { getFormById } from "../actions"
import { notFound } from "next/navigation"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const formId = Number.parseInt(params.id)
  const form = await getFormById(formId)

  if (!form) {
    notFound()
  }

  return (
    <div className="m-5 p-5">
      <h1 className="text-3xl font-bold mb-8">Edit Form</h1>
      <FormBuilder form={{ ...form, description: form.description ?? undefined }} />
    </div>
  )
}
