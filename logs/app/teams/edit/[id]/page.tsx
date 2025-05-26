/**
 * Page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page component handles the editing of a team. It retrieves the team data by ID and formats it for use in the `EditTeamForm` component.
 *   It also fetches the list of users and locations available for the team, and passes these as props to the form for editing.
 *   The page ensures that if the team ID is invalid or not found, the user is redirected to a "not found" page.
 *
 * Components:
 *   - `getTeamById`: A function that fetches the team data by its ID.
 *   - `db.user.findMany`: Retrieves all users from the database.
 *   - `db.location.findMany`: Retrieves all locations from the database.
 *   - `EditTeamForm`: A form component that allows editing team details such as leaders, members, and locations.
 *   - `notFound`: A Next.js utility that renders a "not found" page if the team is not found or the ID is invalid.
 *
 * Props:
 *   - `params`: The URL parameters, containing the team ID.
 *
 * Behavior:
 *   - The component retrieves the team ID from the URL parameters and ensures it is a valid number.
 *   - If the team ID is invalid (i.e., NaN), the user is redirected to a "not found" page.
 *   - The component then fetches the team data from the database, along with the list of users and locations.
 *   - The fetched data is formatted to ensure that the IDs of leaders, members, and locations are represented as strings for the form.
 *   - Finally, the `EditTeamForm` component is rendered with the formatted team data, users, and locations as props.
 *
 * Notes:
 *   - This component ensures that only valid teams can be edited by checking the team ID and returning a "not found" page if necessary.
 *   - The `formattedTeam` object prepares the team data to be in a format that the form expects, converting the IDs of related entities to strings.
 */

import { getTeamById } from "@/app/teams/team-actions"
import { notFound } from "next/navigation"
import { EditTeamForm } from "../../EditTeamForm"
import { db } from "@/lib/db"



interface TeamUser {
  user: { id: number }
}

interface TeamLocation {
  location: { id: number }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
    const teamId = Number.parseInt(params.id)

  if (isNaN(teamId)) {
    notFound()
  }

  const { team } = await getTeamById(teamId)
  const users = await db.user.findMany()
  const locations = await db.location.findMany()

  const formattedTeam = {
    ...team,
    leaders: (team.leaders as TeamUser[]).map((leader) => leader.user.id.toString()),
    members: (team.members as TeamUser[]).map((member) => member.user.id.toString()),
    locations: (team.locations as TeamLocation[]).map((loc) => loc.location.id.toString()),
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Team</h1>
      <EditTeamForm team={formattedTeam} users={users} locations={locations} />
    </div>
  )
}
