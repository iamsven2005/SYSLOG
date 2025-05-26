/**
 * Uploads Page for Locations - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **UploadsPage** component serves as the main entry for the location upload functionality. It checks if the user has access to the locations page and renders the **LocationsTable** if permission is granted. Otherwise, it redirects to the "not found" page.
 *
 * Key Features:
 *   - Validates if the current user has permission to view the locations page by calling `allowed("/locations")`.
 *   - If access is granted, it renders the **LocationsTable** component, which is the main interface for managing location data.
 *   - If access is denied, it triggers a redirection to the "not found" page using `notFound()`.
 *
 * Example Usage:
 *   ```tsx
 *   <UploadsPage />
 *   ```
 *
 * Notes:
 *   - **Security**: The `allowed` function is used to ensure that only authorized users can access the locations page, improving security by preventing unauthorized access.
 *   - **Error Handling**: The `notFound()` function is used to gracefully handle the scenario where the user is not authorized to access this page, providing a clean user experience.
 */
import { allowed } from "@/components/navbar";
import LocationsTable from "./client";
import { notFound } from "next/navigation";
// This page is for upload of books from html file
export default async function UploadsPage() {
  const a = await allowed("/locations")
  if(a === false) notFound()
  return (
    <LocationsTable
    />
  )
}