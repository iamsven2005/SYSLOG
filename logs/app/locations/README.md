# Location Management System

The **Location Management System** enables administrators to manage locations within the system. It includes a table for displaying, filtering, and managing location data, as well as functionalities for adding, editing, deleting, and bulk deleting locations. The system also includes a security feature to ensure that only authorized users can access the location management interface.

## Key Features

### 1. **Location Table Management**

* **CRUD Operations**: The system supports creating, reading, updating, and deleting locations directly from the table.

  * **Add Location**: Admins can add a new location with details such as code, name, region, URL, currency, and remarks.
  * **Edit Location**: Existing locations can be edited by admins.
  * **Delete Location**: Admins can delete a location, and the deletion is logged for audit purposes.
  * **Bulk Delete**: Multiple locations can be selected for batch deletion.

* **Search and Filter**: Users can filter locations based on various criteria such as code, name, and region.

* **Pagination**: The table supports pagination to handle large datasets efficiently. Page size and navigation are dynamically adjustable.

* **Responsive UI**: The layout is designed to work well for both desktop and mobile views, with a user-friendly interface for adding, editing, and deleting locations.

### 2. **Location Upload**

* **Uploads Page**: The **UploadsPage** component provides the interface for location uploads. It checks user permissions before allowing access:

  * **Permission Check**: Uses the `allowed("/locations")` function to ensure that the user has access to the locations page. If the user is unauthorized, they are redirected to a "not found" page.
  * **Render Locations Table**: If the user has permission, the **LocationsTable** component is rendered for managing location data.

### 3. **Location Management Backend**

* **Server-Side Functions**:

  * **getLocations**: Retrieves a list of locations with pagination and optional search filters.
  * **addLocation**: Adds a new location to the database and logs the activity.
  * **updateLocation**: Updates location details and propagates changes to any affected users.
  * **deleteLocation**: Deletes a location from the database and removes it from any associated users.
  * **deleteMultipleLogs**: Allows for deleting multiple locations at once based on their IDs.

* **Revalidation**: After changes are made (like adding, updating, or deleting a location), the `revalidatePath` function ensures that related pages (e.g., `/locations` and `/logs`) are updated to reflect the changes.

* **Activity Logging**: Every CRUD operation is logged for audit purposes, providing transparency on location management activities.

### 4. **Security and Permissions**

* **Role-Based Access**: The system ensures that only authorized users (typically admins) can add, edit, or delete locations.
* **Permission Checks**: Access to the locations management page is controlled through the `allowed` function, which checks if the current user has the necessary permissions.