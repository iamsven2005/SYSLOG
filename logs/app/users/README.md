# User Management System

This User Management System provides administrators with tools to manage users, assign roles, handle device associations, and perform bulk operations like import/export. It supports advanced features like search, pagination, and real-time updates, allowing seamless management of users within a platform.

## Features

### 1. **User Table**

* **Displays User Data**: View users' details such as username, email, roles, devices, creation date, and more.
* **Search**: Easily filter users by username, email, or other attributes with a search bar.
* **Pagination**: Navigate through large sets of users with pagination controls to move between pages.
* **Bulk Actions**: Select multiple users for bulk actions, such as deletion or device assignment.
* **Editable User Data**: Admins can add, edit, or delete users directly from the interface.

### 2. **User Operations**

* **Add New Users**: Add new users through a modal that includes fields for username, email, password, roles, devices, and location.
* **Edit User Details**: Edit the details of existing users, including roles, location, devices, and more.
* **Delete Users**: Delete users either individually or in bulk.
* **Role Management**: Assign and manage roles for each user through a multi-combobox component.

### 3. **Device Assignment**

* **Manage Devices**: Admins can assign and remove devices from users.
* **Device Preview**: Display the devices currently assigned to each user as badges.

### 4. **Import/Export Functionality**

* **Export Users**: Export users' data to an Excel file for backup or reporting.
* **Import Users**: Import users from an Excel file, allowing batch creation of users.
* **Excel Preview**: Preview the data in an Excel file before importing it, with the ability to handle errors and successful imports.

### 5. **Roles and Locations**

* **Role Management**: Define and assign roles to users with a flexible search and filter function.
* **Location Management**: Select locations for users, providing contextual assignment for location-based features.

### 6. **Modals**

* **Add/Edit User Modal**: A form where administrators can add new users or edit existing ones.
* **Delete User Modal**: A confirmation modal to delete users.
* **Import Modal**: Upload and preview Excel files before importing user data.

### 7. **User Feedback**

* **Toast Notifications**: Receive success or error messages for various actions such as adding, updating, or deleting users.

### 8. **Roles and Permissions**

* **Role Selection**: The system supports multiple roles per user and allows role filtering.
* **Searchable Role List**: Admins can filter roles by name, and a toggle button can expand the list of roles if there are more than five.