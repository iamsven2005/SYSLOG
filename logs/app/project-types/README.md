# Project Type Management System

This **Project Type Management System** provides the ability to manage different types of projects within an organization. It supports adding new project types, editing existing types, deleting project types, and managing projects assigned to each type. The system includes features like searching, filtering, and pagination for efficient management.

## Features

### 1. **Manage Project Types**

* **Add Project Type**: Create new project types by entering a name and description. Each project type is assigned a count of associated projects.
* **Edit Project Type**: Modify the name and description of existing project types.
* **Delete Project Type**: Delete project types, with confirmation required before deletion to prevent accidental data loss.
* **Search and Filter**: Search for project types by name or description, with filtering options to narrow down the results.

### 2. **Project Types Table**

* **Display Project Types**: View project types in a table format, including project type name, description, and a count of associated projects.
* **Pagination**: Supports pagination to navigate through a large set of project types.
* **Action Buttons**: Includes action buttons to edit, delete, or view additional details of a project type.

### 3. **CRUD Operations for Project Types**

* **Create Project Type**: Add a new project type through the modal form.
* **Update Project Type**: Edit the details of an existing project type.
* **Delete Project Type**: Remove project types after confirming the deletion.

### 4. **Modal Dialogs**

* **Add Project Type Modal**: Allows admins to enter the name and description of a new project type.
* **Edit Project Type Modal**: Pre-fills the modal with the existing project type's data for modification.
* **Delete Project Type Modal**: Confirms deletion of a project type and displays a warning if the type has associated projects.

### 5. **Toast Notifications**

* **Success and Error Feedback**: Toast notifications are shown after actions like creating, editing, or deleting project types, providing real-time feedback on the result.

### 6. **Project Assignment to Types**

* **Associated Projects**: Each project type is associated with a count of projects linked to it. This helps in monitoring which project types are actively being used and helps prevent unintentional deletions of active types.

### 7. **Responsive User Interface**

* **Modals and Forms**: The system uses modal dialogs for adding, editing, and deleting project types, ensuring a smooth user experience.
* **Table Layout**: Uses a table layout with header, rows, and cells for easy viewing of project types.

### 8. **Real-Time Data Updates**

* **Dynamic Fetching**: Data is dynamically fetched and updated from the server, ensuring that the list of project types is always up-to-date.