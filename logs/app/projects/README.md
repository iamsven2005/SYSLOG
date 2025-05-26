# Project Management System

This **Project Management System** provides administrators with the ability to manage projects within the system. It includes functionalities for creating projects, assigning users to projects, managing model entries, and uploading projects in bulk. Additionally, the system allows users to search, filter, and manage project types, with integration to handle model entries and role-based user assignments.

## Key Features

### 1. **Add New Project**

* **AddProjectModal**: A modal for creating new projects, with fields for:

  * **Business Code**: The unique identifier for the business.
  * **Project Code**: The unique identifier for the project.
  * **Project Name**: The name of the project.
* **Create Project**: On form submission, the project is created and added to the project list.
* **Success/Failure Notifications**: Displays success or error messages via **toast** notifications.

### 2. **Assign Users to Projects**

* **AssignUsersModal**: A modal to assign users to a project.

  * **User List**: Displays users with checkboxes for assignment.
  * **Search**: Search for users by username.
  * **Role Assignment**: Users can be assigned specific roles within the project.
  * **Success/Failure Notifications**: Displays success or error messages when users are assigned to the project.

### 3. **Model Entry Management**

* **ModelEntryModal**: A modal for managing model entries related to a project.

  * **Create/Update/Delete Entries**: Add new entries, update existing ones, or delete them.
  * **Search Entries**: Users can search entries by code.
  * **Import from HTML**: Upload an HTML file or paste HTML content to import multiple entries.
  * **CRUD Operations**: All model entry operations are integrated with backend actions to handle data persistence.

### 4. **Bulk Project Upload**

* **UploadProjects**: Allows for the upload of multiple projects from an HTML file.

  * **HTML Parsing**: The HTML file is parsed to extract project details such as business code, project code, and project name.
  * **Bulk Project Creation**: Multiple projects are created based on the parsed data from the HTML file.
  * **Success/Failure Notifications**: Displays success or error messages based on the upload result.

### 5. **Project List**

* **ProjectsPage**: The main page for viewing and managing projects.

  * **Search and Filter**: Search for projects by name, project code, or business code.
  * **Assign Project Type**: Admins can assign a project type to each project from a dropdown menu.
  * **Model Entry Management**: Admins can manage model entries for each project.
  * **Assign Users**: Admins can assign users to projects.
  * **Pagination**: View projects with pagination to handle large datasets.
  * **Action Buttons**: Buttons for adding new projects, assigning users, and uploading project data.

### 6. **Project Types and Assignments**

* **Assign Project Type**: Select a project type from a dropdown and assign it to a project.
* **Project Assignments**: View and manage the list of users assigned to each project.
* **User Roles**: Assign specific roles to users within a project (e.g., team lead, contributor).

### 7. **Real-Time Feedback**

* **Toast Notifications**: Success and error messages are displayed for actions like creating projects, assigning users, and importing data.
* **Loading States**: Users are notified with loading spinners during data fetching and processing.