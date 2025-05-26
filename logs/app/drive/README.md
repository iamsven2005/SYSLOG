# File Management System

This is a file management system designed to allow users to upload, organize, and manage files and folders in a cloud-based drive. It integrates features for creating folders, viewing file details, and managing file permissions with real-time updates and notifications.

## Features

### 1. **Drive Explorer**

The main interface where users can browse and manage their files and folders.

* **Folder Structure**: Navigate through folders using clickable breadcrumbs.
* **File and Folder Operations**: Allows renaming, deleting, and moving files/folders.
* **Drag-and-Drop Support**: Drag files and folders to move or delete them.
* **File Selection**: Click to select files and view their details in a side panel.
* **Real-Time Updates**: Automatically refreshes the file list using Server-Sent Events (SSE) for any changes in the drive.

### 2. **File Management**

Supports viewing and interacting with individual files.

* **File Preview**: Display previews for images, videos, and audio files directly in the UI.
* **Metadata**: Shows file information such as owner, creation date, and last modification date.
* **Permissions**: Share files with other users and manage access rights (read, write, comment).
* **Download Files**: Option to download files from the system.

### 3. **Folder Operations**

Allows users to manage folders within the drive.

* **Create Folders**: Users can create new folders by providing a name.
* **Rename Folders**: Allows inline renaming of folders.
* **Folder Deletion**: Deletes folders with confirmation, including bulk actions.

### 4. **File Upload**

Users can upload files to the system and extract content for embedding.

* **File Upload**: Users can upload files with a progress bar indicating the upload status.
* **Text Extraction**: Supports extracting text from various file formats like PDF, DOCX, XLSX, and images for embedding.
* **Progress Feedback**: Displays the upload progress and any extracted content in a text area.

### 5. **Permissions and Sharing**

Manage file permissions and user access.

* **Grant Permissions**: Share files with specific users and assign read, write, or comment permissions.
* **Remove Permissions**: Allows the removal of specific users’ access to a file.
* **View Access List**: Displays users who have access to the file with their permission level.

### 6. **Real-Time File System**

The system uses **SSE** to ensure real-time updates for file and folder changes.

* **Server-Sent Events (SSE)**: Automatically listens for file or folder changes and refreshes the interface without the need for manual reloads.