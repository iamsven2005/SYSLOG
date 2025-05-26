/**
 * UploadForm Component - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **UploadForm** component allows users to upload an HTML file containing a catalog of books,
 *   processes the file to extract book data, and displays the extracted books in a list.
 *
 * Key Features:
 *   - Uploads HTML file using an `<input type="file">` element.
 *   - Parses the file content to extract book details such as title, author, reference number, and status.
 *   - Displays a loading spinner during file processing and the name of the processed file once done.
 *   - Renders a list of books using the `BookList` component once books are extracted.
 *
 * Key Components:
 *   - `parseBookData`: A utility function to extract book details from the uploaded HTML file.
 *   - `BookList`: A component that displays the list of extracted books.
 *   - `Card`: A UI component that encapsulates the file upload input and displays status messages.
 *
 * Example Usage:
 *   ```tsx
 *   <UploadForm />
 *   ```
 *
 * Notes:
 *   - **File Handling**: The file is uploaded via the `<input type="file">` element and the `handleFileUpload` function.
 *   - **Data Processing**: Upon file selection, the content is read as text, parsed with `parseBookData`, and the extracted books are stored in the `books` state.
 *   - **Loading and Status**: While the file is being processed, a loading spinner is shown, and once processing is done, the file name is displayed.
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import Book, { parseBookData } from "./parseBookData"
import { BookList } from "./book-list"

export default function UploadForm() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)

    try {
      const text = await file.text()
      const extractedBooks = parseBookData(text)
      setBooks(extractedBooks)
      console.log("Extracted books:", extractedBooks)
    } catch (error) {
      console.error("Error parsing HTML:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="html-file" className="text-sm font-medium">
              Select HTML File
            </label>
            <input
              id="html-file"
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="border rounded p-2"
            />
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Processing file...</p>
            </div>
          )}

          {fileName && !isLoading && (
            <div className="text-sm text-gray-600">
              Processed file: <span className="font-medium">{fileName}</span>
            </div>
          )}
        </div>
      </Card>

      {books.length > 0 && <BookList books={books} />}
    </div>
  )
}

