import { allowed } from "@/components/navbar";
import ProjectsPage from "./client";
import { notFound } from "next/navigation";

export default async function Page(){
    const a = await allowed("/projects")
    if(a === false) notFound()
    return(
        <ProjectsPage/>
    )
}