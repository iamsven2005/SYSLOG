import { FormViewer } from "./form-viewer"
import { getFormById } from "./actions"
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
      <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
      {form.description && <p className="text-muted-foreground mb-8">{form.description}</p>}
      <FormViewer form={form} />
    </div>
  )
}
