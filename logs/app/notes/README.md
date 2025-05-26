# Note Management System

The **Note Management System** allows users to manage notes, including functionalities for viewing, creating, editing, deleting, and exporting notes. It includes role-based access control to restrict certain actions to admin users. The system features a rich-text editor for creating and updating notes, a table for viewing and managing notes, and tools for exporting data.

## Key Features

### 1. **User and Admin Permissions**

* **Permission Check**: Verifies if a user has access to the notes page using the `allowed` function. Only authorized users can view or manage notes.
* **Role-Based Access**: Admin users have additional privileges, such as the ability to create, update, delete, and export notes.
* **404 Handling**: If the user is unauthorized or not logged in, a 404 error is displayed.

### 2. **Notes Table**

* **View Notes**: The **NotesTable** component displays a list of notes with pagination, including:

  * **Search**: Search for notes by title or content.
  * **Pagination**: Supports pagination to navigate through a large set of notes.
  * **CRUD Operations**: Admin users can create, edit, delete, and export notes.
  * **Export to Excel**: Admin users can export the displayed notes (without HTML content) to an Excel file.

### 3. **Creating and Editing Notes**

* **NoteEditor**: A rich text editor for creating and editing notes, supporting:

  * **Text Formatting**: Bold, italic, underline, headings, blockquotes, etc.
  * **Image Upload**: Users can drag and drop or paste images, with size validation.
  * **Undo/Redo**: Provides undo and redo functionality.
  * **Save/Update**: Saves new or updated notes with required field validation.
  * **Toast Notifications**: Provides feedback when an image is added or if there are errors (e.g., file size issues).

### 4. **Note View Page**

* **View Notes**: The **Page.tsx** component is used to view the details of a specific note.

  * Displays the note's **title** and **description**.
  * The description is rendered as raw HTML using `dangerouslySetInnerHTML`, which should be handled carefully to avoid security risks.
  * The user must be authenticated and authorized to view the note. Unauthorized users are redirected to the login page.

### 5. **Note Management (CRUD Operations)**

* **Create Note**: Admins can create new notes with a title and description.
* **Update Note**: Admins can update existing notes, modifying their title and description.
* **Delete Note**: Admins can delete notes individually or in bulk.
* **Batch Deletion**: Admins can select multiple notes for batch deletion.

### 6. **Activity Logging**

* **Log Activity**: Each CRUD operation (create, update, delete) logs the activity, ensuring transparency and accountability.

### 7. **Export Functionality**

* **Export Notes**: Admins can export the notes displayed in the table to an Excel file, stripping HTML tags for clean content export.

