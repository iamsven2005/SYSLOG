# Rules Management System

This system enables administrators to manage rule groups, rules, and commands. It provides an intuitive interface for creating, editing, and deleting rules, as well as assigning email templates to rules. The system also supports bulk importing and exporting of rule data using Excel files, along with pagination, search, and filtering functionalities.

## Key Features

### 1. **Rule Groups and Rules Management**

* **Rule Group Creation**: Create and manage rule groups that can contain multiple rules.
* **Rule Creation**: Add new rules to a group with customizable properties such as:

  * **Name**: The name of the rule.
  * **Description**: An optional description of the rule.
  * **Commands**: A list of commands associated with the rule.
  * **Email Templates**: Assign email templates to rules for automated email notifications.

### 2. **Rules Table**

* **Search and Filter**: Search for rules and rule groups by name or description, with the ability to filter by group and email template.
* **Pagination**: Support for paginated results, allowing easy navigation through large datasets.
* **Rule Group Expansion**: Expand or collapse rule groups to view associated rules and commands.
* **Bulk Actions**: Perform actions like deleting selected rule groups or exporting data via Excel.

### 3. **Excel Import and Export**

* **Export to Excel**: Export rule groups, rules, and commands to an Excel file, including support for nested data (commands within rules within groups).
* **Import from Excel**: Import rules and rule groups from an Excel file, with a preview feature to validate the data before committing.
* **Download Template**: Download an Excel template to structure the data properly for import.

### 4. **Email Template Assignment**

* **Email Template Selector**: Assign email templates to rule groups and rules. This allows for customizable email content when rules are triggered.
* **Template Search**: Users can search and select from available email templates using a searchable dropdown.

### 5. **Actions and Permissions**

* **Edit and Delete Rules**: Users can edit or delete individual rules and rule groups.
* **Confirm Deletions**: Deleting rules or rule groups requires confirmation to prevent accidental deletions.
* **Create and Update**: Modal dialogs are used to create or update rules and rule groups, with form validation to ensure required fields are filled in.

### 6. **User Interface Components**

* **Dialogs and Popovers**: Used for adding, editing, and deleting rules and rule groups.
* **Table**: Displays rule groups and rules in a tabular format with support for inline actions (e.g., edit, delete, expand).
* **Badges**: Used to display the number of rules within a group and the email template assigned to each rule.
* **Command List**: Supports displaying and editing commands associated with each rule.

### 7. **Real-Time Feedback**

* **Toast Notifications**: Success and error messages are displayed after actions such as adding, editing, or deleting rules.
* **Loading States**: Feedback is provided during data fetching, import, and export processes.
