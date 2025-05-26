/**
 * job-title.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This module handles operations related to job titles in the system, including creating, updating, fetching, and deleting job titles.
 *   It uses Prisma ORM to interact with the database.
 *
 * Key Features:
 *   - `createJobTitle`: Creates a new job title in the database.
 *   - `bulkInsertJobTitles`: Bulk inserts multiple job titles at once.
 *   - `getJobTitles`: Retrieves all job titles from the database, ordered by `sn`.
 *   - `deleteJobTitles`: Deletes job titles based on the provided list of `id`s.
 *
 * Key Functions:
 *   - `createJobTitle`: Creates a new job title record by inserting data into the job titles table.
 *   - `bulkInsertJobTitles`: Bulk inserts an array of job titles to the job titles table.
 *   - `getJobTitles`: Retrieves job titles from the database in ascending order by `sn` (serial number).
 *   - `deleteJobTitles`: Deletes job title records by their `id`s, handling the deletion operation in a safe way.
 *
 * Example Usage:
 *   ```ts
 *   const newTitle = { jobTitle: "Software Engineer", abbreviation: "SE", seniorityLevel: "Mid" };
 *   await createJobTitle(newTitle);
 *   ```
 *   ```ts
 *   const titles = [{ jobTitle: "DevOps Engineer", abbreviation: "DO", seniorityLevel: "Senior" }];
 *   await bulkInsertJobTitles(titles);
 *   ```
 *   ```ts
 *   const allTitles = await getJobTitles();
 *   console.log(allTitles);
 *   ```
 *   ```ts
 *   await deleteJobTitles([1, 2, 3]);
 *   ```
 *
 * Notes:
 *   - The `JobTitle` type is generated from Prisma and includes fields such as `id`, `jobTitle`, `abbreviation`, `seniorityLevel`, etc.
 *   - The `bulkInsertJobTitles` function supports inserting multiple records in a single transaction, making it more efficient for large datasets.
 *   - The `deleteJobTitles` function ensures safe deletion by targeting specific job titles using their `id`s.
 */
"use server"
import { db } from "@/lib/db"
import { JobTitle } from "@/prisma/generated/main"
type NewJobTitle = Omit<JobTitle, "id" | "createdAt" | "updatedAt">

export async function createJobTitle(data: JobTitle) {
  return db.jobTitle.create({ data })
}

export async function bulkInsertJobTitles(titles: NewJobTitle[]) {
  return db.jobTitle.createMany({ data: titles })
}

export async function getJobTitles() {
  return db.jobTitle.findMany({ orderBy: { sn: "asc" } })
}

export async function deleteJobTitles(ids: number[]) {
    try {
      await db.jobTitle.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })
      
      return { success: true }
    } catch (error) {
      console.error("Error deleting job titles:", error)
      throw new Error("Failed to delete job titles")
    }
  }
  