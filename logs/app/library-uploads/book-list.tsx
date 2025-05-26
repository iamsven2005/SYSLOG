/**
 * book-list.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **BookList** component displays a list of books that have been extracted and allows the user to save them to the database.
 *   It includes functionality for searching books, viewing their details, and checking their status (whether available or borrowed).
 *   The component also provides the option to save the books to the database, handling the saving process asynchronously.
 *
 * Key Features:
 *   - Displays a searchable list of books in a table format.
 *   - Allows saving the books to the database.
 *   - Shows success or error alerts after attempting to save the books.
 *   - Supports searching books by title, author, category, or reference number.
 *   - Handles books with or without attachments (PDFs).
 *   - Handles borrowed books with a clear status indicator (borrowed/available).
 *
 * Key Components:
 *   - `saveBooksToDB`: A function that saves books to the database and handles errors and success responses.
 *   - `Input`: A search input field to filter books based on the entered search term.
 *   - `Table`: Displays the list of books in a structured table format with columns for various book details.
 *   - `Alert`: Provides feedback to the user regarding the success or failure of the save operation.
 *
 * Example Usage:
 *   ```tsx
 *   const books = [
 *     { refNo: "0001", category: "PM9", title: "Book Title", author: "Author Name", pubYear: "2023", isBorrowed: false, hasPdf: true, borrower: null },
 *     { refNo: "0002", category: "PM9", title: "Another Book", author: "Author Name", pubYear: "2022", isBorrowed: true, hasPdf: false, borrower: "John Doe" }
 *   ];
 *   <BookList books={books} />
 *   ```
 *
 * Notes:
 *   - **State Management**: The component uses React's `useState` to manage search terms, saving states, and success/error states for saving books.
 *   - **Filtering**: Books are filtered based on the search term in their title, author, category, or reference number.
 *   - **Alert**: Feedback about the save process is displayed using an `Alert` component. A success or error message is shown based on the outcome of saving the books.
 *   - **Table Styling**: The table dynamically highlights borrowed books with a background color.
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, FileCheck, Save, Check, AlertCircle } from "lucide-react"
import { saveBooksToDB } from "./saveBooksToDB"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Book from "./parseBookData"

interface BookListProps {
  books: Book[]
}
interface SaveBooksResponse {
    success: boolean
    message: string
    count: number
  }
  
export function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveBooksResponse | null>(null)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.refNo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveToDB = async () => {
    if (books.length === 0) return

    setIsSaving(true)
    setSaveResult(null)

    try {
      const result = await saveBooksToDB(books)
      setSaveResult(result)
    } catch (error) {
      setSaveResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        count: 0,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Extracted Books ({books.length})</CardTitle>
          <Button onClick={handleSaveToDB} disabled={isSaving || books.length === 0} className="w-full md:w-auto">
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save to Database
              </>
            )}
          </Button>
        </div>

        {saveResult && (
          <Alert className={`mt-4 ${saveResult.success ? "bg-green-50" : "bg-red-50"}`}>
            {saveResult.success ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle className={saveResult.success ? "text-green-800" : "text-red-800"}>
              {saveResult.success ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{saveResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDF</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Ref No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Pub. Year</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book, index) => (
                <TableRow key={index} className={book.isBorrowed ? "bg-amber-50" : ""}>
                  <TableCell>
                    {book.hasPdf ? (
                      <FileCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.refNo}</TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.pubYear}</TableCell>
                  <TableCell>
                    {book.isBorrowed ? (
                      <span className="text-amber-600">Borrowed by {book.borrower}</span>
                    ) : (
                      <span className="text-green-600">Available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredBooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No books found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

