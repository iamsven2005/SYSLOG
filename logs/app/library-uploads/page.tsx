/**
 * Page.tsx UploadsPage Component - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **UploadsPage** component allows users to upload an HTML file containing book catalog information.
 *   The page checks user permissions before rendering the upload form. It provides a simple interface for users to upload HTML files,
 *   and parses the file to extract book information.
 *
 * Key Features:
 *   - Ensures that only authorized users can access the page by checking permissions.
 *   - Allows users to upload HTML files for book catalog extraction.
 *   - Provides a user-friendly interface with clear instructions.
 *
 * Key Components:
 *   - `UploadForm`: A component that handles the file upload process.
 *   - `allowed`: A function that verifies if the current user has permission to upload books.
 *   - `notFound`: A Next.js method used to redirect unauthorized users to a 404 page.
 *
 * Example Usage:
 *   ```tsx
 *   <UploadsPage />
 *   ```
 *
 * Notes:
 *   - **Permissions Check**: The `allowed` function ensures that only authorized users can access this page. If the user does not have permission, they are redirected to a 404 page.
 *   - **File Upload**: The form allows users to upload HTML files, which are then processed to extract book data.
 *   - **Instructions**: The page includes instructions for users on how to use the upload form.
 */

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