# **Email Template Management System Overview**

This system allows the creation, modification, deletion, and sending of email templates. It includes user assignment to templates, live preview of templates, and sending personalized emails. The system leverages both client-side React components and server-side operations to provide a seamless experience for managing templates.

---

### **Key Features**

#### **1. Email Template CRUD Operations**

* **Create Email Template**: Allows the creation of new email templates with placeholders and assigned users.
* **Edit Email Template**: Provides an interface for editing the template's name, subject, body, and user assignments.
* **Delete Email Template**: Deletes an existing template, ensuring it’s removed from the database.
* **Send Email Using Template**: Sends a personalized email based on a template to a list of users.

#### **2. User Assignment**

* Users can be assigned to a template via a multi-select interface.
* Once assigned, these users will be included in the template's details, and notifications can be sent to them using the template.

#### **3. Live Preview**

* A live preview of the email body is rendered in real-time as the user fills out the subject and body fields. Placeholders such as `{{username}}` are replaced with mock data (e.g., "John Doe").

#### **4. Role-Based Access Control**

* Only authorized users (e.g., admins) can create, update, or delete templates.
* Email templates can be linked to specific users based on roles, ensuring proper permissions.

#### **5. Real-Time Updates**

* Changes to templates, including updates to users or content, are reflected in real-time. Notifications (via toast messages) inform users about successful or failed operations.

---

### **Components Breakdown**

#### **1. `feedback-actions.ts`**

Handles server-side actions related to the feedback system, including submitting feedback, fetching received/sent feedback, and managing feedback status (read/unread).

#### **2. `EmailTemplateTable`**

A React component that displays a table of all email templates. It supports viewing, editing, deleting, and previewing templates.

##### Key Functions:

* **`fetchTemplates`**: Fetches templates from the backend.
* **`handleDeleteTemplate`**: Deletes a selected template after confirmation.
* **`formatDate`**: Formats date strings for display.

#### **3. `EmailTemplateForm`**

A form component for creating or editing email templates. It includes fields for name, subject, body, and a multi-select interface for assigning users.

##### Key Features:

* **Form Validation**: Uses `Zod` and `React Hook Form` for validation.
* **Live Preview**: Displays a live preview of the email with dynamic placeholder rendering.
* **User Assignment**: Allows for assigning users to a template.

#### **4. `email-template-actions.ts`**

Provides server-side functions for managing email templates, including creating, updating, deleting, and sending templates.

##### Key Functions:

* **`createEmailTemplate`**: Creates a new template.
* **`updateEmailTemplate`**: Updates an existing template.
* **`deleteEmailTemplate`**: Deletes a template.
* **`sendEmailWithTemplate`**: Sends a personalized email to a list of users based on the template.

#### **5. `Page.tsx` (Template Detail)**

This page fetches and renders the details of a specific email template based on its ID. It also provides options to edit or view the template.

#### **6. `client.tsx` (Template Details)**

Displays details for a specific email template and allows toggling between "View" and "Edit" modes. It uses `EmailTemplateForm` for editing.

##### Key Features:

* **Fetch Template**: Fetches template details based on the `id` from the route.
* **Switch Between Modes**: Allows toggling between viewing and editing the template.
* **Toast Notifications**: Provides success/error feedback on actions.

#### **7. `useSSE.ts`**

Handles Server-Sent Events (SSE) for real-time updates, such as notifying users about template status or changes in user assignments.

---

### **Example Code**

#### **Creating a New Email Template**

```tsx
import { createEmailTemplate } from './email-template-actions';

const handleCreateTemplate = async (formData) => {
  try {
    await createEmailTemplate(formData);
    toast.success('Email template created successfully!');
  } catch (error) {
    toast.error('Error creating email template.');
  }
};
```

#### **Editing an Existing Template**

```tsx
import { updateEmailTemplate } from './email-template-actions';

const handleUpdateTemplate = async (templateId, formData) => {
  try {
    await updateEmailTemplate(templateId, formData);
    toast.success('Email template updated successfully!');
  } catch (error) {
    toast.error('Error updating email template.');
  }
};
```

#### **Deleting a Template**

```tsx
import { deleteEmailTemplate } from './email-template-actions';

const handleDeleteTemplate = async (templateId) => {
  try {
    await deleteEmailTemplate(templateId);
    toast.success('Email template deleted successfully!');
  } catch (error) {
    toast.error('Error deleting email template.');
  }
};
```

---

### **Conclusion**

The **Email Template Management System** provides a comprehensive solution for managing email templates, allowing users to create, edit, delete, and send personalized emails based on templates. It integrates role-based access control, real-time updates, and a user-friendly UI for managing templates and user assignments.
