# Alert Management System

This is an **Alert Management System** designed to help administrators monitor and manage alert conditions and events. It allows users to define, evaluate, and track conditions that trigger alerts, as well as handle the resolution of these alerts.

## Features

### 1. **Alert Condition Management**

* **Create/Edit Alert Condition**:

  * Set up conditions that trigger alerts based on system metrics (e.g., CPU, memory, disk usage).
  * Choose fields and comparators dynamically based on the source table (e.g., `system_metrics`, `auth`, `logs`).
  * Configure numeric or text-based thresholds.
  * Optionally link email notifications to alert conditions.

### 2. **Alert Event Management**

* **Track Triggered Alerts**:

  * View triggered alert events with detailed information (e.g., status, triggered time, and resolution time).
  * Resolve alert events manually with optional resolution notes.
  * Display associated condition details, including the condition’s threshold, source table, time window, and email template.

* **Multi-Resolve**:

  * Resolve multiple alert events in bulk with a single action.

### 3. **Alert Debugging Tools**

* **Alert Debug Panel**:

  * Test and evaluate alert condition logic manually.
  * Toggle extended time window for broader match checks.
  * Toggle actual alert event creation in the database during testing.
  * View debug results, including condition metadata, match counts, reasons for results, and error details.

* **Debug Feedback**:

  * Receive detailed feedback on whether the alert condition was triggered, including sample matches and any errors encountered during evaluation.

### 4. **Dashboard and Statistics**

* **Real-Time Overview**:

  * View the total number of alert conditions, active alerts, resolved alerts, and all-time alerts.
  * Summarize alert condition counts and alert states for quick visibility.

* **Metrics**:

  * Display a breakdown of unresolved and resolved alerts.
  * Track the total number of alerts triggered, providing visibility into system health.

### 5. **CSV Import/Export**

* **Export Alert Conditions**:

  * Export alert conditions to CSV format for easy backup or sharing.
* **Import Alert Conditions**:

  * Import alert conditions from a CSV file, supporting bulk import for efficient configuration.

### 6. **Database Health Monitoring**

* **DatabaseStatusBar**:

  * Provides visibility into the health and status of the backend database, ensuring the system is connected and functioning correctly.

### 7. **Interactive Tables**

* **Alert Conditions Table**:

  * View, edit, and manage alert conditions.
  * Supports CRUD (Create, Read, Update, Delete) operations on alert conditions.
* **Alert Events Table**:

  * View triggered alert events, resolve them, and add resolution notes.
  * Filter based on resolved/unresolved status.


## Usage

### Dashboard Components

* **Alert Conditions Table**: List and manage all alert conditions.
* **Alert Events Table**: Track all triggered alert events.
* **Alert Debug Panel**: A tool for developers to test alert conditions and evaluate if they trigger under specific circumstances.
* **Alert Stats**: Provides an overview of the alert conditions and event statuses.
* **DatabaseStatusBar**: Monitors the backend health of the system.

### Import and Export

* **Export to CSV**: Export alert conditions to CSV for backup or sharing.
* **Import from CSV**: Import alert conditions from a CSV file, making it easier to set up bulk configurations.

### Testing Alerts

Use the **Alert Debug Panel** to manually evaluate alert conditions and simulate the creation of alert events. This tool is helpful during testing and debugging of new alert conditions.