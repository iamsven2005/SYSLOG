import { NextResponse } from "next/server"
import { exec } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"
import { promisify } from "util"

const BACKUP_FOLDER = "/mnt/userdocuments/sven.tan/MyDocs" // NAS location
const FALLBACK_FOLDER = path.join(os.tmpdir(), "database_backups") // Fallback
const execAsync = promisify(exec)

export async function GET() {
  try {
    // Ensure backup folder exists
    const useBackupFolder = fs.existsSync(BACKUP_FOLDER)
    const targetFolder = useBackupFolder ? BACKUP_FOLDER : FALLBACK_FOLDER

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true })
      console.warn("Backup folder not found. Created fallback:", targetFolder)
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `backup-${timestamp}.sql`
    const filePath = path.join(targetFolder, fileName)

    // Construct pg_dump command
    const dumpCommand = `PGPASSFILE=~/.pgpass pg_dump -h 192.168.1.26 -U admin -d logs_database -F c -b -v -f "${filePath}"`

    // Execute and wait
    const { stdout } = await execAsync(dumpCommand)

    console.log("Backup successful:", stdout)
    return NextResponse.json({ success: true, filePath })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Backup failed:", message)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
