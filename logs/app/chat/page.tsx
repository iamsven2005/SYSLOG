/*
 * ChatPage.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Server-side rendered chat page that loads user group data and validates access.
 *   Displays a sidebar of user groups and a main chat container for the selected user.
 *
 * Features:
 *   - Fetches current user's chat groups via server action
 *   - Checks user identity and route access permission
 *   - Renders a two-column layout: GroupSidebar and ChatContainer
 *   - Falls back to 404 page if user is not authenticated or unauthorized
 *
 * Dependencies:
 *   - `getUserGroups`, `getId` from server actions
 *   - `allowed` access control function
 *   - UI components: GroupSidebar, ChatContainer
 *   - `notFound()` from Next.js navigation for error handling
 */

import { getUserGroups } from "./chat-actions"
import { GroupSidebar } from "./group-sidebar"
import { ChatContainer } from "./chat-container"
import { getId } from "../login/auth"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"

export default async function ChatPage() {
  const groups = await getUserGroups()
  const id = await getId()
  const a = await allowed("/chat")
  if (!id || a === false) notFound()

  return (
    <div className="flex h-screen">
      <GroupSidebar groups={groups} />
      <ChatContainer id={id} />
    </div>
  )
}
