/*
 * folder-breadcrumb.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The FolderBreadcrumb component renders the breadcrumb navigation for the file explorer.
 *   It displays the current folder path, allowing users to navigate to any parent folder.
 *   The breadcrumb uses a `ChevronRight` icon to separate folder names and a `Home` icon for the root directory.
 *
 * Key Features:
 *   - Displays folder path as clickable breadcrumbs
 *   - Handles the root folder as a special "Home" link
 *   - Dynamically links to parent folders or the root folder based on the current path
 *   - Highlights the current folder with a bold font style
 *   - Includes responsive styling to maintain accessibility and readability on various screen sizes
 *
 * Props:
 *   - path: An array representing the breadcrumb path. Each item contains:
 *     - id: The folder's unique identifier (null for the root folder)
 *     - name: The folder's name displayed in the breadcrumb
 *
 * UI/UX Enhancements:
 *   - Each breadcrumb is a clickable link that takes the user to the respective folder
 *   - The current folder is highlighted with a distinct font style
 *   - Breadcrumb items are separated by the `ChevronRight` icon
 *   - The first breadcrumb (root folder) is represented by the `Home` icon for better visual understanding
 */

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface FolderBreadcrumbProps {
  path: Array<{ id: number | null; name: string }>
}

export function FolderBreadcrumb({ path }: FolderBreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <ol className="flex items-center flex-wrap">
        {path.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}

            <Link
              href={item.id === null ? "/drive" : `/drive?folder=${item.id}`}
              className={`hover:text-foreground flex items-center ${
                index === path.length - 1 ? "font-medium text-foreground" : ""
              }`}
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

