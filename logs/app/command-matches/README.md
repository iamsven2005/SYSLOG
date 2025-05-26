# Command Match Management System

This component allows users to manage and monitor **command matches** within a system, typically used for security audits or log monitoring. It includes functionalities for viewing, addressing, and deleting command matches, as well as handling bulk actions.

## Key Features:

### 1. **Unaddressed Command Matches**

* **View Details**: Each command match displays key details, such as the rule, command, log entry, timestamp, and any notes.
* **Mark as Addressed**: Users can mark individual matches as "addressed", adding optional notes for documentation.
* **Delete Matches**: Each match can be deleted individually with a confirmation prompt.

### 2. **Bulk Addressing**

* **Select Multiple Matches**: Users can select multiple unaddressed matches and apply a shared note to mark them all as addressed at once.
* **Bulk Delete**: Allows bulk deletion of selected command matches.
* **Confirm Actions**: Bulk actions, such as addressing or deleting, require user confirmation to prevent accidental changes.

### 3. **Addressed Command Matches**

* **View Addressed Matches**: This tab displays a table of all addressed command matches, along with metadata such as when they were addressed and by whom.
* **Unmark as Addressed**: Users can unmark a match as addressed and move it back to the unaddressed state.

### 4. **Command Match Notification**

* **Real-Time Alerts**: If new unaddressed command matches are detected, users are alerted via a notification system, with an option to view them or snooze the notifications.
* **Snooze Options**: Users can snooze notifications for a set time (1, 4, or 8 hours).

### 5. **User Interface**

* **Tabbed Views**: The interface includes three main tabs:

  * **Unaddressed**: Displays individual command match cards for review.
  * **Bulk Address**: Allows users to select multiple command matches and address them in bulk.
  * **Addressed**: Displays addressed matches in a table format with metadata and actions.
* **Card Layout**: Unaddressed command matches are displayed in a card format, making them easy to read and manage.
* **Pagination**: Supports pagination to handle large datasets, allowing users to navigate through multiple pages of command matches.

### 6. **Feedback and Confirmation**

* **Toast Notifications**: Users receive toast notifications for actions such as marking matches as addressed, deleting matches, and bulk addressing.
* **Confirmation Dialogs**: Deleting or unmarking matches involves a confirmation dialog to ensure the user intends to perform the action.

### 7. **Server-Side Actions**

* **API Integration**: The system integrates with server-side actions to handle the actual addressing, deletion, and fetching of command matches from the backend.
* **Action Confirmation**: Each action (address, delete) triggers a backend request, and results are displayed via toast notifications.

## Usage

### 1. **Managing Command Matches**

* **View Unaddressed Matches**: View detailed command match cards and take actions like addressing or deleting them.
* **Bulk Addressing**: Select multiple command matches and address them with a shared note.
* **Addressed Matches**: View the history of addressed command matches, including when they were addressed and by whom.

### 2. **Notification System**

* **Command Match Alerts**: Receive real-time notifications when new command matches are detected, with the option to view them immediately or snooze the notifications.

### 3. **Bulk Operations**

* **Delete Multiple Matches**: Select multiple matches and delete them in bulk after confirming the action.
* **Address Multiple Matches**: Address multiple command matches at once, applying a shared note.