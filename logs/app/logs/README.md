# System Log and Metrics Management System

This **System Log and Metrics Management System** provides administrators with tools to view, filter, and manage system logs, monitor system performance, and analyze resource usage. The system includes features for detecting suspicious activity, managing logs based on time, and exporting log data for further analysis.

## Key Features

### 1. **Log Management and Analysis**

* **Search and Filter Logs**: The system allows users to search for logs using keywords, and filter logs by:

  * **Host**
  * **Action Type** (login, logout)
  * **Rule Groups and Rules**
  * **Resource Usage** (CPU, memory thresholds)

* **Command Matching**: Automatically detects suspicious or predefined command patterns in logs, triggering alerts when matched.

* **Pagination**: Supports pagination to navigate through large sets of logs, with customizable page size.

* **Log Selection for Batch Operations**: Allows users to select logs for batch operations such as **deletion**.

* **Time-Based Log Deletion**: Provides the ability to delete logs older than a specified time period (e.g., 1 day, 7 days, 30 days). Note that deletion is irreversible and may result in the loss of important data.

* **Log Export**: Export selected logs to an Excel file for offline analysis or reporting. Note that the export functionality is limited to the current set of logs and users may need to adjust filters to export specific data.

### 2. **System Metrics Monitoring**

* **Metrics Data Retrieval**: The system fetches various system metrics for monitoring, including:

  * **Device Usage Data**: CPU and memory usage data for devices over a specified time range.
  * **Memory Usage Data**: Memory usage over time, grouped by timestamp and host.
  * **Sensor Data**: System sensor data (e.g., temperature, CPU metrics).
  * **Disk Usage Data**: Disk usage data, grouped by host and disk name.

* **Performance Monitoring**: The system also tracks query performance using a **logging middleware**, recording the time taken for each query.

### 3. **Log Deletion Operations**

* **Delete Logs by Time Period**: The system allows logs to be deleted based on time criteria (e.g., 1 day, 7 days). This feature helps to keep the log database clean by removing old entries.

* **Batch Log Deletion**: Administrators can delete multiple logs at once, either manually selected or based on time criteria.

### 4. **Admin and Permissions Management**

* **Role-Based Access Control (RBAC)**: Certain log management operations (e.g., deletion) are restricted to users with administrative privileges.

* **Permissions**: Permissions for viewing, filtering, and deleting logs are tied to user roles.

### 5. **Activity Logs and Monitoring**

* **Activity Logging**: Every action performed in the log management system (e.g., log creation, deletion) is logged for audit and traceability.

* **Real-Time Log Monitoring**: Consider implementing **websockets** or **Server-Sent Events (SSE)** to provide real-time updates for monitoring logs and metrics.