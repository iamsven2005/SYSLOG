# Library Management System

The **Library Management System** is designed to facilitate managing a library's catalog entries. It includes features for adding, editing, checking out, and deleting library entries, as well as managing user access and permissions. Administrators can manage library entries through an interface that includes pagination, search filters, and modals for various actions such as checking out books and updating entry details.

## Key Features

### 1. **Library Entry Management**

* **CRUD Operations**: Admin users can create, update, and delete library entries, including details such as reference number, title, category, author, publication year, remarks, and PDF attachments.
* **PDF Upload**: The **AddLibraryEntryDialog** component allows users to upload PDF files associated with books during the creation of a new entry.
* **Book Checkout/Return**: The **CheckoutBookDialog** enables users to check out or return books, with appropriate validation for borrowed status.
* **Bulk Operations**: Admins can select multiple library entries for batch deletion, improving efficiency for large catalogs.

### 2. **Library Entry Search and Filters**

* **Search Functionality**: Users can search for library entries by title, reference number, category, author, and publication year.
* **Filter Options**: Filters allow users to narrow down the results based on various criteria, including availability and attachments.
* **Pagination**: Supports navigating through large datasets with pagination, where the user can select the number of entries per page.

### 3. **Library Entry Modals**

* **Add New Entry**: Admins can add new entries via the **AddLibraryEntryDialog** modal, including required fields like reference number, title, and category, as well as optional fields like author, publication year, and remarks.
* **Edit Existing Entries**: The **EditLibraryEntryDialog** allows admins to edit existing entries with all relevant fields and options.
* **Entry Details Modal**: The **LibraryEntryDetailsModal** displays detailed information about a specific library entry and provides options to edit, check out, or return the book.

### 4. **Activity Logging**

* **Action Tracking**: All actions performed on library entries (create, update, delete, check out, return) are logged for transparency and auditing purposes.

### 5. **Role-based Access Control**

* **Admin Features**: Only admin users can perform actions like creating, editing, and deleting library entries.
* **User Features**: Regular users can view and search for library entries, but only admins can manage or modify the data.