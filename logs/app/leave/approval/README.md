# Leave Approval Dashboard

The **Leave Approval Dashboard** is a comprehensive solution for managing pending employee leave requests. It allows administrators to approve or reject leave requests with the option to add comments for each action. The dashboard provides real-time updates on pending leave requests and presents various UI elements for enhanced user experience.

## Key Features

### 1. **Leave Approval and Rejection**

* **Approve/Reject Requests**: Admins can approve or reject leave requests directly from the dashboard.
* **Comments**: When approving or rejecting a leave request, admins can add comments for clarity and communication.
* **Dynamic Update**: Once an action is performed (approve/reject), the UI dynamically updates, removing the processed leave request from the list.
* **Leave Type Badges**: Display badges indicating the type of leave, such as "Full Day", "Morning", or "Afternoon", for each pending request.

### 2. **User Interface and Experience**

* **Dialog for Actions**: A dialog opens to confirm the leave approval or rejection, showing all the relevant details of the leave request.
* **Feedback on Actions**: Toast notifications provide real-time feedback to the admin on the success or failure of their actions.
* **Empty State**: If no pending leaves are available, a message will display, informing the user that there are no pending requests.

### 3. **Real-Time Data Fetching and Processing**

* **Fetching Pending Leaves**: The **LeaveApprovalDashboard** component fetches pending leave applications from the database using the `getPendingLeaves` function.
* **Formatted Leave Data**: The fetched data is formatted and passed to the client-side component for rendering, which includes details like user name, leave type, and leave reason.

### 4. **Page-Level Integration**

* **SEO Metadata**: The page includes metadata for SEO purposes, with appropriate titles and descriptions for better accessibility and search engine optimization.
* **Dynamic Rendering**: The leave approval dashboard is rendered with real-time data to keep the admin interface updated.

## Components

### **1. `LeaveApprovalDashboardClient.tsx`**

The **LeaveApprovalDashboardClient** component is the client-side part of the dashboard, allowing admins to approve or reject leave requests.

#### Key Features:

* Displays a list of pending leave applications with options to approve or reject each request.
* Handles dynamic updates when a leave request is approved or rejected.
* Provides the ability to add comments for each approval/rejection action.
* Displays different badges for leave types (Full Day, Morning, Afternoon).
* Provides a feedback mechanism with toast notifications.

### **2. `LeaveApprovalDashboard.tsx`**

The **LeaveApprovalDashboard** component is the server-side counterpart, fetching pending leave applications from the database and formatting the data for use in the client component.

#### Key Features:

* Fetches pending leave applications from the database.
* Formats the fetched data with details such as user name, leave type, and reason.
* Passes the formatted data to the client-side component for rendering.

### **3. `page.tsx (leave approval)`**

The **LeaveApprovalPage** component serves as the main entry point, rendering the **LeaveApprovalDashboard** component and managing page metadata.

#### Key Features:

* Displays the **LeaveApprovalDashboard** with a heading and appropriate styling.
* Configures metadata for SEO optimization, including the page title and description.
