/*
 * crm/projects/[id]/loading.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Server component for the "Loading" state of the project detail page.
 *   It displays a skeleton loader while the project data is being fetched.
 *
 * Features:
 *   - Displays `ProjectDetailSkeleton` as a loading placeholder
 *
 * Dependencies:
 *   - UI Components: `ProjectDetailSkeleton`
 */

import ProjectDetailSkeleton from "../../interactions/project-detail-skeleton"

export default function Loading() {
  return (

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ProjectDetailSkeleton />
      </main>
        )
}
