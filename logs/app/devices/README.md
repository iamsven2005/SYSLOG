# Device Management Dashboard

This feature provides a comprehensive interface for managing devices within the system. It allows users to view device details, monitor real-time status, and perform actions such as adding, editing, and deleting devices. Additionally, users can validate IP addresses, handle bulk actions, and import/export device data.

## Key Features:

### 1. **Device Management Table**

* **View Devices**: Displays a list of devices in a table format, showing key information such as device name, IP address, MAC address, and status.
* **Real-Time Status Indicator**: Shows whether each device is online or offline using a **DeviceStatusIndicator** component.
* **Pagination and Search**: Supports pagination and search functionality for filtering devices based on name, IP address, etc.
* **Device Actions**: Allows actions like **Edit**, **Delete**, and **View** for each device in the table.

### 2. **Device Status Indicator**

* **Online/Offline Badge**: Displays a badge with "Online" or "Offline" status, using green or red badges for visual indication.
* **Connecting State**: Displays a "Connecting..." badge if the device's connection status is being updated.

### 3. **Device Editing**

* **Add Device**: Opens a modal to add a new device, including fields for name, IP address, MAC address, password, and notes.
* **Edit Device**: Opens a modal to edit existing device information, allowing updates to device details.
* **IP Address Validation**: Validates if the IP address is already assigned to another device and suggests available IPs within the same subnet.

### 4. **Device Deletion**

* **Delete Device**: Allows devices to be deleted after a confirmation prompt.
* **Bulk Deletion**: Enables users to select multiple devices and delete them in bulk.

### 5. **Import/Export Devices**

* **Export Devices**: Users can export the list of devices to an Excel file.
* **Import Devices**: Allows the import of device data from an Excel file, with a preview of the data before committing the import.
* **Template Download**: Provides an option to download a template for importing device data.

### 6. **IP Address Suggestions**

* **IP Suggestions**: When adding or editing a device, if an IP address is already assigned, the system suggests available IPs within the same subnet.
* **Searchable IPs**: Suggested IPs can be filtered to make selection easier.

### 7. **Password Management**

* **Password Generation**: Generates random passwords for devices with an option to display or hide the password.

### 8. **Device Actions**

* **Bulk Update**: Allows bulk selection of devices and performing actions like **Delete** or **Update**.
* **Device Details**: Clicking on a device provides detailed information, such as the device’s status, users assigned to it, and more.

## Usage

### Device Management

* **View Devices**: The table lists all devices with real-time status indicators. You can search and filter devices by various fields.
* **Add/Edit Devices**: Add new devices or update existing ones through modal forms.
* **Delete Devices**: Delete devices individually or in bulk with confirmation.

### Export and Import

* **Export Devices**: Export device data in Excel format for offline use.
* **Import Devices**: Import device data from an Excel file, with a preview feature before committing the data.

### IP Address Management

* **Validate IPs**: While adding or editing a device, the system checks for IP conflicts and suggests available IPs from the same subnet.

### Password Generation

* **Generate Passwords**: Automatically generate secure passwords for devices, and manage their visibility in the form.

