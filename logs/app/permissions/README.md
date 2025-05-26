# Page Permissions Management System

This **Page Permissions Management System** allows administrators to manage user and role-based access to specific routes within the application. The system supports creating, updating, deleting, and viewing permissions associated with routes, roles, and users. It includes features for searching, filtering, and exporting permission data, along with modals for adding and editing permissions.

## Key Features

### 1. **Page Permissions CRUD Operations**

* **Create Page Permission**: Administrators can create new page permissions, associating routes with specific roles and users.
* **Update Page Permission**: Existing page permissions can be modified, including changing the route, description, or users and roles associated with the permission.
* **Delete Page Permission**: Administrators can delete page permissions, ensuring that associated roles and users' permissions are also deleted.
* **View Permissions**: A table displays all permissions, including the associated route, description, roles, and users.

### 2. **Permissions Table**

* **Table Layout**: The **PermissionsTable** component renders page permissions in a structured table format, with columns for route, description, roles, and users.
* **Search and Filter**: Users can search permissions by route or description, making it easy to locate specific permissions.
* **Pagination**: The table supports pagination to handle large sets of data efficiently.
* **Action Buttons**: Buttons for adding, editing, and deleting permissions are included within the table for easy access.
* **Icons for Actions**: Uses icons like **Plus**, **Trash2**, **Edit**, and **RefreshCw** for adding, editing, deleting, and refreshing permissions.

### 3. **Modals for Managing Permissions**

* **Add/Edit Page Permission Modal**: Provides a user-friendly form to create or edit permissions, where users can:

  * **Select Routes**: Define the route to which the permission applies.
  * **Assign Roles**: Use a multi-combobox to assign roles to the permission.
  * **Assign Users**: Similarly, assign specific users to the permission.
  * **Permission Description**: Provide a description for the permission.
* **Delete Permission Modal**: A confirmation modal that ensures permissions are deleted only after user approval.

### 4. **Multi-Select Combobox for Roles and Users**

* **MultiCombobox**: Custom component that allows administrators to select multiple roles and users for each permission.
* **Real-Time Updates**: Changes made to roles or users are immediately reflected in the backend.

### 5. **Excel Export**

* **Export Permissions**: Admins can export the list of permissions and associated roles and users to an Excel file for reporting or backup purposes.

### 6. **Activity Logging and Revalidation**

* **Log Activity**: All actions, such as creating, updating, and deleting permissions, are logged for auditing and accountability.
* **Path Revalidation**: After modifying permissions, the path `/logs` is revalidated to ensure data consistency and reflect updates in the logs.

### 7. **Error Handling**

* **Error Messages**: Each action, such as permission creation or deletion, includes error handling, with logged errors and descriptive messages for easier debugging.