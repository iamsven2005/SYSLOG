/**
 * LdapActions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This file contains functions to interact with LDAP user data stored in a PostgreSQL database using Prisma.
 *   It provides functionality for fetching LDAP users with pagination, searching by various fields, and retrieving LDAP user statistics such as the total number of users, active users, and users who have recently logged in.
 *
 * Key Functions:
 *   - `getLdapUsers`: Fetches a paginated list of LDAP users based on the search term and pagination settings. Supports filtering by fields like `sAMAccountName`, `displayName`, and `userPrincipalName`.
 *   - `getLdapUserById`: Retrieves a single LDAP user by their ID.
 *   - `getLdapUserStats`: Retrieves statistics for LDAP users, including the total number of users, active users, disabled users, and the number of users who have logged in within the last 30 days.
 *
 * Example Usage:
 *   ```ts
 *   const { users, totalCount, totalPages } = await getLdapUsers(1, 30, 'john');
 *   console.log(users); // List of LDAP users
 *   console.log(totalCount); // Total user count
 *   console.log(totalPages); // Total pages for pagination
 *   ```
 *
 * Notes:
 *   - The `getLdapUsers` function supports search conditions on multiple fields using the `Prisma.QueryMode.insensitive` mode for case-insensitive searching.
 *   - The `getLdapUserStats` function calculates user activity by querying `userAccountControl` for active/disabled status and checks for recent logins based on the `lastLogon` timestamp.
 *   - The statistics function also utilizes raw SQL queries for specific conditions (e.g., checking disabled users using bitwise operations on `userAccountControl`).
 */
"use server"

import { db } from "@/lib/db"
import { Prisma } from "@/prisma/generated/main"

// Function to get LDAP users with pagination and search
export async function getLdapUsers(page = 1, pageSize = 30, searchTerm = "") {
  const skip = (page - 1) * pageSize

  // Create search conditions
const searchCondition = searchTerm
  ? {
      OR: [
        { sAMAccountName: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { displayName: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { cn: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { userPrincipalName: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      ],
    }
  : {}


  // Get total count for pagination
  const totalCount = await db.ldapuser.count({
    where: searchCondition,
  })

  // Get users for current page
  const users = await db.ldapuser.findMany({
    where: searchCondition,
    orderBy: { id: "asc" },
    skip,
    take: pageSize,
  })

  return {
    users,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}

// Function to get a single LDAP user by ID
export async function getLdapUserById(id: number) {
  return db.ldapuser.findUnique({
    where: { id },
  })
}

// Function to get LDAP user statistics
export async function getLdapUserStats() {
  const totalUsers = await db.ldapuser.count()

 const [{ count }] = await db.$queryRaw<{ count: number }[]>`
  SELECT COUNT(*) as count
  FROM "ldapuser"
  WHERE "userAccountControl" & 2 = 0
`

const activeUsers = Number(count)

const disabledUsers = await db.$queryRaw`
  SELECT COUNT(*) as count
  FROM "ldapuser"
  WHERE "userAccountControl" & 2 = 2
`

  const recentlyLoggedIn = await db.ldapuser.count({
    where: {
      lastLogon: {
        // Logged in within the last 30 days
        gt: BigInt(Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) * 10000 + 11644473600000 * 10000)),
      },
    },
  })

  return {
    totalUsers,
    activeUsers,
    disabledUsers,
    recentlyLoggedIn,
  }
}

