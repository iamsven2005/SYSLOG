import { notFound, redirect } from "next/navigation";
import { checkUserPermission } from "../../permissions/permission-actions";
import { getCurrentUser } from "../../login/actions";
import { FormBuilder } from "../[id]/form-builder"

export default async function CreateFormPage() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        redirect("/login")
      }
      const perm = await checkUserPermission(currentUser.id, "/forms/create")
      if (perm.hasPermission === false) {
        return notFound()
      }
  return (
      <FormBuilder />

  )
}