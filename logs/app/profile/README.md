# User Profile Management System

This **User Profile Management System** allows users to manage their personal information, emergency contacts, and legal documents (such as NDAs). The system is designed to provide a simple, tabbed interface for updating and viewing profile data, with forms for handling contact information and document uploads.

## Key Features

### 1. **Profile Information Management**

* **Account Information**: Users can update their **username** and **email address**.
* **Submission Handling**: Once the user updates their account information, the changes are saved, and the page refreshes to display the updated details.
* **Toast Notifications**: Success or error notifications are displayed after submitting the changes.

### 2. **Emergency Contact Management**

* **Emergency Contact Form**: A form to allow users to update their **primary and secondary emergency contacts**, including:

  * **Primary Contact Name**: The name of the primary contact.
  * **Mobile Number**: The mobile number of the primary and secondary contacts.
  * **Relationship**: The relationship of the primary and secondary contacts to the user.
  * **Remarks**: Optional remarks about the emergency contacts.
* **Validation**: Ensures that the mobile numbers are numeric and properly formatted.
* **Submission Handling**: Once the user submits the form, the data is saved, and the page is refreshed to show the updated emergency contact details.
* **Toast Notifications**: Notifies the user of successful or failed submissions.

### 3. **NDA Document Upload**

* **NDA Upload Form**: Allows users to upload a **Non-Disclosure Agreement (NDA)** document.

  * **File Input**: Users can select a PDF file to upload.
  * **Document View**: After uploading, the system provides a link to view the uploaded NDA document.
* **Submission Handling**: The file is uploaded to the server, and the page is refreshed to display the current NDA document if it exists.
* **Toast Notifications**: Success or error notifications inform the user about the upload status.

### 4. **Tabbed Navigation**

* The profile page uses **tabs** to separate different sections:

  * **Emergency Contacts**: Manage emergency contact information.
  * **NDA Documents**: Upload and view the NDA document.
  * **Account Information**: Update the user’s account details (username and email).

### 5. **Data Validation and Feedback**

* **Form Validation**: The forms are validated on submission to ensure that all necessary fields are filled correctly (e.g., mobile numbers should be numeric).
* **Loading States**: The submit button is disabled during the submission process to prevent duplicate submissions.
* **Real-Time Feedback**: The system uses **toast** notifications to provide feedback after each action, such as saving changes or uploading documents.