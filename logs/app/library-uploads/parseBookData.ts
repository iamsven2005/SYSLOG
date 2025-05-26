/**
 * parseBookData Function - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **parseBookData** function parses HTML content of a book catalog, extracting relevant information
 *   and returning it as an array of book objects. It assumes that the data is structured in a table format.
 *
 * Key Features:
 *   - Parses HTML content using `DOMParser`.
 *   - Extracts book data from the provided HTML, including the title, reference number, author, and more.
 *   - Returns an array of book objects with relevant attributes like `hasPdf`, `isBorrowed`, etc.
 *
 * Key Components:
 *   - `DOMParser`: A built-in JavaScript API used to parse HTML strings into a document object model (DOM).
 *   - `Book`: The type of object expected, including properties such as `hasPdf`, `title`, `author`, etc.
 *
 * Example Usage:
 *   ```tsx
 *   const books = parseBookData(htmlContent)
 *   ```
 *
 * Notes:
 *   - **HTML Structure**: The function assumes the HTML content includes a table with specific columns. It looks for a table with the class `table_layout` and processes each row (`<tr>`) in the table body (`<tbody>`).
 *   - **Data Extraction**: The function extracts data from the cells of each row, skipping the first two cells (which are typically for controls and numbering). It checks for a PDF attachment using an `img` tag within the cell.
 *   - **Skipping Invalid Rows**: If the row does not contain sufficient data (less than 11 cells), it is skipped. If a book's `title` and `refNo` are missing, that row is also skipped.
 *   - **Borrower Status**: The `isBorrowed` attribute is set based on whether the `borrower` field is populated.
 */
export default interface Book {
    hasPdf: boolean
    category: string
    refNo: string
    title: string
    author: string
    pubYear: string
    creationDate: string
    borrower: string
    loanDate: string
    remarks: string
    isBorrowed: boolean
  }
  
export function parseBookData(htmlContent: string): Book[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, "text/html")

  const books: Book[] = []

  // Find the table with book data
  const tableRows = doc.querySelectorAll("table.table_layout tbody tr")

  tableRows.forEach((row) => {
    const cells = row.querySelectorAll("td")

    // Skip if we don't have enough cells
    if (cells.length < 11) return

    // Extract data from cells (skip the first two cells which are for controls and numbering)
    const hasPdf = cells[2].querySelector("img") !== null
    const category = cells[3].textContent?.trim() || ""
    const refNo = cells[4].textContent?.trim() || ""
    const title = cells[5].textContent?.trim() || ""
    const author = cells[6].textContent?.trim() || ""
    const pubYear = cells[7].textContent?.trim() || ""
    const creationDate = cells[8].textContent?.trim() || ""
    const borrower = cells[9].textContent?.trim() || ""
    const loanDate = cells[10].textContent?.trim() || ""
    const remarks = cells.length > 11 ? cells[11].textContent?.trim() || "" : ""

    // Skip empty rows
    if (!title && !refNo) return

    books.push({
      hasPdf,
      category,
      refNo,
      title,
      author,
      pubYear,
      creationDate,
      borrower,
      loanDate,
      remarks,
      isBorrowed: borrower !== "",
    })
  })

  return books
}

