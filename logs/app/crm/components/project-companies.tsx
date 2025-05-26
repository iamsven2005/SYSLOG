/*
 * crm/projects/components/project-companies.tsx - 2025-05-26 by sven.tan
 * Description:
 *   Displays a list of companies involved in a specific bridge project, including their roles,
 *   contract values, durations, and status.
 *
 * Features:
 *   - Lists companies linked to the project via `ProjectCompanyLink`
 *   - Shows details such as role, contract value, start/end dates, and contract status
 *   - Provides link to each company's details page
 *   - Includes an "Add Company" button to associate new companies with the project
 *
 * Notes:
 *   - Accepts a `ProjectWithCompanies` prop which includes nested company and link data
 *   - Uses utility functions for formatting currency and dates
 *   - Color codes contract statuses for quick visual reference
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Company, Project, ProjectCompanyLink } from "@/prisma/generated/main"
type ProjectWithCompanies = Project & {
  companies: (ProjectCompanyLink & { company: Company })[]
}
export default function ProjectCompanies({ project }: { project: ProjectWithCompanies }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Companies</CardTitle>
            <CardDescription>Companies involved in this bridge project</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/crm/projects/${project.id}/companies/add`}>Add Company</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {project.companies && project.companies.length > 0 ? (
          <div className="border rounded-md">
            <div className="grid grid-cols-6 p-4 font-medium border-b">
              <div>Company Name</div>
              <div>Role</div>
              <div>Contract Value</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Status</div>
            </div>
            <div className="divide-y">
              {project.companies.map((link) => (
                <div key={link.id} className="grid grid-cols-6 p-4 hover:bg-muted/50">
                  <div className="font-medium">
                    <Link href={`/crm/companies/${link.company.id}`} className="hover:underline">
                      {link.company.name}
                    </Link>
                  </div>
                  <div>{link.role}</div>
                  <div>
                    {link.contractValue !== null ? formatCurrency(link.contractValue.toNumber()) : "N/A"}
                  </div>
                  <div>{link.startDate ? formatDate(link.startDate) : "N/A"}</div>
                  <div>{link.endDate ? formatDate(link.endDate) : "N/A"}</div>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${link.contractStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : link.contractStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : link.contractStatus === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {link.contractStatus || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No companies assigned to this project</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
