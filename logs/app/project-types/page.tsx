
import { allowed } from "@/components/navbar";
import ProjectTypesPage from "./client";
import { notFound } from "next/navigation";
export default async function Page(){
      const a = await allowed("/project-types")
      if(a === false) notFound()
    return(
        <ProjectTypesPage/>
    )
}