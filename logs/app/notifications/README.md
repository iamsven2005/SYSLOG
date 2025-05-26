# Notification Management System

The **Notification Management System** enables users and administrators to manage notifications within an application. Users can view, mark as read, and filter notifications, while admins have additional capabilities to create, update, and delete notifications. This system provides both client-side and server-side functionality for managing notifications across the application.

## Key Features

### 1. **User Notification Management**

* **View Notifications**: Users can view their notifications in a list format.
* **Mark as Read**: Users can mark notifications as read, which updates the notification state and reflects it in the backend.
* **Search Notifications**: Users can filter notifications based on search terms.
* **Filter by Status**: Users can filter notifications by read/unread status and importance.
* **Display Important Notifications**: Allows users to easily distinguish important notifications from others.

### 2. **Admin Notification Management**

* **Create Notifications**: Admins can create new notifications for users, including setting expiry dates and marking them as important.
* **Update Notifications**: Admins can update an existing notification, modifying details such as the content or expiration.
* **Delete Notifications**: Admins have the ability to delete notifications that are no longer needed.
* **View All Notifications**: Admins can view all notifications, including read/unread counts and other analytics.

### 3. **Search and Filter Functionality**

* **Search**: Both users and admins can search notifications by title or content.
* **Filter by Importance**: Users and admins can filter notifications by important or regular status.
* **Tab Views**: Notifications are grouped into tabs for easy access: "All", "Unread", and "Important".

### 4. **User Interface**

* **Tabbed View for Notifications**: A clean and organized tab-based interface that displays notifications in categories like "All", "Unread", and "Important".
* **Interactive Notification List**: Notifications are rendered dynamically, allowing users and admins to interact with each notification (mark as read, delete, etc.).
* **Dialog for Editing Notifications**: Admins can open a dialog to update the content of a notification.

### 5. **Backend Integration (Server-Side Functions)**

* **CRUD Operations for Notifications**: Functions like `createNotification`, `updateNotification`, and `deleteNotification` handle the creation, update, and deletion of notifications, ensuring that only authorized users (admins) can perform these actions.
* **Mark Notifications as Read**: The `markNotificationAsRead` function is used to update the notification state, marking them as read for the user.
* **Role-Based Access**: Admins can manage all notifications, while regular users only have access to notifications relevant to them.

### 6. **Notification Logs and Activity Tracking**

* **Log Activity**: Every change to a notification, including creation, update, and deletion, is logged for auditing and tracking.
* **Path Revalidation**: After modifying notifications, the path `/logs` is revalidated to ensure that data integrity is maintained and the most recent information is displayed.