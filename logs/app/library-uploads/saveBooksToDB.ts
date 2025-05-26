/**
 * saveBooksToDB.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **saveBooksToDB** function is responsible for saving a list of books to the database.
 *   It ensures that the data for each book is validated and transformed into appropriate formats (e.g., parsing dates, handling optional fields).
 *   The function uses a transaction to ensure all books are either saved successfully or none are, maintaining database integrity.
 *
 * Key Features:
 *   - Processes a list of book objects, saving them to the database.
 *   - Handles various types of data conversion, such as:
 *     - Parsing publication year into an integer.
 *     - Converting string dates into JavaScript `Date` objects.
 *     - Handling invalid or missing data by providing fallback values.
 *   - Uses a database transaction to ensure atomicity of the operation.
 *   - Returns a success or error message, along with the count of successfully saved books.
 *
 * Key Components:
 *   - `db.$transaction`: Ensures that all books are saved or none, rolling back if any error occurs.
 *   - `tx.libraryEntry.create`: Saves each book entry to the `libraryEntry` table.
 *   - `Book`: A type representing the structure of each book.
 *
 * Example Usage:
 *   ```tsx
 *   const result = await saveBooksToDB(books)
 *   if (result.success) {
 *     console.log(result.message)
 *   } else {
 *     console.error(result.message)
 *   }
 *   ```
 *
 * Notes:
 *   - **Fallback for Invalid Dates**: If a date is invalid, it falls back to the current date or `null`.
 *   - **Error Handling**: If any error occurs during the process, it logs the error and returns a failure message.
 *   - **Attachment Information**: The function does not handle attachment URLs or filenames, as this information is not available from the source data.
 */

"use server"

import { db } from "@/lib/db"
import Book from "./parseBookData"


export async function saveBooksToDB(books: Book[]) {
  try {
    // Start a transaction to ensure all books are saved or none
    const result = await db.$transaction(async (tx) => {
      const savedBooks = []

      for (const book of books) {
        // Convert pubYear to number or null
        let pubYearInt: number | null = null
        if (book.pubYear && book.pubYear.trim() !== "") {
          const year = Number.parseInt(book.pubYear)
          pubYearInt = isNaN(year) ? null : year
        }

        // Convert creationDate string to Date object
        let creationDate: Date
        try {
          creationDate = new Date(book.creationDate)
          // Check if date is valid
          if (isNaN(creationDate.getTime())) {
            creationDate = new Date() // Fallback to current date if invalid
          }
        } catch (error) {
          console.log(error)


          creationDate = new Date() // Fallback to current date if parsing fails
        }

        // Convert loanDate string to Date object or null
        let loanDate: Date | null = null
        if (book.loanDate && book.loanDate.trim() !== "") {
          try {
            loanDate = new Date(book.loanDate)
            // Check if date is valid
            if (isNaN(loanDate.getTime())) {
              loanDate = null
            }
          } catch (error) {
            console.log(error)

            loanDate = null
          }
        }

        // Create the library entry
        const savedBook = await tx.libraryEntry.create({
          data: {
            refNo: book.refNo,
            category: book.category,
            title: book.title,
            author: book.author || null,
            pubYear: pubYearInt,
            creationDate,
            borrower: book.borrower || null,
            loanDate,
            remarks: book.remarks || null,
            // We don't have attachment info from the HTML parsing
            attachmentUrl: null,
            attachmentFilename: null,
          },
        })

        savedBooks.push(savedBook)
      }

      return {
        count: savedBooks.length,
        books: savedBooks,
      }
    })

    return {
      success: true,
      message: `Successfully saved ${result.count} books to the database.`,
      count: result.count,
    }
  } catch (error) {
    console.error("Error saving books to database:", error)
    return {
      success: false,
      message: `Error saving books: ${error instanceof Error ? error.message : "Unknown error"}`,
      count: 0,
    }
  }
}

