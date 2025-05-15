import { getTeamById } from "@/app/teams/actions"
import { notFound } from "next/navigation"
import { EditTeamForm } from "../../edit-team-form"
import { db } from "@/lib/db"

interface EditTeamPageProps {
  params: {
    id: string
  }
}

interface TeamUser {
  user: { id: number }
}

interface TeamLocation {
  location: { id: number }
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
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
