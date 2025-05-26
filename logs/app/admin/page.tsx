/*
 * activity-logs-1.1.tsx - 2025-05-25 by sven.tan:
 * Add server-side access control for Activity Logs page.
 * - Uses `allowed("/admin")` to verify if the user has access.
 * - Returns 404 via `notFound()` if unauthorized.
 * - Renders <LogsPage /> on successful authorization.
 */

import { notFound } from "next/navigation";
import LogsPage from "./client";
import { allowed} from "@/components/navbar";

export default async function CreateFormPage() {
 const a  = await allowed("/admin")
  if(a === false) notFound()
  return (
      <LogsPage/>

  )
}