# Chat Application Features

This feature provides a comprehensive chat interface with enhanced functionality, including group management, messaging, polling, and device management integration. The system supports real-time updates, user interactions, and the creation of group chats with rich features like polls, emojis, and file uploads. Below is a detailed breakdown of the main components:

## Key Features

### 1. **Chat Components**

#### 1.1 **ChatMessages**

* **Real-Time Message Display**: Displays all messages in the selected group, including real-time updates, polls, file attachments, and formatted messages (bold, italics, strike-through, code).
* **Message Editing and Deletion**: Allows users to edit or delete their own messages. Group messages can be grouped by date and segment visually.
* **Search**: Enables users to search for messages within the group by keywords, including highlighting specific messages in the conversation.
* **Poll Support**: Special handling for poll messages, with the ability to vote and view results.

#### 1.2 **ChatInput**

* **Text and File Input**: Users can send plain text messages, upload files, and interact with a variety of input tools, including a calculator dialog, emoji picker, and date picker.
* **Slash Commands**: Supports commands such as `/poll`, `/emoji`, `/calendar`, and `/calculator`, which are dynamically loaded as users type them.
* **Polling**: Allows users to create and vote on polls directly within the chat interface.

#### 1.3 **ChatContainer**

* **Main Container**: The central area where messages are displayed, and interactions like polls and file attachments are rendered.
* **Screenshot Capture**: Users can take screenshots of the chat and copy the image to their clipboard.
* **Import/Export Dialogs**: Supports importing and exporting chat messages in XML format.

### 2. **Group Management**

#### 2.1 **CreateGroupDialog**

* **Group Creation**: Facilitates the creation of new chat groups, including selecting users and roles, and validating group names.
* **User Role Management**: Allows for adding and removing users from groups with roles, ensuring only valid users are part of the group.

#### 2.2 **ManageMembersDialog**

* **Member Management**: Lets admins manage group members, including adding or removing users, assigning roles, and searching users by name or role.
* **Role Filtering**: Users can be filtered by roles, and admins can remove non-creator users.

#### 2.3 **GroupSidebar**

* **Group Overview**: Displays all chat groups, including the latest message, group name, and member roles.
* **Search and Filter**: Allows users to search for groups and filter them by role.
* **Create Group**: Provides a button to launch the `CreateGroupDialog` for creating new groups.

### 3. **Polls and Voting**

#### 3.1 **PollComponent**

* **Poll Display**: Displays poll questions with options and live vote updates. Users can vote on single or multiple options.
* **Real-Time Updates**: The poll results are updated in real-time, and voter information can be optionally shown.

#### 3.2 **PollCreator**

* **Create Polls**: Users can create new polls with a dynamic form for entering the question, options (2 to 10), and the selection mode (single or multi-select).
* **Submission**: Polls are submitted via server actions and the user is provided with success or error feedback.

#### 3.3 **PollMessage**

* **Poll Rendering**: Poll messages are rendered based on the message ID, and poll data is retrieved from the server.
* **Vote Tracking**: Displays a live progress of votes with automatic updates.

### 4. **User Interaction**

#### 4.1 **EmojiPickerDialog**

* **Emoji Selection**: Allows users to pick emojis from different categories, search emojis by name or alias, and insert them into messages.
* **Recently Used**: Shows recently used emojis, stored in `localStorage` for easy access.

#### 4.2 **DatePickerDialog**

* **Date Selection**: A calendar interface to select a date and optionally add a title for events.
* **Event Scheduling**: Used for scheduling events within chat.

#### 4.3 **UsersListDialog**

* **User Search**: A dialog that lists all users and allows searching by username or email.
* **User Details**: Displays user information such as avatar, name, email, and admin role status.

### 5. **Import/Export Functions**

#### 5.1 **ImportExportDialog**

* **Import Chat Transcripts**: Allows importing chat histories in XML format, with validation and error handling.
* **Export Chat History**: Exports the current group chat to XML for external use or archiving.
* **Tabs for Import/Export**: The dialog includes two tabs for toggling between import and export modes.

