# Job Title Management System

This system allows for the management of job titles, including features for adding, updating, deleting, importing, searching, filtering, and exporting job titles. The system supports admin-level operations for full CRUD functionalities and bulk import/export of job titles.

## Key Features

### 1. **Job Title Management**

* **Add Job Titles**: Admins can add new job titles, including details like job title name, abbreviation, and seniority level.
* **Edit Job Titles**: Admins can modify existing job titles to keep the data up to date.
* **Delete Job Titles**: Admins can delete job titles when no longer needed.
* **Bulk Import**: Admins can upload job titles via an HTML file to quickly populate the job title database.
* **Search and Filter**: Users can search and filter job titles based on various criteria like job title name, seniority level, and reference number.
* **Export to CSV**: Users can export job title data to a CSV file for external use or backups.

### 2. **Job Title Table**

* **Pagination**: Job titles are displayed in a paginated table for better user experience, especially with large datasets.
* **Bulk Actions**: Admins can select multiple job titles for bulk deletion.
* **Editable Entries**: Admins can click to edit job titles directly from the table.

### 3. **Import Job Titles**

* **HTML File Upload**: Admins can upload an HTML file containing job titles for quick bulk insertion into the database.

## Key Components

### **1. `JobTitle.ts` (Backend)**

Handles the server-side logic for managing job titles, including creating, fetching, deleting, and updating job titles in the database.

#### Key Functions:

* `createJobTitle`: Adds a new job title to the database.
* `bulkInsertJobTitles`: Inserts multiple job titles in a single transaction for efficiency.
* `getJobTitles`: Retrieves job titles, sorted by their serial number (`sn`).
* `deleteJobTitles`: Deletes job titles by their `id`s.

### **2. `JobTitlesPage.tsx` (Frontend)**

The page component that renders the UI for managing job titles, including displaying job titles in a table, uploading job titles, and exporting them to a CSV file.

#### Key Features:

* File upload to import job titles from HTML files.
* Search and filter job titles based on title, seniority level, and reference number.
* Pagination to navigate through large datasets.
* Bulk actions for selecting and deleting multiple job titles at once.
* CSV export functionality for job titles.

### **3. `FileUploader.tsx` (Frontend)**

This component provides the drag-and-drop interface for uploading HTML files containing job titles. It validates that only HTML files are accepted and triggers the data processing when a file is selected.

#### Key Features:

* Drag-and-drop support for uploading files.
* Validates that only HTML files are selected.
* Displays the file name once selected.

### **4. `utils.ts` (Backend)**

Contains helper functions for parsing HTML content and extracting job title data. It includes two methods for parsing job title data — one for browser environments and another for server-side use without `DOMParser`.

#### Key Functions:

* `parseHtmlContent`: Parses HTML content using the `DOMParser` to extract job titles from a table.
* `parseHtmlContentAlternative`: Uses regular expressions to extract job titles for environments where `DOMParser` is not available.

### **5. `JobTitlesLayout.tsx` (Frontend)**

This layout component handles user access control for the job titles page, ensuring that only authorized users (admins) can access the job titles management interface.

#### Key Features:

* Verifies user permissions before rendering the page.
* Redirects unauthorized users to a 404 error page.