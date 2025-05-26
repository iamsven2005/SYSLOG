# User Activity Dashboard

The **User Activity Dashboard** allows administrators to view and analyze user behavior across different pages of the application. It features charts to visualize activity trends and tables to display detailed user activity logs. The dashboard also supports data export to Excel, making it easier to share or archive activity data.

## Key Features

### 1. **User Activity Visualization**

* **UserActivityChart**: This component visualizes user activity data through two distinct views:

  * **Timeline View**: A line chart displaying user login counts over time. Users can select different time ranges (7, 14, 30, or 90 days) to view login trends.
  * **Page Distribution View**: A pie chart showing how user activity is distributed across different pages of the application.
  * **Select Time Range**: Users can choose from predefined time ranges (7, 14, 30, 90 days) to filter the data displayed on the chart.
  * **Tooltip**: Interactive tooltips display detailed information when hovering over points in the chart (e.g., date and login count for the timeline, or percentage for each page in the distribution).

### 2. **User Activity Logs Table**

* **UserActivityTable**: Displays a paginated table of user activity logs, with details such as:

  * **Activity ID**: Unique identifier for each activity record.
  * **User ID and Username**: The ID and name of the user performing the activity.
  * **Page Visited**: The page the user visited.
  * **Login Time**: The exact time the user logged in.
* **Pagination**: Users can navigate between pages of data, with pagination controls to move to the previous/next page.
* **Export to Excel**: Administrators can export the displayed activity data to an Excel file using the **Export to Excel** button. This functionality uses the **XLSX** library to generate a formatted Excel file.

### 3. **Backend Integration**

* **Data Fetching**: The page fetches user activity logs and analytics data from the backend. This includes user logins, pages visited, and other activity details.
* **Pagination Handling**: Data is fetched with pagination support, ensuring efficient data retrieval even with large datasets.
* **Activity Log**: The system logs user activity and provides real-time updates on activity trends.

### 4. **User Access Control**

* **Access Permissions**: The page checks if the user has the necessary permissions to access the `/online` route. If the user is unauthorized, they are redirected to a "not found" page.