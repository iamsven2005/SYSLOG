import { allowed } from "@/components/navbar";
import { notFound } from "next/navigation";
import RulesTable from "./RulesTable";

export default async function Page(){
    const a = await allowed("/rules")
    if(a === false) notFound()
    return(
        <RulesTable/>
    )
}