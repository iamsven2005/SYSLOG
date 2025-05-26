# Feedback System

The **Feedback System** allows users to submit feedback to managers or admins, track sent and received feedback, and manage the feedback status. Managers and admins can view and mark feedback as read, while regular users can only submit and view their sent feedback.

---

### Key Features

#### **1. Feedback Submission**

* **Submit Feedback**: Regular users can submit feedback to one or more managers or admins. The feedback includes a subject, message, and recipients.
* **Dynamic Feedback Form**: The feedback form allows users to choose recipients (managers or admins) and enter a message.
* **Feedback Status**: Once feedback is sent, users are notified of the submission status.

#### **2. Role-Based Access**

* **Managers/Admins**: Can view all feedback sent to them, mark feedback as read, and view feedback sent by others.
* **Regular Users**: Can only submit feedback and view their sent feedback.

#### **3. Tabs Interface**

* **Overview Tab**: Provides an overview of the feedback system.
* **New Feedback Tab**: Allows users to create new feedback submissions.
* **Sent Feedback Tab**: Displays feedback that the user has submitted.
* **Received Feedback Tab**: Only visible to managers and admins. It shows feedback sent to them and allows them to mark feedback as read.

#### **4. Real-Time Feedback Management**

* **Real-Time Marking of Read Feedback**: Managers and admins can mark feedback as read, and this action is immediately reflected in the UI with a visual indicator.
* **Dynamic Feedback Lists**: Both sent and received feedback lists are dynamically updated as users interact with them.

---

### Components Overview

#### **1. `feedback-actions.ts` (Server-Side)**

Handles server-side logic for managing feedback, including submitting, retrieving, and marking feedback as read.

##### Key Functions:

* **`getManagers`**: Fetches users with the "manager" role to be selected as feedback recipients.
* **`submitFeedback`**: Submits a feedback entry with the provided details (subject, message, recipients).
* **`getSentFeedback`**: Retrieves all feedback submitted by the current user.
* **`getReceivedFeedback`**: Fetches feedback received by the current user (restricted to managers/admins).
* **`markFeedbackAsRead`**: Marks feedback as read for the recipient.

#### **2. `feedback-form.tsx` (Client-Side)**

A client-side React component for submitting feedback. It allows users to select managers, enter a subject, and provide a message.

##### Key Features:

* **Manager Selection**: Fetches the list of available managers using `getManagers`.
* **Feedback Fields**: Includes fields for the subject, message, and recipients.
* **Feedback Submission**: Submits the data via the `submitFeedback` function.
* **Feedback Status**: Displays loading indicators and success messages using `toast` notifications.

#### **3. `feedback-page.tsx` (Client-Side)**

Manages the feedback system interface, allowing users to view, submit, and manage feedback. This includes role-based rendering to restrict access to certain tabs (e.g., "Received Feedback" for managers/admins).

##### Key Features:

* **Role-Based Rendering**: Displays the "Received" tab only for managers and admins.
* **Tabs**: Allows users to switch between "Overview", "New Feedback", "Sent Feedback", and "Received Feedback" tabs.
* **Feedback Management**: Includes functionality to view sent feedback and mark received feedback as read.
* **Loading State**: Provides loading indicators while fetching feedback.

---

### Example Code Snippets

#### **Submitting Feedback**

```tsx
import { submitFeedback } from './feedback-actions';

const handleSubmit = async (formData) => {
  try {
    await submitFeedback({
      subject: formData.subject,
      message: formData.message,
      recipients: formData.recipients, // Array of recipient IDs
    });
    toast.success('Feedback submitted successfully!');
  } catch (error) {
    toast.error('Failed to submit feedback.');
  }
};
```

#### **Rendering the Feedback Form**

```tsx
import FeedbackForm from './feedback-form';

const FeedbackPage = () => (
  <div>
    <h1>Submit Feedback</h1>
    <FeedbackForm onSuccess={() => toast.success('Feedback sent!')} />
  </div>
);
```

#### **Viewing and Marking Feedback as Read**

```tsx
import { markFeedbackAsRead } from './feedback-actions';

const handleMarkAsRead = async (feedbackId) => {
  try {
    await markFeedbackAsRead(feedbackId);
    toast.success('Feedback marked as read.');
  } catch (error) {
    toast.error('Failed to mark feedback as read.');
  }
};
```

---

### Notes

* **Permissions**: Managers and admins can view and manage all feedback, while regular users can only manage their own feedback.
* **Real-Time Updates**: The feedback system supports real-time notifications for new feedback submissions and status updates.
* **Role-Based Navigation**: Only users with the "manager" or "admin" role can access the "Received Feedback" tab, making the system secure.

---

### Conclusion

This **Feedback System** allows for seamless communication between users and managers. By utilizing role-based access control and real-time updates, the system ensures that users and managers can efficiently manage feedback with proper status tracking. The system also provides a user-friendly interface for managing feedback submissions and responses, with support for toast notifications, dynamic filtering, and pagination.
