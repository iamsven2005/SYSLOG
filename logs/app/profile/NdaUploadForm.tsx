/**
 * NdaUploadForm.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component allows a user to upload their Non-Disclosure Agreement (NDA) document. 
 *   The form includes a file input for uploading a PDF, a button to trigger the upload, and a display of the current uploaded document 
 *   (if available). It handles the submission of the document and notifies the user about the status of the upload.
 *
 * Components:
 *   - `Button`: Triggers the file upload process and allows the user to initiate the upload or reset the file input.
 *   - `Input`: A hidden file input field used to select a PDF file for upload.
 *   - `Table`, `TableBody`, `TableCell`, `TableHeader`, `TableRow`: Displays details about the current uploaded document, if any.
 *   - `AlertCircle`: Displays an alert icon if no document has been uploaded yet.
 *   - `Toast`: Used to show success or error messages about the file upload.
 *
 * Props:
 *   - `user`: The current user’s data, including the username and any existing uploaded NDA document information.
 *
 * Behavior:
 *   - When the "Upload PDF document" button is clicked, the hidden file input is triggered, allowing the user to select a file.
 *   - The file input is restricted to PDF files, and upon file selection, the file name is displayed.
 *   - If a file is selected, the "Upload" button becomes enabled, allowing the user to upload the file to the server.
 *   - The `handleUpload` function sends the selected file and associated user ID to an API route (`/api/nda-upload`), which processes the upload.
 *   - Upon successful upload, the user is notified with a success message, and the uploaded document link becomes visible.
 *   - If an error occurs, an error message is shown to the user.
 *   - The component also allows the user to view their previously uploaded document by clicking on the provided link.
 *
 * Notes:
 *   - The user is only able to upload one NDA document, and the system will replace the previous file if a new one is uploaded.
 *   - The upload action is disabled while the file is being uploaded to prevent multiple submissions.
 *   - The component ensures that the user is informed about the upload status and if no NDA has been uploaded.
 */

"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { User } from "@/prisma/generated/main"

export default function NdaUploadForm({ user}: {user: User}) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }
  

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsSubmitting(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", user.id.toString())

      // Use the API route instead of server action
      const response = await fetch("/api/nda-upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Your NDA document has been uploaded successfully.")

        // Reset the file input
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        // Refresh the page to show the updated document
        router.refresh()
      } else {
        toast.error("Failed to upload document")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Upload error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {user.ndafile && (
        <div>
          <h3 className="font-medium mb-2">Current Document</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{user.username}</TableCell>
                <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <a
                    href={`/api/nda-document/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-6 h-6 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    View Document
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <div className="border p-4 rounded-md">
        <p className="text-blue-600 mb-4">
          By clicking the &quot;Upload&quot; button below, I hereby agree to and accept the terms and conditions as defined in the
          Non-Disclosure Agreement document.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button
            type="button"
            variant="secondary"
            className="bg-blue-400 text-white hover:bg-blue-500"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload PDF document
          </Button>

          <div className="flex-1">
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            <div className="border rounded px-3 py-2 text-gray-500">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </div>
          </div>

          {selectedFile && (
            <Button type="button" onClick={handleUpload} disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>

        {!user.ndafile && (
          <div className="flex items-center gap-2 mt-4 text-amber-600">
            <AlertCircle size={16} />
            <span>You have not uploaded an NDA document yet.</span>
          </div>
        )}
      </div>
    </div>
  )
}

