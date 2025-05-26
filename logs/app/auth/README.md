# Authentication Logs Management System

This component allows administrators to manage and monitor authentication logs, add commands to rule groups, and clean up old logs based on time periods. It also supports searching and filtering logs, adding entries to rules, and bulk operations like deleting selected logs or matching commands.

## Key Features:

### 1. **Authentication Logs Table**

* **Log Viewing**: Displays a table of authentication logs, with options for searching, filtering, and pagination.
* **Log Selection**: Supports selecting individual or multiple logs for actions like deletion or rule management.
* **Log Entry Details**: View detailed information about each log entry, including parsed data and matched commands.

### 2. **Searching and Filtering**

* **Search**: Logs can be searched based on text input, with debounced search functionality for efficient querying.
* **Host Filtering**: Select logs from specific devices or "all devices".
* **Rule Group Filtering**: Filters logs based on associated rule groups.
* **Command Filtering**: Allows logs to be filtered by specific rules and matched commands.

### 3. **Bulk Operations**

* **Bulk Log Deletion**: Select multiple logs and delete them in bulk, or delete logs based on a specific time period (e.g., delete logs older than 30 days).
* **Export Logs**: Export authentication logs to Excel for offline analysis.
* **Add Command to Rule**: Allows the addition of specific commands from authentication logs to predefined rule groups for further monitoring.

### 4. **Command Matching and Alerts**

* **Command Matching**: Detect and match commands from logs to rule-based alerts. Once a match is found, a toast notification informs the user, and the matched commands are displayed.
* **Alert Evaluation**: Trigger alert evaluations with detailed results for debugging and validation of alert conditions.

### 5. **Time-Based Log Deletion**

* **Delete Logs by Time Period**: Delete logs that are older than a specified duration (e.g., 1 day, 7 days, 30 days).
* **Confirm Deletion**: A confirmation dialog is shown before performing time-based deletion to prevent accidental data loss.

### 6. **User Interface (UI) Components**

* **Popovers and Dropdowns**: Used for selecting hosts, rules, and rule groups for filtering logs.
* **Dialogs**: Include a modal for viewing log entry details, adding commands to rules, and confirming log deletions.
* **Badges**: Display selected filter criteria (e.g., selected hosts and rule groups).
* **Pagination**: Control pagination of logs to efficiently manage large sets of data.

## Usage

### 1. **Managing Logs**

* View logs with information like timestamp, username, log entry, and matched commands.
* Filter logs by host, rule group, or rule.
* Search for logs using a search bar.
* Select multiple logs for bulk operations such as deletion or exporting.

### 2. **Exporting Logs**

Export logs to **Excel** for further analysis. This is especially useful for audits or archiving purposes.

### 3. **Adding Commands to Rule Groups**

* Open the **Add to Rule** dialog to add commands from logs to rule groups for further monitoring.
* This helps integrate real-time log insights with your monitoring and automation systems.

### 4. **Deleting Logs**

* Delete logs based on selected time periods or manually select logs for deletion.
* Deletion is permanent and cannot be undone, so confirmation dialogs ensure users are aware before taking action.