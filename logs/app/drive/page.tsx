
import { allowed } from "@/components/navbar"
import DriveExplorer from "./client"
import { notFound } from "next/navigation"
import { getId } from "../login/actions"

export default async function Page(){
const a = await allowed("/drive")
const id = await getId()
if(a === false || !id) notFound()

        return(
          <DriveExplorer id={id}/>
        )
}