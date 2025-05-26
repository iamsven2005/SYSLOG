# Role Management System

This **Role Management System** allows administrators to manage user roles within the platform. It provides a table for viewing, creating, editing, and deleting roles, as well as managing users associated with each role. It also supports bulk importing roles from a text input and integrates email templates with roles for customized communication.

## Features

### 1. **Role Management**

* **Add Role**: Admins can create new roles by entering a role name and description. Roles are essential for assigning permissions and controlling access.
* **Edit Role**: Admins can edit existing roles, including updating the name and description.
* **Delete Role**: Admins can delete roles from the system, with a confirmation prompt to prevent accidental deletion.

### 2. **Users and Roles Table**

* **View Roles**: The **UsersRolesTable** displays all roles in the system with their name, description, and associated users.
* **Assign Users**: Each role can have a list of associated users. Users can be filtered and searched by their username or email.
* **Filter Roles**: Roles can be filtered by name or description using a search bar.
* **Role Actions**: The table provides buttons for editing and deleting each role.

### 3. **Bulk Role Import**

* **Mass Import**: Allows admins to import multiple roles by entering them into a text area. Roles are imported one per line, and the system ensures that there are no duplicates.
* **Import Feedback**: Displays a success or error message indicating how many roles were successfully imported and how many failed.

### 4. **Role Form**

* **Modal for Adding/Editing Roles**: A modal dialog is used for adding or editing roles, with fields for the role name and description. It also shows a confirmation button when submitting the form.

### 5. **Role-to-Users Mapping**

* **Role Management**: Users associated with each role are listed and searchable. Admins can easily view which users are linked to which role.
* **User Search**: Admins can search for users by username or email within the context of the role.

### 6. **Permissions and Access Control**

* **Role-Based Access Control**: The system ensures that only authorized users (admin roles) can create, edit, or delete roles. Regular users may only have access to certain roles based on their permissions.

### 7. **User Feedback**

* **Toast Notifications**: Success or error messages are displayed after actions like adding, updating, or deleting roles.
* **Loading Feedback**: When importing roles, a loading spinner is shown to indicate the ongoing process.

### 8. **Email Template Assignment**

* **Assign Email Templates**: When creating or editing a role, admins can assign an email template that will be used when notifying users about role changes.