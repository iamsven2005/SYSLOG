# Team Management System

This system allows administrators to create, edit, and manage teams within an organization. It provides forms for creating and editing teams, including fields for team leaders, members, and locations. The system also includes features for searching, filtering, and deleting teams, as well as viewing detailed information about each team.

## Features

### 1. **Add Team**

* **AddTeamForm**: A form for adding a new team, with fields for:

  * **Team Name**: The name of the team.
  * **Sequence**: A numerical sequence to represent the order of the team.
  * **Remarks**: Optional remarks about the team.
  * **Description**: An optional description of the team.
  * **Leaders**: A multi-select field to assign team leaders.
  * **Members**: A multi-select field for adding team members.
  * **Locations**: A multi-select field for selecting team locations.

### 2. **Edit Team**

* **EditTeamForm**: A form to edit an existing team's details. It pre-populates with the current team's data, and allows administrators to modify the following:

  * **Team Name**
  * **Sequence**
  * **Remarks**
  * **Description**
  * **Leaders**
  * **Members**
  * **Locations**

### 3. **Teams Table**

* **TeamsTable**: Displays a table of existing teams with the following features:

  * **Search**: Allows searching teams by name, sequence, description, or remarks.
  * **Filtering**: Search for teams by leaders, members, and locations.
  * **Actions**: Includes buttons for editing and deleting teams.
  * **Delete Confirmation**: A dialog box to confirm team deletion.

### 4. **Team CRUD Operations**

* **Create Team**: Allows administrators to create new teams.
* **Edit Team**: Provides an interface to modify team details.
* **Delete Team**: Allows teams to be deleted with a confirmation prompt.
* **Team Details**: View detailed information about each team, including leaders, members, and locations.

### 5. **User and Location Management**

* **MultiCombobox**: Custom component used for selecting users and locations for the team.

  * Users: Select team leaders and members from a list of available users.
  * Locations: Assign team locations from a list of locations.

### 6. **Real-Time Feedback**

* **Toast Notifications**: Displays success and error messages for actions like adding, updating, or deleting teams.

### 7. **Form Validation**

* **React Hook Form**: Handles form state and validation.
* **Zod**: Used for schema-based validation to ensure correct data format.

### 8. **Access Control**

* **Permission Check**: Ensures that only authorized users can create or edit teams. If the user does not have access, they are redirected to a "not found" page.