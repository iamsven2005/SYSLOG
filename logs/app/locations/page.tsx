
import { allowed } from "@/components/navbar";
import LocationsTable from "./client";
import { notFound } from "next/navigation";
// This page is for upload of books from html file
export default async function UploadsPage() {
  const a = await allowed("/locations")
  if(a === false) notFound()
  return (
    <LocationsTable
    />
  )
}