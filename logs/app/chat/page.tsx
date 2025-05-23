import { getUserGroups } from "./chat-actions"
import { GroupSidebar } from "./group-sidebar"
import { ChatContainer } from "./chat-container"
import { getCurrentUser, getId } from "../login/actions"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"

export async function ChatLayout() {
  const groups = await getUserGroups()
  const currentUser = await getCurrentUser()
  const id = await getId()
  const a = await allowed("/char")
  if(!id || a === false)  notFound()
  return (
    <div className="flex h-full">
      <GroupSidebar groups={groups} />
      <ChatContainer id={id} />
    </div>
  )
}
