import { getUserGroups } from "./chat-actions"
import { GroupSidebar } from "./group-sidebar"
import { ChatContainer } from "./chat-container"
import { getId } from "../login/actions"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"

export default async function ChatPage() {
  const groups = await getUserGroups()
  const id = await getId()
  const a = await allowed("/chat")
  if (!id || a === false) notFound()

  return (
    <div className="flex h-full">
      <GroupSidebar groups={groups} />
      <ChatContainer id={id} />
    </div>
  )
}
