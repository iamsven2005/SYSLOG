
import { notFound } from "next/navigation";
import UploadForm from "./upload-form";
import { allowed } from "@/components/navbar";
// This page is for upload of books from html file
export default async function UploadsPage() {

      const a = await allowed("/library-upload")
      if(a === false) notFound()
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">HTML Book Catalog Parser</h1>
      <p className="mb-6 text-gray-600">
        Upload an HTML file from the YWL Engineering Portal to extract book information.
      </p>
      <UploadForm />
    </div>
  )
}