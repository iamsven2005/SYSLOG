import { promisify } from "util"
import { exec } from "child_process"

const execPromise = promisify(exec)

export async function pingDevice(ipAddress: string): Promise<boolean> {
  try {
    const pingCommand =
      process.platform === "win32"
        ? `ping -n 1 -w 1000 ${ipAddress}`
        : `ping -c 1 -W 1 ${ipAddress}`

    await execPromise(pingCommand)
    return true
  } catch {
    return false
  }
}
