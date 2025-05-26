/**
 * ScrollableRoles Component
 * 
 * This component displays a list of roles in a scrollable container. It allows the user to search through the roles
 * and toggle the visibility of all roles if there are more than 5 roles available.
 * The roles are displayed as badges, and the component provides a simple search bar to filter the roles by name.
 * 
 * Props:
 * - `roles` (array): An array of role names (strings) to be displayed as badges.
 * 
 * Features:
 * - A search bar allows the user to filter the roles by name.
 * - If the number of roles exceeds 5, a button is provided to toggle between showing all roles or collapsing the list.
 * - The list of roles is scrollable if the number of roles exceeds the visible height.
 * 
 * State:
 * - `expanded` (boolean): A flag to determine whether the roles list is expanded or collapsed.
 * - `search` (string): The value of the search input to filter roles.
 * 
 * Dependencies:
 * - `useState` from React for managing component state.
 * - `Input` from `@/components/ui/input` for the search input field.
 * - `Button` from `@/components/ui/button` for the toggle button.
 * 
 * Methods:
 * - `filteredRoles`: A computed value that filters the roles based on the search query.
 * 
 * UI:
 * - A scrollable container displays roles as badges.
 * - If there are more than 5 roles, a toggle button is displayed to allow the user to expand or collapse the list.
 */

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ScrollableRoles({ roles }: { roles: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState("")

  const filteredRoles = roles.filter((role) =>
    role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-2">
      {/* Search bar */}
      <Input
        placeholder="Search roles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 text-sm"
      />

      {/* Scrollable badge container */}
      <div
        className={`${
          expanded ? "max-h-[300px]" : "max-h-24"
        } overflow-y-auto pr-1 flex flex-wrap gap-1 border rounded-md p-2`}
      >
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <span
              key={role}
              className="bg-muted text-sm rounded px-2 py-1 capitalize whitespace-nowrap"
            >
              {role}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No matching roles.</span>
        )}
      </div>

      {/* Toggle expand/collapse */}
      {roles.length > 5 && (
        <Button
          variant="link"
          className="px-0 text-sm w-fit self-end"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Collapse" : "Show All"}
        </Button>
      )}
    </div>
  )
}
