import Link from "next/link"
import { db } from "@/lib/db"
import { UserNav } from "./user-nav"
import { ThemeToggle } from "@/app/theme-toggle"
import { getCurrentUser } from "@/app/login/actions"
import { notFound } from "next/navigation"


export async function getUserPermissions() {
  const user = await getCurrentUser()
  if (!user) notFound()

  const roles = user.role || []

  const rolePermissions = await db.rolePermission.findMany({
    where: {
      roleName: { in: roles },
    },
    include: {
      pagePermission: true,
    },
  })

  const userPermissions = await db.userPermission.findMany({
    where: { userId: user.id },
    include: {
      pagePermission: true,
    },
  })

  const allPermissions = [
    ...rolePermissions.map((rp) => rp.pagePermission),
    ...userPermissions.map((up) => up.pagePermission),
  ]

  const uniquePermissionsMap = new Map()
  for (const perm of allPermissions) {
    uniquePermissionsMap.set(perm.id, perm)
  }

  const mergedPermissions = Array.from(uniquePermissionsMap.values())


  return mergedPermissions
}
export async function allowed(path: string) {
  const permissions = await getUserPermissions()
  return permissions.some((perm) => perm.path === path)
}


export default async function Navbar() {

  const permittedRoutes = await getUserPermissions()

  const navItems = await db.pagePermission.findMany()
  
// Extract allowed paths or names from permissions
const allowedPaths = permittedRoutes.map((p) => p.route?.toLowerCase())

// Filter nav items based on allowed paths
const filteredNavItems = navItems.filter((item) =>
  allowedPaths.includes(item.route) || allowedPaths.includes(item.route.toLowerCase())
)

  return (
        <div className="flex justify-between h-16">
          <div className="flex gap-5 p-5">
              {filteredNavItems.map((item) => {
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.route}
                  </Link>
                )
              })}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <UserNav/>
            </div>
            <ThemeToggle/>
          </div>
        </div>

  )
}
