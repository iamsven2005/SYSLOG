/**
 * ChatContainer Component
 * -----------------------
 * This client component is the main container for the chat interface.
 * It handles the rendering of messages, input, and auxiliary actions like
 * screenshot capture and import/export dialogs.
 *
 * Props:
 * - id (number): The current user’s ID (used for message attribution).
 *
 * Features:
 * ---------
 * - Displays placeholder UI if no group is selected.
 * - Renders ChatMessages and ChatInput for the active group.
 * - Provides UI buttons to:
 *   - Open the user list dialog
 *   - Open import/export dialog
 *   - Take a screenshot of the chat log
 *
 * Screenshot functionality:
 * -------------------------
 * - Captures the `#chat-messages-container` DOM element.
 * - Saves the image with a timestamped filename.
 * - Attempts to copy the image to clipboard.
 * - Displays success/error via `sonner` toasts.
 *
 * Dependencies:
 * -------------
 * - `takeScreenshot` from `../utils/screenshot`
 * - `ChatMessages`, `ChatInput`, `UsersListDialog`, `ImportExportDialog`
 * - `useSearchParams` for routing
 *
 * Usage:
 * ------
 * Used inside the chat layout to display the right panel of the chat page.
 */

"use client"

import { useState} from "react"
import { useSearchParams } from "next/navigation"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { UsersListDialog } from "./users-list-dialog"
import { ImportExportDialog } from "./import-export-dialog"
import { Camera,Users, FileUp } from "lucide-react"
import { takeScreenshot } from "../utils/screenshot"
import { toast } from "sonner"

export function ChatContainer({ id }: { id: number }) {
  const searchParams = useSearchParams()
  const groupId = searchParams.get("groupId")
  const [isUsersListOpen, setIsUsersListOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)


  const handleScreenshot = async () => {
    if (!groupId) return

    try {
      const success = await takeScreenshot(
        "chat-messages-container",
        `chat-${groupId}-${new Date().toISOString().slice(0, 10)}.png`,
      )
      if (success) {
        toast.success("Screenshot saved and copied to clipboard. You can now paste it in the chat.")
      } else {
        toast.success("Screenshot saved. Copying to clipboard not supported in this browser.")
      }
    } catch (error) {
      console.error("Screenshot error:", error)
      toast.error(`Screenshot error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (!groupId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium dark:text-gray-200">Select a chat from the sidebar</h2>
          <p className="text-muted-foreground dark:text-gray-400">
            Choose an existing conversation or create a new one
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUsersListOpen(true)}
              className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
          </div>
        </div>
        <UsersListDialog open={isUsersListOpen} onOpenChange={setIsUsersListOpen} />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col dark:bg-gray-900">
      <div className="flex justify-end p-2 gap-2 border-b dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsImportExportOpen(true)}
          className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <FileUp className="h-4 w-4 mr-2" />
          Import/Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleScreenshot}
          className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Camera className="h-4 w-4 mr-2" />
          Screenshot
        </Button>
      </div>
      <ChatMessages groupId={Number.parseInt(groupId)} id={id} />
      <ChatInput groupId={Number.parseInt(groupId)} userId={id}/>

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        groupId={Number.parseInt(groupId)}
      />
    </div>
  )
}

