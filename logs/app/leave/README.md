# Leave and Holiday Management System

This **Leave and Holiday Management System** provides a comprehensive solution for managing employee leaves and holidays. The system allows users to apply for leaves, view the leave calendar, and track holidays. Admins have additional functionalities for approving/rejecting leave requests, adding/removing holidays, and managing personal reminders.

## Key Features

### 1. **Leave Management**

* **Submit Leave Applications**: Employees can apply for leave by selecting the start and end dates, leave type (Full Day, Morning, Afternoon), and providing a reason.
* **Approve/Reject Leaves**: Admins can approve or reject leave applications, adding comments for each decision.
* **Leave Calendar**: Displays a calendar view of approved leaves, holidays, and personal reminders.
* **Notifications**: Toast notifications are displayed to provide feedback for successful or failed actions, like leave approval or rejection.

### 2. **Holiday Management**

* **Add/Edit Holidays**: Admins can add or edit holiday details (e.g., holiday name, date, recurrence).
* **Delete Holidays**: Admins can remove holidays from the system.
* **Holiday Display**: Holidays are displayed on the leave calendar for easy reference.

### 3. **Personal Reminders**

* **Add/Edit/Delete Reminders**: Employees can add, edit, or delete personal reminders with custom titles, descriptions, and colors.
* **Date Picker**: Users can select the reminder date from a calendar view.
* **Color Coding**: Reminders can be assigned different colors for easy identification.

### 4. **Role-Based Access Control**

* **Admin Functionality**: Admins have access to all features, including managing leave applications, holidays, and reminders.
* **User Functionality**: Regular users can apply for leave, view the leave calendar, and manage their personal reminders.

## Key Components

### **1. `LeaveApprovalDashboardClient.tsx`**

Manages the display and approval of pending leave applications. Allows admins to approve or reject leave requests and provides feedback.

#### Features:

* Displays pending leave applications.
* Provides actions to approve or reject leave with comments.
* Updates the UI dynamically based on actions.

### **2. `LeaveApprovalDashboard.tsx`**

Server-side component that fetches pending leave data and formats it for use in the client component.

#### Features:

* Fetches pending leave applications.
* Passes formatted data to the client-side component for rendering.

### **3. `LeavePage.tsx`**

Displays the Leave Approval Dashboard and the leave calendar, with a tab interface for switching between them.

#### Features:

* Allows switching between leave application form and leave calendar.
* Configures metadata for the page, optimizing SEO.

### **4. `HolidayActions.ts`**

Handles server-side functionality for adding, updating, and deleting holidays, as well as retrieving holiday data.

#### Features:

* CRUD operations for holidays.
* Fetches holidays within a specific date range.

### **5. `ReminderActions.ts`**

Server-side logic for managing reminders associated with a specific user. Includes functions for adding, updating, and deleting reminders.

#### Features:

* CRUD operations for reminders.
* Retrieves reminders by user ID and date range.

### **6. `LeaveApplicationForm.tsx`**

The form component that allows users to apply for leave, including validation and submission to the server.

#### Features:

* Date picker for start and end dates.
* Dropdown for selecting leave type and approver.
* Validation using Zod and React Hook Form.

### **7. `LeaveCalendarClient.tsx`**

Displays a calendar showing leaves, holidays, and reminders, allowing users to search for events and navigate between months.

#### Features:

* Calendar view with leave, holiday, and reminder events.
* Modal dialogs for adding, editing, and deleting events.
* Search functionality for finding events by date, person, or activity.

### **8. `AddLibraryEntryDialog.tsx`**

Allows admins to add a new library entry, including details such as reference number, title, author, and a PDF attachment.

#### Features:

* Form for adding library entries.
* File upload for attaching PDF documents.
* Validation and loading states.

### **9. `ReminderForm.tsx`**

The form component for adding or editing personal reminders with custom colors and date selection.

#### Features:

* Title, date, and description fields.
* Color picker for custom reminder colors.
* Zod validation and React Hook Form for handling submissions.