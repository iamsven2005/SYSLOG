# Book Catalog Management System

The **Book Catalog Management System** allows users to upload HTML files containing book catalog information, processes the file to extract book data, and displays the list of extracted books. The system includes features for saving the extracted books to a database, searching through the list, and handling status updates (e.g., whether a book is borrowed or available).

## Key Features

### 1. **Upload Form**

* **HTML File Upload**: Users can upload an HTML file that contains the catalog of books using the `<input type="file">` element.
* **Data Parsing**: The uploaded HTML file is processed to extract relevant book data, including:

  * **Title**
  * **Author**
  * **Reference Number**
  * **Borrowed Status**
  * **PDF Attachment (if available)**
* **Loading State**: A loading spinner is displayed while the file is being processed, and the file name is shown once processing is complete.
* **Extracted Book List**: After the file is processed, the extracted book data is displayed using the **BookList** component.

### 2. **Book List Management**

* **Display Books**: The **BookList** component displays a table of books that have been extracted from the uploaded file. The list shows key details such as:

  * **Title**
  * **Author**
  * **Reference Number**
  * **Publication Year**
  * **Borrowed Status (borrowed or available)**
* **Search Functionality**: Books can be searched by title, author, category, or reference number.
* **Save to Database**: Admin users can save the extracted books to the database. Feedback about the save operation is displayed as a success or error alert.

### 3. **Book Data Processing and Saving**

* **parseBookData**: The function processes the uploaded HTML file, extracts the data, and returns an array of book objects. It handles various elements like title, author, reference number, and more.

  * **PDF Detection**: It checks whether a book has a PDF attachment based on an `img` tag within the HTML content.
  * **Skipping Invalid Rows**: Invalid rows (e.g., those missing title or reference number) are skipped.

* **saveBooksToDB**: This function saves the extracted book data to the database.

  * **Data Validation**: It ensures the book data is properly validated and formatted (e.g., parsing dates, handling missing data).
  * **Atomicity**: Uses a database transaction to ensure that all books are either saved successfully or none, maintaining data integrity.
  * **Error Handling**: If any errors occur during the saving process, they are logged, and feedback is provided to the user.

### 4. **Uploads Page**

* **Permission Check**: The **UploadsPage** component ensures that only authorized users can access the upload functionality by calling the `allowed("/locations")` function. If access is denied, users are redirected to a "not found" page using `notFound()`.
* **File Upload Interface**: The page provides a user-friendly interface for uploading HTML files and displays clear instructions for users on how to upload the file.