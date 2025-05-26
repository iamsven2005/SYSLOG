/**
 * rule-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains server-side functions for managing rule groups, rules, and commands in the system. 
 *   It includes functionality for importing rule groups and rules from Excel, fetching and manipulating rule data, 
 *   and exporting rule data to Excel. These functions handle tasks like creating, updating, deleting, 
 *   and logging activities related to rule groups and rules.
 *   
 * Functions:
 *   - `importRuleGroups`: Imports rule groups, rules, and commands from an Excel file. It handles creating rule groups and rules, 
 *     as well as associating commands with the corresponding rules.
 *   - `prepareRuleGroupsForExport`: Prepares rule groups, rules, and commands for export to Excel.
 *   - `getRuleGroups`: Fetches rule groups with pagination, searching, and associated rules, including their commands and email templates.
 *   - `getRuleGroup`: Fetches a specific rule group by its ID.
 *   - `createRuleGroup`: Creates a new rule group, optionally associating an email template with it.
 *   - `updateRuleGroup`: Updates an existing rule group, including its associated email template.
 *   - `deleteRuleGroup`: Deletes a rule group and all its associated rules and commands.
 *   - `createRule`: Creates a new rule, optionally associating an email template with it, and adding commands to the rule.
 *   - `updateRule`: Updates an existing rule, including its commands and email template.
 *   - `deleteRule`: Deletes a rule and its associated commands.
 *   - `getAllRuleGroupsAndRules`: Retrieves all rule groups and rules for filtering and searching.
 *   - `searchLogsByRuleCommands`: Searches logs based on the commands associated with a set of rules.
 *   - `addCommandToRule`: Adds a command to a specified rule, logging the action.
 *
 * Components:
 *   - `db`: The database instance used to interact with the rule groups, rules, commands, and activity log.
 *   - `revalidatePath`: A Next.js utility used to trigger revalidation of specific paths after data changes.
 *   - `logActivity`: A function to log activities related to rule group and rule management.
 *   
 * Behavior:
 *   - The functions handle the creation, updating, deletion, and retrieval of rule groups, rules, and commands.
 *   - When importing rule groups from an Excel file, the system handles group creation, rule creation, and command assignment. 
 *   - The `prepareRuleGroupsForExport` function prepares the data in a format suitable for Excel export, including all rule group, rule, and command data.
 *   - The `getRuleGroups` function allows for search, pagination, and filtering of rule groups and their associated data.
 *   - Each action is logged via `logActivity`, ensuring traceability of changes made to the rule groups and rules.
 *
 * Notes:
 *   - Error handling and logging are incorporated into each function to ensure that failures are properly captured and reported.
 *   - The `getRuleGroups` function supports a search filter that can be applied to rule group names, rule names, rule descriptions, and commands.
 *   - The `importRuleGroups` function processes Excel data, ensuring that each entry is added correctly and avoids duplication.
 */


"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/activity-logger"

interface GetRuleGroupsParams {
  search?: string
  page?: number
  pageSize?: number
}
// Define the type for the rows of the rule groups
interface RuleGroupRow {
  Type: "Group" | "Rule" | "Command";
  ID: number;
  Name: string;
  Description?: string | null;
  Command?: string;
  GroupID?: number;
  GroupName?: string;
  RuleID?: number;
  RuleName?: string;
}

// Define types for the entities
interface RuleGroup {
  id: number;
  name: string;
  rules: Rule[];
}

interface Rule {
  id: number;
  name: string;
  description: string | null;
  commands: Command[];
}

interface Command {
  id: number;
  command: string;
}

// Function to import rule groups from Excel data
export async function importRuleGroups(data: RuleGroupRow[]) {
  try {
    const groups = new Map<string, number>()
    const rules = new Map<string, number>()

    // First pass: Create groups and rules
    for (const row of data) {
      if (row.Type === "Group") {
        if (!groups.has(row.Name)) {
          const group = await db.ruleGroup.create({
            data: {
              name: row.Name,
            },
          })
          groups.set(row.Name, group.id)

          // Log the activity
          await logActivity({
            actionType: "Imported Rule Group",
            targetType: "RuleGroup",
            targetId: group.id,
            details: `Imported rule group: ${row.Name}`,
          })
        }
      } else if (row.Type === "Rule") {
        let groupId = groups.get(row.GroupName || "")
        if (!groupId && row.GroupName) {
          const group = await db.ruleGroup.create({
            data: {
              name: row.GroupName,
            },
          })
          groupId = group.id
          groups.set(row.GroupName, groupId)

          // Log the activity
          await logActivity({
            actionType: "Imported Rule Group",
            targetType: "RuleGroup",
            targetId: group.id,
            details: `Imported rule group: ${row.GroupName}`,
          })
        }

        if (groupId && !rules.has(row.Name)) {
          const rule = await db.rule.create({
            data: {
              name: row.Name,
              description: row.Description || null,
              groupId: groupId,
            },
          })
          rules.set(row.Name, rule.id)

          // Log the activity
          await logActivity({
            actionType: "Imported Rule",
            targetType: "Rule",
            targetId: rule.id,
            details: `Imported rule: ${row.Name} in group: ${row.GroupName}`,
          })
        }
      }
    }

    // Second pass: Create commands
    for (const row of data) {
      if (row.Type === "Command" && row.Command) {
        const ruleId = rules.get(row.RuleName || "")
        if (ruleId) {
          await db.command.create({
            data: {
              ruleId: ruleId,
              command: row.Command,
            },
          })
        }
      }
    }

    revalidatePath("/logs")
    return { success: true }
  } catch (error) {
    console.error("Error importing rule groups:", error)
    throw new Error("Failed to import rule groups")
  }
}

// Function to prepare rule groups for export
export async function prepareRuleGroupsForExport(ruleGroups: RuleGroup[]) {
  const exportData: RuleGroupRow[] = []

  ruleGroups.forEach((group) => {
    // Add the group as a row
    exportData.push({
      Type: "Group",
      ID: group.id,
      Name: group.name,
      Description: "",
      Command: "",
      GroupName: "",
    })

    group.rules.forEach((rule) => {
      exportData.push({
        Type: "Rule",
        ID: rule.id,
        Name: rule.name,
        Description: rule.description || "",
        Command: "",
        GroupID: group.id,
        GroupName: group.name,
      })

      rule.commands.forEach((cmd) => {
        exportData.push({
          Type: "Command",
          ID: cmd.id,
          Name: "",
          Description: "",
          Command: cmd.command,
          GroupID: group.id,
          GroupName: group.name,
          RuleID: rule.id,
          RuleName: rule.name,
        })
      })
    })
  })

  return exportData
}

// Update the getRuleGroups function to include email templates
export async function getRuleGroups({ search = "", page = 1, pageSize = 10 }: GetRuleGroupsParams) {
  try {
    // Build where conditions
    const where: Record<string, unknown> = {}

    // Add search condition if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        {
          rules: {
            some: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                {
                  commands: {
                    some: {
                      command: { contains: search, mode: "insensitive" },
                    },
                  },
                },
              ],
            },
          },
        },
      ]
    }

    // Get total count for pagination
    const totalCount = await db.ruleGroup.count({ where })

    // Get rule groups with pagination
    const ruleGroups = await db.ruleGroup.findMany({
      where,
      include: {
        rules: {
          include: {
            commands: true,
            emailTemplate: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
        },
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      ruleGroups,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
    }
  } catch (error) {
    console.error("Error fetching rule groups:", error)
    throw new Error("Failed to fetch rule groups")
  }
}

export async function getRuleGroup(id: number) {
  try {
    const ruleGroup = await db.ruleGroup.findUnique({
      where: { id },
      include: {
        rules: {
          include: {
            commands: true,
          },
        },
      },
    })
    return ruleGroup
  } catch (error) {
    console.error("Error fetching rule group:", error)
    throw new Error("Failed to fetch rule group")
  }
}

// Update the createRuleGroup function to include emailTemplateId
interface RuleGroupData {
  name: string
  emailTemplateId?: number | null
}

export async function createRuleGroup(data: RuleGroupData) {
  try {
    const ruleGroup = await db.ruleGroup.create({
      data: {
        name: data.name,
        emailTemplateId: data.emailTemplateId || null,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Created Rule Group",
      targetType: "RuleGroup",
      targetId: ruleGroup.id,
      details: `Created rule group: ${data.name}`,
    })

    revalidatePath("/logs")
    return { success: true, ruleGroup }
  } catch (error) {
    console.error("Error creating rule group:", error)
    throw new Error("Failed to create rule group")
  }
}

// Update the updateRuleGroup function to include emailTemplateId
interface UpdateRuleGroupData extends RuleGroupData {
  id: number
}

export async function updateRuleGroup(data: UpdateRuleGroupData) {
  try {
    const ruleGroup = await db.ruleGroup.update({
      where: { id: data.id },
      data: {
        name: data.name,
        emailTemplateId: data.emailTemplateId,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Updated Rule Group",
      targetType: "RuleGroup",
      targetId: ruleGroup.id,
      details: `Updated rule group: ${data.name}`,
    })

    revalidatePath("/logs")
    return { success: true, ruleGroup }
  } catch (error) {
    console.error("Error updating rule group:", error)
    throw new Error("Failed to update rule group")
  }
}

export async function deleteRuleGroup(id: number) {
  try {
    // Get the rule group name before deletion
    const ruleGroup = await db.ruleGroup.findUnique({
      where: { id },
      select: { name: true },
    })

    // First delete all rules in the group
    await db.rule.deleteMany({
      where: { groupId: id },
    })

    // Then delete the group
    await db.ruleGroup.delete({
      where: { id },
    })

    // Log the activity
    await logActivity({
      actionType: "Deleted Rule Group",
      targetType: "RuleGroup",
      targetId: id,
      details: `Deleted rule group: ${ruleGroup?.name || "Unknown"}`,
    })

    revalidatePath("/logs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting rule group:", error)
    throw new Error("Failed to delete rule group")
  }
}

// Update the RuleData interface to include emailTemplateId
interface RuleData {
  name: string
  description?: string
  groupId: number
  commands: string[]
  emailTemplateId?: number | null
  commandEmailTemplateIds?: Record<number, number | null>
}

// Update the createRule function to include emailTemplateId
export async function createRule(data: RuleData) {
  try {
    const rule = await db.rule.create({
      data: {
        name: data.name,
        description: data.description || null,
        groupId: data.groupId,
        emailTemplateId: data.emailTemplateId || null,
        commands: {
          create: data.commands.map((cmd, index) => ({
            command: cmd,
            emailTemplateId: data.commandEmailTemplateIds?.[index] || null,
          })),
        },
      },
      include: {
        commands: true,
        group: true,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Created Rule",
      targetType: "Rule",
      targetId: rule.id,
      details: `Created rule: ${data.name} in group: ${rule.group?.name || "Unknown"}`,
    })

    revalidatePath("/logs")
    return { success: true, rule }
  } catch (error) {
    console.error("Error creating rule:", error)
    throw new Error("Failed to create rule")
  }
}

// Update the UpdateRuleData interface to include emailTemplateId
interface UpdateRuleData {
  id: number
  name: string
  description?: string
  groupId?: number
  commands?: string[]
  emailTemplateId?: number | null
  commandEmailTemplateIds?: Record<number, number | null>
}

// Update the updateRule function to include emailTemplateId
export async function updateRule(data: UpdateRuleData) {
  try {
    // First update the rule
    const rule = await db.rule.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        groupId: data.groupId,
        emailTemplateId: data.emailTemplateId,
      },
      include: {
        group: true,
      },
    })

    // If commands are provided, update them
    if (data.commands) {
      // Delete existing commands
      await db.command.deleteMany({
        where: { ruleId: data.id },
      })

      // Create new commands
      await Promise.all(
        data.commands.map((cmd, index) =>
          db.command.create({
            data: {
              ruleId: data.id,
              command: cmd,
              emailTemplateId: data.commandEmailTemplateIds?.[index] || null,
            },
          }),
        ),
      )
    }

    // Log the activity
    await logActivity({
      actionType: "Updated Rule",
      targetType: "Rule",
      targetId: rule.id,
      details: `Updated rule: ${data.name} in group: ${rule.group?.name || "Unknown"}`,
    })

    revalidatePath("/logs")
    return { success: true, rule }
  } catch (error) {
    console.error("Error updating rule:", error)
    throw new Error("Failed to update rule")
  }
}

export async function deleteRule(id: number) {
  try {
    // Get the rule details before deletion
    const rule = await db.rule.findUnique({
      where: { id },
      include: {
        group: true,
      },
    })

    // First delete all commands for this rule
    await db.command.deleteMany({
      where: { ruleId: id },
    })

    // Then delete the rule
    await db.rule.delete({
      where: { id },
    })

    // Log the activity
    await logActivity({
      actionType: "Deleted Rule",
      targetType: "Rule",
      targetId: id,
      details: `Deleted rule: ${rule?.name || "Unknown"} from group: ${rule?.group?.name || "Unknown"}`,
    })

    revalidatePath("/logs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting rule:", error)
    throw new Error("Failed to delete rule")
  }
}



// Add a function to get all rule groups and rules for filtering
export async function getAllRuleGroupsAndRules() {
  try {
    const ruleGroups = await db.ruleGroup.findMany({
      include: {
        rules: {
          include: {
            commands: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return ruleGroups
  } catch (error) {
    console.error("Error fetching all rule groups and rules:", error)
    throw new Error("Failed to fetch rule groups and rules")
  }
}

// Add a function to search logs by command patterns from rules
export async function searchLogsByRuleCommands(ruleIds: number[]) {
  try {
    // Get all commands from the specified rules
    const rules = await db.rule.findMany({
      where: {
        id: {
          in: ruleIds,
        },
      },
      include: {
        commands: true,
      },
    })

    // Extract command patterns
    const commandPatterns = rules.flatMap((rule) => rule.commands.map((cmd) => cmd.command))

    return commandPatterns
  } catch (error) {
    console.error("Error searching logs by rule commands:", error)
    throw new Error("Failed to search logs by rule commands")
  }
}

// Add this function to the rule-actions.ts file if it doesn't already exist
// Add this at the end of the file

export async function addCommandToRule(ruleId: number, commandText: string) {
  try {
    // Check if the rule exists
    const rule = await db.rule.findUnique({
      where: { id: ruleId },
      include: { group: true },
    })

    if (!rule) {
      throw new Error("Rule not found")
    }

    // Create the command
    const command = await db.command.create({
      data: {
        ruleId,
        command: commandText,
      },
    })

    // Log the activity
    await logActivity({
      actionType: "Added Command",
      targetType: "Rule",
      targetId: ruleId,
      details: `Added command "${commandText}" to rule "${rule.name}"`,
    })

    revalidatePath("/logs")
    return {
      success: true,
      command,
      message: `Command added to rule "${rule.name}" in group "${rule.group?.name || "Unknown"}"`,
    }
  } catch (error) {
    console.error("Error adding command to rule:", error)
    throw new Error(`Failed to add command to rule: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

