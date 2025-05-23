import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "../login/actions"
import { checkUserPermission } from "../permissions/permission-actions"
import DriveExplorer from "./client"

export default async function Page(){
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          redirect("/login")
        }
        const perm = await checkUserPermission(currentUser.id, "/drive")
        if (perm.hasPermission === false) {
          return notFound()
        }
        return(
          <DriveExplorer id={currentUser.id}/>
        )
}