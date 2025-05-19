import { devices, ldapuser, logs, User } from "@/prisma/generated/main"
import * as XLSX from "xlsx"

// Function to export data to Excel
export function exportToExcel<T extends object>(data: T[], filename: string) {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// Function to prepare logs data for export
export function prepareLogsForExport(logs: logs[]) {
  return logs.map((log) => {
    // Create a flattened version of the log for Excel
    return {
      ID: log.id,
      Name: log.name,
      Host: log.host || "",
      Timestamp: new Date(log.timestamp).toLocaleString(),
      User: log.piuser || "",
      PID: log.pid || "",
      Action: log.action || "",
      "CPU %": log.cpu !== null ? `${log.cpu.toFixed(1)}%` : "",
      "Memory %": log.mem !== null ? `${log.mem.toFixed(1)}%` : "",
      Command: log.command || "",
    }
  })
}

type AuthLog = {
  id: number
  timestamp: Date
  username: string
  log_entry: string
}

export function prepareAuthLogsForExport(logs: AuthLog[]) {
  return logs.map((log) => {
    return {
      ID: log.id,
      Timestamp: new Date(log.timestamp).toLocaleString(),
      Username: log.username,
      "Log Entry": log.log_entry,
    }
  })
}
// Function to prepare devices data for export
export function prepareDevicesForExport(devices: devices[]) {
  return devices.map((device) => {
    return {
      ID: device.id,
      Name: device.name,
      "IP Address": device.ip_address || "",
      "MAC Address": device.mac_address || "",
      Added: new Date(device.time).toLocaleString(),
      Notes: device.notes || "",
    }
  })
}

// Function to prepare users data for export
type ExportableUser = User & {
  devices?: devices[]
}
export function prepareUsersForExport(users: ExportableUser[]) {
  return users.map((user) => {
    return {
      ID: user.id,
      Username: user.username,
      Email: user.email || "",
      "Created At": new Date(user.createdAt).toLocaleString(),
      "Updated At": new Date(user.updatedAt).toLocaleString(),
      "Device Count": user.devices?.length || 0,
    }
  })
}

export function prepareChartDataForExport(
  data: Record<string, unknown>[],
  type: "usage" | "memory" | "sensor" | "disk"
): Record<string, unknown>[] {
  if (!data || data.length === 0) return []

  const exportData: Record<string, unknown>[] = []

  data.forEach((entryRaw) => {
    const entry = entryRaw as Record<string, unknown>
    const timestamp = new Date(entry.timestamp as string).toLocaleString()
    const row: Record<string, unknown> = { timestamp }

    Object.keys(entry).forEach((key) => {
      if (key !== "timestamp") {
        const value = entry[key]

        if (type === "usage") {
          const [host, metric] = key.split(".")
          row[`${host}_${metric}`] = value
        } else if (type === "memory" && typeof value === "object" && value !== null) {
          Object.entries(value as Record<string, unknown>).forEach(([memKey, memVal]) => {
            row[`${key}_${memKey}`] = memVal
          })
        } else if (type === "sensor" && typeof value === "object" && value !== null) {
          const sensor = value as {
            value?: unknown
            type?: unknown
            host?: unknown
          }
          row[`${key}_value`] = sensor.value
          row[`${key}_type`] = sensor.type
          row[`${key}_host`] = sensor.host
        } else if (type === "disk" && key.includes("|")) {
          const [host, diskName] = key.split("|")
          if (typeof value === "number") {
            row[`${host}_${diskName}`] = value
          } else if (typeof value === "object" && value !== null) {
            const disk = value as {
              totalgb?: unknown
              usedgb?: unknown
              freegb?: unknown
              usedPercent?: unknown
            }
            row[`${host}_${diskName}_total`] = disk.totalgb
            row[`${host}_${diskName}_used`] = disk.usedgb
            row[`${host}_${diskName}_free`] = disk.freegb
            row[`${host}_${diskName}_percent`] = disk.usedPercent
          }
        }
      }
    })

    exportData.push(row)
  })

  return exportData
}


// Add a function to prepare devices for import
export function validateImportedDevices(data: devices[]) {
  const validDevices = []
  const errors = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNumber = i + 2 // +2 because Excel starts at 1 and we have a header row

    // Extract device data from row
    const device = {
      name: row.name || "",
      ip_address: row.ip_address || null,
      mac_address: row.mac_address || null,
      password: row.password || null,
      notes: row.notes || "",
    }

    // Validate required fields
    if (!device.name) {
      errors.push(`Row ${rowNumber}: Device name is required`)
      continue
    }

    // Validate IP address format if provided
    if (device.ip_address && !isValidIpAddress(device.ip_address)) {
      errors.push(`Row ${rowNumber}: Invalid IP address format`)
      continue
    }

    // Validate MAC address format if provided
    if (device.mac_address && !isValidMacAddress(device.mac_address)) {
      errors.push(`Row ${rowNumber}: Invalid MAC address format`)
      continue
    }

    validDevices.push(device)
  }

  return { validDevices, errors }
}

// Helper function to validate IP address format
function isValidIpAddress(ip: string) {
  // Simple regex for IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipv4Regex.test(ip)) return false

  // Check each octet is in range 0-255
  const octets = ip.split(".")
  return octets.every((octet) => {
    const num = Number.parseInt(octet, 10)
    return num >= 0 && num <= 255
  })
}

// Helper function to validate MAC address format
function isValidMacAddress(mac: string) {
  // Regex for common MAC address formats (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  return macRegex.test(mac)
}

// Add a template generator function for device imports
export function generateDeviceImportTemplate() {
  const template = [
    {
      Name: "Example Device 1",
      "IP Address": "192.168.1.100",
      "MAC Address": "00:1A:2B:3C:4D:5E",
      Password: "password123",
      Notes: "Example device for import",
    },
    {
      Name: "Example Device 2",
      "IP Address": "192.168.1.101",
      "MAC Address": "00:1A:2B:3C:4D:5F",
      Password: "",
      Notes: "Another example device",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Devices")

  // Generate Excel file
  XLSX.writeFile(workbook, "device-import-template.xlsx")
}

// Add a template generator function for user imports
export function generateUserImportTemplate() {
  const template = [
    {
      Username: "example_user1",
      Email: "user1@example.com",
      Password: "password123",
    },
    {
      Username: "example_user2",
      Email: "user2@example.com",
      Password: "securepass456",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

  // Generate Excel file
  XLSX.writeFile(workbook, "user-import-template.xlsx")
}

export function prepareLdapUsersForExport(users: ldapuser[]) {
  return users.map((user) => {
    // Convert Windows FileTime to JavaScript Date if needed
    const lastLogon = user.lastLogon
      ? new Date(Number(user.lastLogon) / 10000 - 11644473600000).toLocaleString()
      : "Never"
    const whenCreated = user.whenCreated
      ? new Date(Number(user.whenCreated) / 10000 - 11644473600000).toLocaleString()
      : "Unknown"
    const pwdLastSet = user.pwdLastSet
      ? new Date(Number(user.pwdLastSet) / 10000 - 11644473600000).toLocaleString()
      : "Unknown"

    // Determine account status
    let accountStatus = "Active"
    if (user.userAccountControl & 0x0002) accountStatus = "Disabled"
    else if (user.userAccountControl & 0x0010) accountStatus = "Locked Out"
    else if (user.userAccountControl & 0x800000) accountStatus = "Password Expired"

    return {
      ID: user.id,
      Username: user.sAMAccountName || "",
      "Display Name": user.displayName || user.cn || "",
      "Common Name": user.cn || "",
      "Given Name": user.givenName || "",
      Surname: user.sn || "",
      Email: user.userPrincipalName || "",
      Description: user.description || "",
      "Account Status": accountStatus,
      "Last Logon": lastLogon,
      "Created Date": whenCreated,
      "Password Last Set": pwdLastSet,
      "Logon Count": user.logonCount || 0,
      "Bad Password Count": user.badPwdCount || 0,
      "Distinguished Name": user.distinguishedName || "",
      "Member Of": user.memberOf || "",
    }
  })
}
