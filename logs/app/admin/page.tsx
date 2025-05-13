import { DatabaseStatusBar } from "@/components/database-status-bar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, RefreshCcw } from "lucide-react"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import UsageChart from "./usage-chart"
import MemoryUsageChart from "./memory-usage-chart"
import SensorChart from "./sensor-chart"
import DiskUsageChart from "./disk-usage-chart"

export default function LogsPage({ userId }: any) {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [activeTab, setActiveTab] = useState("system-logs")
  async function sendEmail() {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "sven.tan@int.ywlgroup.com",
        subject: "Hello from Next.js!",
        text: "This is a plain text email.",
        html: "<p>This is an <b>HTML</b> email.</p>",
      }),
    })

    const data = await response.json()
    if (data.success) {
      alert("Email sent successfully!")
    } else {
      alert("Failed to send email: " + data.error)
    }
  }

  const handleBackupDatabase = async (dbType = "both") => {
    setIsBackingUp(true)

    try {
      if (dbType === "both") {
        // Call both endpoints sequentially
        const mainResponse = await fetch("/api/backup", { method: "POST" })
        const mainData = await mainResponse.json()

        if (!mainResponse.ok) throw new Error(mainData.message || "Main database backup failed")

        const vectorResponse = await fetch("/api/backup2", { method: "POST" })
        const vectorData = await vectorResponse.json()

        if (!vectorResponse.ok) throw new Error(vectorData.message || "Vector database backup failed")

        toast.success("All databases backup successful!", {
          description: "Main and vector databases backed up successfully.",
        })

        // Handle downloads if available
        if (mainData.downloadUrl) {
          const link = document.createElement("a")
          link.href = mainData.downloadUrl
          link.download = mainData.fileName || "main_database_backup.sql"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        if (vectorData.downloadUrl) {
          const link = document.createElement("a")
          link.href = vectorData.downloadUrl
          link.download = vectorData.fileName || "vector_database_backup.sql"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // Original logic for single database backup
        const endpoint = dbType === "main" ? "/api/backup" : "/api/backup2"
        const response = await fetch(endpoint, { method: "POST" })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || "Backup failed")

        toast.success(`${dbType === "main" ? "Main database" : "Vector database"} backup successful!`, {
          description: data.filePath ? `Saved to: ${data.filePath}` : "Download available.",
        })

        // If backup is available for download, trigger a file download
        if (data.downloadUrl) {
          const link = document.createElement("a")
          link.href = data.downloadUrl
          link.download = data.fileName || `${dbType}_database_backup.sql`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    } catch (error: any) {
      console.error("Backup error:", error)
      toast.error(
        `${dbType === "both" ? "All databases" : dbType === "main" ? "Main database" : "Vector database"} backup failed.`,
        {
          description: error.message,
        },
      )
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestoreDatabase = async (dbType = "both") => {
    setIsRestoring(true)
    try {
      if (dbType === "both") {
        // Call both restore endpoints sequentially
        const mainResponse = await fetch("/api/restore", { method: "POST" })
        const mainData = await mainResponse.json()

        if (!mainResponse.ok) throw new Error(mainData.message || "Main database restore failed")

        const vectorResponse = await fetch("/api/restore2", { method: "POST" })
        const vectorData = await vectorResponse.json()

        if (!vectorResponse.ok) throw new Error(vectorData.message || "Vector database restore failed")

        toast.success("All databases restored successfully!", {
          description: `Main DB: ${mainData.latestBackup}, Vector DB: ${vectorData.latestBackup}`,
        })
      } else {
        // Original logic for single database restore
        const endpoint = dbType === "main" ? "/api/restore" : "/api/restore2"
        const response = await fetch(endpoint, { method: "POST" })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || "Restore failed")

        toast.success(`${dbType === "main" ? "Main database" : "Vector database"} restored!`, {
          description: `Restored from: ${data.latestBackup}`,
        })
      }
    } catch (error: any) {
      console.error("Restore error:", error)
      toast.error(
        `${dbType === "both" ? "All databases" : dbType === "main" ? "Main database" : "Vector database"} restore failed.`,
        {
          description: error.message,
        },
      )
    } finally {
      setIsRestoring(false)
    }
  }
  const handleRefreshData = () => {
    // Refresh data logic here
    toast.success("Refreshing data...")
    window.location.reload()
  }
  return (
    <div className="container py-10 px-4 md:px-6">
      <DatabaseStatusBar onRetry={handleRefreshData} className="mb-6" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Logs {userId}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isBackingUp}>
                  {isBackingUp ? "Backing Up..." : "Backup Database"}
                  <Download className="ml-2 h-4 w-4" />
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBackupDatabase("main")}>Main Database</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBackupDatabase("vector")}>Vector Database</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBackupDatabase("both")}>Both Databases</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isRestoring} variant="destructive">
                  {isRestoring ? "Restoring..." : "Restore Database"}
                  <RefreshCcw className="ml-2 h-4 w-4" />
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRestoreDatabase("main")}>Main Database</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRestoreDatabase("vector")}>Vector Database</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRestoreDatabase("both")}>Both Databases</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button onClick={sendEmail}>Send Test Email</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>}>
          <UsageChart />
        </Suspense>

        <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>}>
          <MemoryUsageChart />
        </Suspense>

        <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>}>
          <SensorChart />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>}>
          <DiskUsageChart />
        </Suspense>
      </div>
    </div>
  )
}
