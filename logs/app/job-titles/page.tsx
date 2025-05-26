import type React from "react"
import { allowed } from "@/components/navbar"
import { notFound } from "next/navigation"
import JobTitlesPage from "./client"



export default async function JobTitlesLayout() {
    const a = await allowed("/job-titles")
    if(a === false) notFound()
  return <JobTitlesPage/>
}
