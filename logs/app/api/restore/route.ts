// Restore logs database from the latest .sql file in a specific folder
import { NextResponse } from "next/server"
import { exec } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"
import { promisify } from "util"

const execPromise = promisify(exec)

const BACKUP_FOLDER = "/mnt/userdocuments/sven.tan/MyDocs"
const FALLBACK_FOLDER = path.join(os.tmpdir(), "database_backups")

function getLatestSQLFile(folder: string): string | null {
  if (!fs.existsSync(folder)) return null

  const files = fs.readdirSync(folder)
    .filter(file => file.endsWith(".sql"))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(folder, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  return files.length > 0 ? path.join(folder, files[0].name) : null
}

export async function POST() {
  try {
    const backupDir = fs.existsSync(BACKUP_FOLDER) ? BACKUP_FOLDER : FALLBACK_FOLDER
    const latestBackup = getLatestSQLFile(backupDir)

    if (!latestBackup) {
      return NextResponse.json({ success: false, message: "No .sql backup file found" }, { status: 404 })
    }

    const dropSchema = `psql -h 192.168.1.26 -U admin -d logs_database -c 'DROP SCHEMA IF EXISTS logs CASCADE;'`
    const restoreCommand = `PGPASSFILE=~/.pgpass pg_restore -h 192.168.1.26 -U admin -d logs_database -v "${latestBackup}"`

    // Drop schema
    await execPromise(dropSchema)
    console.log("Schema dropped successfully")

    // Restore backup
    await execPromise(restoreCommand)
    console.log("Restore successful")

    return NextResponse.json({ success: true, fileRestored: latestBackup })
  } catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error"

  return NextResponse.json(
    {
      success: false,
      message: "Restore process failed",
      details: message,
    },
    { status: 500 }
  )
}

}
