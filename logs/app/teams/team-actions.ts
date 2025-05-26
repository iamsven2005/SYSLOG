/**
 * team-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains server-side functions for managing teams in the database. It includes functions for:
 *   - Retrieving all teams and their related data (leaders, members, locations).
 *   - Creating, updating, and deleting teams.
 *   - Importing rule groups, rules, and commands from Excel data.
 *   - Handling email templates for rule groups and rules.
 *
 * Components:
 *   - `db`: Prisma database client used for interacting with the database.
 *   - `revalidatePath`: A function to trigger page revalidation in Next.js.
 *   - `z`: Zod library for schema validation.
 *   - `logActivity`: Logs activities related to creating, updating, and deleting teams.
 *
 * Functions:
 *   - `getTeams`: Fetches all teams with their related leaders, members, and locations.
 *   - `deleteTeam`: Deletes a team from the database.
 *   - `createTeam`: Creates a new team and saves it to the database, along with its related leaders, members, and locations.
 *   - `getTeamById`: Fetches a single team by its ID, including its relationships with leaders, members, and locations.
 *   - `updateTeam`: Updates an existing team and its related leaders, members, and locations.
 *   - `importRuleGroups`: Imports rule groups, rules, and commands from Excel data.
 *   - `prepareRuleGroupsForExport`: Prepares rule groups and their associated data for export to Excel.
 *   - `getRuleGroups`: Retrieves rule groups with optional search and pagination.
 *   - `getRuleGroup`: Fetches a single rule group by ID.
 *   - `createRuleGroup`: Creates a new rule group.
 *   - `updateRuleGroup`: Updates an existing rule group.
 *   - `deleteRuleGroup`: Deletes a rule group and its associated rules and commands.
 *   - `createRule`: Creates a new rule.
 *   - `updateRule`: Updates an existing rule.
 *   - `deleteRule`: Deletes a rule.
 *   - `addCommandToRule`: Adds a command to a rule.
 *
 * Notes:
 *   - Each function includes error handling to ensure appropriate actions are taken when something goes wrong.
 *   - Functions related to team data (create, update, delete) ensure that relationships with leaders, members, and locations are handled appropriately.
 *   - Activity logging is integrated to track the creation, update, and deletion of teams, rules, and rule groups.
 */

"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Get all teams with their relationships
export async function getTeams() {
  try {
    const teams = await db.team.findMany({
      include: {
        leaders: {
          include: {
            user: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
      },
      orderBy: {
        sequence: "asc",
      },
    })

    const users = await db.user.findMany({
      orderBy: {
        username: "asc",
      },
    })

    const locations = await db.location.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return { teams, users, locations }
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("Failed to fetch teams")
  }
}

// Delete a team
export async function deleteTeam(teamId: number) {
  try {
    await db.team.delete({
      where: {
        id: teamId,
      },
    })

    revalidatePath("/teams")
    return { success: true }
  } catch (error) {
    console.error("Error deleting team:", error)
    throw new Error("Failed to delete team")
  }
}

// Define the form schema
const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  sequence: z.coerce.number().int().positive("Sequence must be a positive number"),
  remarks: z.string().optional(),
  description: z.string().optional(),
  leaders: z.array(z.string()).min(1, "At least one leader is required"),
  members: z.array(z.string()),
  locations: z.array(z.string()).min(1, "At least one location is required"),
})

type TeamFormData = z.infer<typeof teamSchema>

export async function createTeam(formData: TeamFormData) {
  try {
    // Validate the form data
    const validatedData = teamSchema.parse(formData)

    // Create the team
    const team = await db.team.create({
      data: {
        name: validatedData.name,
        sequence: validatedData.sequence,
        remarks: validatedData.remarks || "",
        description: validatedData.description || null,
      },
    })

    // Create team leaders
    if (validatedData.leaders.length > 0) {
      await Promise.all(
        validatedData.leaders.map((leaderId) =>
          db.teamLeader.create({
            data: {
              teamId: team.id,
              userId: Number.parseInt(leaderId),
            },
          }),
        ),
      )
    }

    // Create team members
    if (validatedData.members.length > 0) {
      await Promise.all(
        validatedData.members.map((memberId) =>
          db.teamMember.create({
            data: {
              teamId: team.id,
              userId: Number.parseInt(memberId),
            },
          }),
        ),
      )
    }

    // Create team locations
    if (validatedData.locations.length > 0) {
      await Promise.all(
        validatedData.locations.map((locationId) =>
          db.teamLocation.create({
            data: {
              teamId: team.id,
              locationId: Number.parseInt(locationId),
            },
          }),
        ),
      )
    }

    // Revalidate the teams page
    revalidatePath("/teams")

    return { success: true }
  } catch (error) {
    console.error("Error creating team:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to create team",
    }
  }
}

// Get a single team by ID
export async function getTeamById(teamId: number) {
  try {
    const team = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        leaders: {
          include: {
            user: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
      },
    })

    if (!team) {
      throw new Error("Team not found")
    }

    return { team }
  } catch (error) {
    console.error("Error fetching team:", error)
    throw new Error("Failed to fetch team")
  }
}

// Update a team
export async function updateTeam(teamId: number, formData: TeamFormData) {
  try {
    // Validate the form data
    const validatedData = teamSchema.parse(formData)

    // Update the team
    await db.team.update({
      where: {
        id: teamId,
      },
      data: {
        name: validatedData.name,
        sequence: validatedData.sequence,
        remarks: validatedData.remarks || "",
        description: validatedData.description || null,
      },
    })

    // Delete existing relationships
    await db.teamLeader.deleteMany({
      where: {
        teamId: teamId,
      },
    })

    await db.teamMember.deleteMany({
      where: {
        teamId: teamId,
      },
    })

    await db.teamLocation.deleteMany({
      where: {
        teamId: teamId,
      },
    })

    // Create new team leaders
    if (validatedData.leaders.length > 0) {
      await Promise.all(
        validatedData.leaders.map((leaderId) =>
          db.teamLeader.create({
            data: {
              teamId: teamId,
              userId: Number.parseInt(leaderId),
            },
          }),
        ),
      )
    }

    // Create new team members
    if (validatedData.members.length > 0) {
      await Promise.all(
        validatedData.members.map((memberId) =>
          db.teamMember.create({
            data: {
              teamId: teamId,
              userId: Number.parseInt(memberId),
            },
          }),
        ),
      )
    }

    // Create new team locations
    if (validatedData.locations.length > 0) {
      await Promise.all(
        validatedData.locations.map((locationId) =>
          db.teamLocation.create({
            data: {
              teamId: teamId,
              locationId: Number.parseInt(locationId),
            },
          }),
        ),
      )
    }

    // Revalidate the teams page
    revalidatePath("/teams")

    return { success: true }
  } catch (error) {
    console.error("Error updating team:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to update team",
    }
  }
}
