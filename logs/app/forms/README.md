# Form Management System

This system provides an interface for managing forms, including creating, editing, viewing responses, and handling real-time updates for new responses. Users can build custom forms, submit responses, and manage form data. The system supports multiple question types like text, file, radio, checkbox, and dropdown. It also includes features like exporting data to Excel and real-time notifications of new submissions.

## Key Features

### **1. Form Creation & Management**

* **Create Forms**: Allows users to create new forms by adding questions with multiple types such as text, radio, checkboxes, dropdown, and file upload.
* **Edit Forms**: Existing forms can be edited with the ability to modify questions, types, and options.
* **Form Questions**: Supports multiple types of questions, such as text inputs, multiple choice, dropdown, checkboxes, and file uploads.
* **Form Deletion**: Forms can be deleted with confirmation to prevent accidental loss of data.
* **Copy Forms**: Users can duplicate an existing form and modify it to create similar forms with ease.

### **2. Form Response Handling**

* **View Responses**: Displays responses to the form with the ability to switch between summary views (aggregated data) and individual responses.
* **Real-Time Updates**: The system provides real-time notifications when new responses are submitted using Server-Sent Events (SSE).
* **Form Statistics**: Displays the number of responses for each form, allowing users to track engagement.

### **3. Real-Time Updates**

* **Live Response Indicator**: A badge that shows the number of new responses in real-time, providing feedback via notifications.
* **Real-Time Notifications**: Uses SSE to notify users whenever a new response is submitted for a form.

### **4. Export Functionality**

* **Export to Excel**: Allows users to export the list of responses to Excel for further analysis.

### **5. Permissions & Access Control**

* **Role-Based Access Control**: Only authorized users (admins) can create, edit, or delete forms. Regular users can submit responses.
* **Access Control for Form Creation**: Only authorized users can access the form creation page.

---

## Components

### **1. `FileUploader.tsx`**

Handles file uploads for HTML files. The user can either drag and drop a file or click to browse and upload files. The system processes the file and ensures only valid HTML files are accepted.

#### Key Features:

* Drag-and-drop file upload.
* Validates that the file is an HTML file before processing.
* Allows users to import data after selecting the HTML file.

### **2. `FormCard.tsx`**

Displays basic information about a form, including its title, description, and the number of questions and responses. It provides action buttons to view, edit, or delete forms.

#### Key Functions:

* `handleDeleteForm`: Deletes the form after confirmation.
* `handleCopyForm`: Creates a copy of the form for editing.

### **3. `page.tsx` (Form List)**

Displays a list of forms and allows users to search, filter, and sort forms. Admin users can also create new forms.

#### Key Features:

* Search and filter by form title or description.
* Sort forms by newest, oldest, or number of responses.
* Provides an interface to create new forms.

### **4. `ResponsesRealTimeIndicator.tsx`**

Listens for real-time updates when new responses are submitted to a form. It shows a badge with the number of new responses and provides a button to refresh the view.

#### Key Features:

* Real-time response updates.
* Badge with the number of new responses.
* Toast notifications for new responses.

### **5. `SearchAndFilterBar.tsx`**

Allows users to search and filter forms by title, description, and sorting options. It automatically updates the URL query parameters based on the search and sort options.

#### Key Features:

* Search forms by title or description.
* Sort forms by different criteria.
* Updates the URL query with search and sort parameters.

### **6. `useSSE.ts`**

Custom hook to handle Server-Sent Events (SSE) for real-time updates. It allows components to listen for events (e.g., new responses).

#### Key Features:

* Manages the lifecycle of the SSE connection.
* Automatically reconnects on disconnection.
* Handles message and error events.

### **7. `FormBuilder.tsx`**

The main component used for creating and editing forms. It dynamically renders form fields and handles the creation of new forms or updates to existing forms.

#### Key Features:

* Dynamic rendering and ordering of form questions.
* Supports multiple question types (TEXT, RADIO, CHECKBOX, DROPDOWN, FILE).
* Auto-save functionality with debounce.
* Handles form creation and updates.

### **8. `FormViewer.tsx`**

Displays the form for user submission. It validates required fields, handles file uploads, and tracks user input.

#### Key Features:

* Handles various question types including text, file, radio, and checkbox.
* Validates required fields.
* Allows users to submit their responses.

### **9. `question-editor.tsx`**

This component is used for editing individual questions in a form. It supports editing question text, changing question types, and adding/removing options for multiple-choice questions.

#### Key Features:

* Allows editing of the question's text, type, and options.
* Mark questions as required.
* Supports dynamic option generation for question types like RADIO, CHECKBOX, and DROPDOWN.

### **10. `question-view.tsx`**

Renders a form field for answering a question based on its type. Supports different question types like text, radio buttons, checkboxes, dropdowns, and file uploads.

#### Key Features:

* Dynamically handles user input for various question types.
* Displays feedback on required fields.

### **11. `page.tsx` (Form Response Viewer)**

This page displays the form's responses, including aggregated summary data and individual responses.

#### Key Features:

* Displays aggregated response data.
* Allows users to view individual responses grouped by question.
* Real-time updates for new responses.

### **12. `actions.ts`**

Server-side logic for handling form creation, editing, response submission, deletion, and broadcasting updates.

#### Key Functions:

* `createForm`: Creates a new form with nested questions.
* `updateForm`: Updates an existing form and its questions.
* `submitFormResponse`: Submits user responses to the form.
* `deleteForm`: Deletes a form, including all related responses and data.

