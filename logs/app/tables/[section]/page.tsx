import { checkUserPermission } from "@/app/actions/permission-actions"
import { getCurrentUser } from "@/app/login/actions"
import { notFound, redirect } from "next/navigation"
import DevicesTable from "../devices-table"
import UsersTable from "../users-table"
import LocationsTable from "../locations-table"
import ActivityLogsTable from "../activity-logs-table"
import AuthLogsTable from "../auth-logs-table"
import EmailTemplateTable from "../email-template-table"
import LogsTable from "../logs-table"
import NotesTable from "../notes-table"
import PermissionsTable from "../permissions-table"
import RulesTable from "../rules-table"
import UsersRolesTable from "../user-roles"


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
