/**
 * FileUploader.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component allows users to upload HTML files by either dragging and dropping or clicking the "Browse Files" button.
 *   It processes the file upload and alerts the user if the file is not an HTML file. Once an HTML file is selected,
 *   the user can click to import the data from the file.
 *
 * Key Features:
 *   - Drag-and-drop area for file upload.
 *   - Button to browse for files.
 *   - Validates that only HTML files are selected.
 *   - Displays the selected file name after selection.
 *   - Triggers a file upload process when the user confirms with the "Import Data" button.
 *
 * Key Functions:
 *   - `handleDrag`: Manages drag events to indicate when a file is being dragged over the area.
 *   - `handleDrop`: Handles the drop event and processes the selected file.
 *   - `handleFileChange`: Handles file selection through the file input dialog.
 *   - `handleFile`: Validates the file type (only allows HTML files).
 *   - `handleUpload`: Triggers the file upload when the user clicks the "Import Data" button.
 *
 * Example Usage:
 *   ```tsx
 *   <FileUploader onFileUpload={handleFileUpload} isLoading={false} />
 *   ```
 *
 * Notes:
 *   - The `onFileUpload` prop is a function that will handle the file once it's selected.
 *   - The `isLoading` prop is used to disable the UI elements when the file is being processed.
 */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
}

export function FileUploader({ onFileUpload, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (file.type === "text/html" || file.name.endsWith(".html")) {
      setSelectedFile(file)
    } else {
      alert("Please upload an HTML file")
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  return (
    <div>
      <Card
        className={`border-2 border-dashed p-4 ${dragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">Upload HTML File</h3>
          <p className="mb-4 text-sm text-gray-500">Drag and drop your HTML file here, or click to browse</p>
          <input ref={fileInputRef} type="file" accept=".html" className="hidden" onChange={handleFileChange} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            Browse Files
          </Button>
        </CardContent>
      </Card>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between p-4 border rounded-md bg-gray-50">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
          </div>
          <Button onClick={handleUpload} disabled={isLoading}>
            {isLoading ? "Processing..." : "Import Data"}
          </Button>
        </div>
      )}
    </div>
  )
}
