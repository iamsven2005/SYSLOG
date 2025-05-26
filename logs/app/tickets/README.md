# Support Ticket Management System

This system allows users to create, view, and manage support tickets. The system includes capabilities for file attachments, priority setting, ticket assignment, and detailed views for ticket status, resolution times, and assignees. It integrates user authentication and role-based access, providing an efficient solution for tracking and managing support tickets.

## Key Features

### 1. **New Ticket Form**

* **Ticket Creation**: Users can create new support tickets by filling in the following fields:

  * **Title**: A brief summary of the issue.
  * **Description**: A detailed explanation of the issue.
  * **Priority**: Set the priority (Low, Medium, High, Critical).
  * **Assign To**: Assign the ticket to an available user (Admins can assign any user).
  * **Related Device**: Link the ticket to a relevant device.
  * **File Attachments**: Upload files related to the ticket (e.g., screenshots, logs).
* **Form Validation**: Ensures that the title and description are filled in before submission.

### 2. **Ticket Table**

* **View and Filter Tickets**: A table that displays all tickets, with filtering options for:

  * **Ticket Status**: Open, In Progress, Resolved, Closed.
  * **Ticket Priority**: Low, Medium, High, Critical.
  * **Search**: Search tickets by title or description.
* **Pagination**: Navigate through large sets of tickets with pagination controls.
* **Ticket Details**: View ticket details, including the assignee, status, priority, and attachments.

### 3. **Attachment List**

* **Manage Attachments**: Display a list of attachments for each ticket.

  * **Download**: Users can download attachments by clicking on them.
  * **Delete**: Only admins or the original uploader can delete an attachment. A confirmation dialog ensures this action is intentional.
  * **File Type Icons**: Visual icons based on the MIME type (e.g., image, PDF).

### 4. **File Upload**

* **File Upload Component**: Allows users to upload files to tickets or comments via drag-and-drop or file input.

  * **Multiple File Support**: Supports multiple files to be uploaded simultaneously.
  * **Size Limit**: Each file is limited to a maximum of 10MB.
  * **Progress Feedback**: Users receive real-time feedback on upload progress and successful uploads.

### 5. **Ticket Statistics**

* **Ticket Overview**: Admins can view overall ticket statistics, including:

  * **Total Tickets**: The total number of tickets in the system.
  * **Tickets Created This Week**: The number of tickets created within the current week.
  * **Average Resolution Time**: The average time taken to resolve a ticket.
  * **Status Breakdown**: A breakdown of tickets by their current status (Open, In Progress, Resolved, Closed).
  * **Priority Breakdown**: A breakdown of tickets by their priority level.
  * **Top Assignees**: Displays the top assignees and their resolved tickets.
  * **Recent Tickets**: Shows the most recent tickets created, with their status and priority.

### 6. **User Authentication and Role-Based Access**

* **Admin and User Roles**: Administrators can assign tickets to users and set priorities, while regular users can only view and create tickets.
* **Permission Control**: The system ensures that only authorized users can access certain features, such as ticket creation, file uploads, and statistics.

### 7. **Ticket Actions**

* **View, Edit, and Delete Tickets**: Admin users have the ability to edit or delete any ticket, while regular users can only edit or delete their own tickets.
* **Ticket Assignment**: Admin users can assign tickets to other users, with the ability to filter tickets by assignee.