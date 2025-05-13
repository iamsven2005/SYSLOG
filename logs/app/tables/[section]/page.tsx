import { checkUserPermission } from "@/app/permissions/permission-actions"
import { getCurrentUser } from "@/app/login/actions"
import { notFound, redirect } from "next/navigation"
import DevicesTable from "../devices-table"
import UsersTable from "../../users/users-table"
import LocationsTable from "../locations-table"
import ActivityLogsTable from "../../activity/page"
import AuthLogsTable from "../../auth/page"
import EmailTemplateTable from "../../email-templates/page"
import LogsTable from "../../logs/page"
import NotesTable from "../notes-table"
import PermissionsTable from "../../permissions/page"
import RulesTable from "../../rules/page"
import UsersRolesTable from "../../roles/page"


export default async function HelpSectionPage({ params }: { params: { section: string } }) {

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }

  const perm = await checkUserPermission(currentUser.id, `/tables/${params.section}`)
  if (!perm.hasPermission) {
    return notFound()
  }

  switch (params.section) {
    case "devices":
      return (<DevicesTable />)
    case "users":
      return (<UsersTable />)
    case "locations":
      return (<LocationsTable />)
    case "activity":
      return (<ActivityLogsTable />)
    case "auth":
      return (<AuthLogsTable />)
    case "emails":
      return (<EmailTemplateTable />)
    case "logs":
      return (<LogsTable/>)
    case "notes":
      return (<NotesTable/>)
    case "permissions":
      return (<PermissionsTable/>)
    case "rules":
      return (<RulesTable/>)
    case "roles":
      return (<UsersRolesTable/>)
    default:
      return notFound()
  }
}
