# LDAP User Management System

This system provides an interface to manage LDAP users stored in a PostgreSQL database using Prisma ORM. It offers functionality for retrieving, displaying, searching, and exporting LDAP users. Admins can also view user statistics, including active, disabled, and recently logged-in users.

## Key Features

### 1. **LDAP User Management**

* **View LDAP Users**: Admins can view a paginated list of LDAP users with detailed information such as `userPrincipalName`, `sAMAccountName`, `accountExpires`, and more.
* **Search and Filter**: Admins can search for LDAP users by fields such as `sAMAccountName`, `displayName`, and `userPrincipalName`, with case-insensitive support for better search accuracy.
* **Export to Excel**: Admins can export LDAP user data to an Excel file for further analysis or backup.
* **Account Status**: Displays the account status for each LDAP user (Active, Disabled, Locked Out) based on the `userAccountControl` flags.

### 2. **LDAP User Statistics**

* **Active Users**: Retrieve the total number of active users.
* **Disabled Users**: Retrieve the total number of disabled users.
* **Recently Logged In Users**: Fetch users who have logged in within the last 30 days.

### 3. **Pagination and Debounced Search**

* **Pagination**: The system supports pagination to handle large datasets efficiently.
* **Debounced Search**: The search functionality is debounced to avoid unnecessary re-fetching and ensure smooth user experience.

## Key Components

### **1. `LdapActions.ts` (Backend)**

Contains server-side functions for fetching and processing LDAP user data, including retrieving a list of users, user statistics, and filtering users by different fields.

#### Key Functions:

* `getLdapUsers`: Fetches a paginated list of LDAP users based on a search query.
* `getLdapUserById`: Retrieves an individual LDAP user by their ID.
* `getLdapUserStats`: Fetches statistics for LDAP users, including active, disabled, and recent logins.

### **2. `LdapUsersTable.tsx` (Frontend)**

This component displays a table of LDAP users with features for searching, filtering, pagination, and exporting to Excel. It uses the `getLdapUsers` function to fetch LDAP data based on the search query and current page.

#### Key Features:

* **Search & Filter**: Users can filter by fields like `sAMAccountName`, `displayName`, and `userPrincipalName`.
* **Account Status**: Displays account status as "Active", "Disabled", or "Locked Out".
* **Pagination**: Allows pagination of results for large datasets.
* **Export to Excel**: Export the filtered LDAP user data to an Excel file for reporting.

### **3. `LdapPage.tsx` (Frontend)**

This page component manages access control and displays the `LdapUsersTable` for authorized users. Unauthorized users are redirected to a "not found" page.

#### Key Features:

* **Access Control**: Verifies if the user is authorized to view LDAP user data using the `allowed` function.
* **Displays Table**: If authorized, the `LdapUsersTable` is rendered to display the user data.

### **4. `utils.ts` (Backend)**

This utility module contains helper functions to manage and process LDAP data, including querying user statistics.

#### Key Functions:

* `getLdapUserStats`: Retrieves statistics about LDAP users, including the number of active users, disabled users, and users who have logged in within the last 30 days.