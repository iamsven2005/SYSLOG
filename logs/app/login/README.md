# User Authentication System

The **User Authentication System** provides utilities for logging in and out users, checking user roles, and managing user sessions. It includes a **Login Page** for user interaction and seamless authentication flow, redirecting users based on their roles and ensuring secure access to protected routes.

## Key Features

### 1. **User Authentication**

* **loginUser**: Authenticates a user by verifying their username and password. Upon successful authentication:

  * A session cookie is set.
  * The user is redirected based on their role (e.g., admins go to logs, others go to notifications).
  * Failed login attempts are logged for monitoring.

* **logoutUser**: Logs out a user by deleting the session cookie, effectively terminating their session.

* **hasRole**: Checks if the current logged-in user has one of the specified roles, helping with access control.

* **getCurrentUser**: Retrieves the details of the currently logged-in user based on the session cookie. This is useful for personalization or authorization checks.

* **getId**: Retrieves the ID of the currently logged-in user from the session cookie, which is useful for querying or access control.

### 2. **Login Page**

* **LoginForm**: Allows users to enter their username and password to log in.

  * Handles form submission and triggers the `loginUser` function for authentication.
  * Displays a **loading state** while login is processing.
  * Provides **toast notifications** to give feedback to users:

    * Success: A personalized welcome message on successful login.
    * Error: Displays error messages for failed login attempts or other issues.
* **Redirection**: Redirects users based on their roles:

  * Admin users are redirected to the logs page.
  * Other users are redirected to the notifications page.
* **DatabaseStatusBar**: Displays the status of the database connection on the login page.

### 3. **Session Management**

* The **session** is maintained using cookies, and the authentication functions rely on session cookies to identify and verify the current user.
* The system **logs out users** by deleting the session cookie when they log out.

### 4. **Error Handling and Notifications**

* **Toast Notifications**: Success and error messages are shown as toasts during the login process.
* **Error Logging**: Failed login attempts and other errors are logged for monitoring and debugging.

## Limitations

* **Plain Text Password Comparison**: Currently, passwords are compared in plain text. This is **not secure** for production environments and should be replaced with password hashing (e.g., using bcrypt).
* **Basic Role Check**: The role check is simple, and additional role hierarchy or complex permissions might be needed for scalable access control.
* **Session Management**: The session relies on cookies, so users must have cookies enabled. Consider adding session expiration or token-based authentication for better security.

## Improvements

* **Password Hashing**: Implement **password hashing** (e.g., bcrypt) to securely compare passwords.
* **Role Hierarchy**: Add **role hierarchy** or more advanced permission checks to support more complex user roles and access control.
* **Two-Factor Authentication**: Integrate **two-factor authentication** (2FA) for enhanced security during the login process.
* **Input Validation**: Implement input validation (e.g., password strength checks) for better security and user experience.
* **Error Handling**: Expand error messages to provide more context (e.g., incorrect password, account locked).
* **Pagination and Scrolling for Logs**: If activity logs grow large, implement **pagination** or **infinite scrolling** for better performance.