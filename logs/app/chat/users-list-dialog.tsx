/*
 * UsersListDialog.tsx - 2025-05-26 by sven.tan
 * Description:
 *   A client-side dialog component that displays a searchable list of all users.
 *   Fetches user data on open and supports live filtering by username or email.
 *
 * Features:
 *   - Fetches all users on dialog open via `getAllUsers` server action
 *   - Search bar filters users by username or email (case-insensitive)
 *   - Displays user avatar with fallback initials, name, email, and admin role icon
 *   - Shows loading spinner while fetching
 *   - Uses scrollable container for long user lists
 *
 * Dependencies:
 *   - UI components from ShadCN (Dialog, Input, ScrollArea, Avatar)
 *   - Icons from Lucide React (Search, Shield, Loader2)
 *   - Toast feedback via `sonner`
 *   - Server action: `getAllUsers`
 *
 * Notes:
 *   - Ensures fallback value for missing usernames
 *   - Dialog resets user list on each open to reflect latest state
 */

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAllUsers } from "./chat-actions"
import { toast } from "sonner"
import { Loader2, Search, Shield } from "lucide-react"

interface UserType {
  id: number
  username: string
  email?: string | null
  role?: string[]
}

export function UsersListDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const fetchedUsers = await getAllUsers()
      const sanitizedUsers = fetchedUsers.map(user => ({
        ...user,
        username: user.username ?? "Unknown",
      }))
      setUsers(sanitizedUsers)
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>All Users</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className="h-72 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {user.username}
                          {user.role?.includes("admin") && (
                            <Shield className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                        {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

