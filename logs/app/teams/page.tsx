/**
 * page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page allows the user to add a new team and view the existing teams. It fetches data for users and locations from the database 
 *   and renders the `AddTeamForm` to create a new team. It also includes a table to display the list of teams.
 *   The page checks the user's access permission before rendering. If permission is denied, it navigates to a "not found" page.
 *
 * Components:
 *   - `AddTeamForm`: Form for adding a new team.
 *   - `TeamsTable`: Table displaying the list of existing teams.
 *   - `allowed`: Used to check user permissions.
 *   - `notFound`: Used to navigate to a "not found" page if access is not allowed.
 * 
 * Behavior:
 *   - Fetches the list of users and locations to populate the team creation form.
 *   - If the user is authorized, it renders the `AddTeamForm` and `TeamsTable`. 
 *   - If not authorized, it navigates to the "not found" page.
 *
 * Notes:
 *   - This page relies on `db.user.findMany()` and `db.location.findMany()` to get the necessary data.
 *   - Access control is enforced by checking the user's permissions using `allowed("/rules")`.
 */

import { db } from "@/lib/db"
import { AddTeamForm } from "./AddTeamForm"
import TeamsTable from "./TeamsTable"
import { allowed } from "@/components/navbar";
import { notFound } from "next/navigation";

export default async function AddTeamPage() {
  const users = await db.user.findMany()
  const locations = await db.location.findMany()
      const a = await allowed("/teams")
    if(a === false) notFound()
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Team</h1>
      <AddTeamForm users={users} locations={locations} />
      <TeamsTable />

    </div>
  )
}