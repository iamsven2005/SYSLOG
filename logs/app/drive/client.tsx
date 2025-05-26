/*
 * app/drive/client.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Client-side component that serves as the main interface for exploring and managing files in a user's drive.
 *   It allows users to browse folders, view file details, upload files, create folders, and interact with files.
 *   The component supports real-time updates via Server-Sent Events (SSE) for file changes and updates.
 *
 * Features:
 *   - Displays the folder structure and contents with navigation breadcrumbs
 *   - Supports uploading files and creating new folders
 *   - Displays file details when selected, with options to close the details panel
 *   - Filters files to show only those with valid owner and permissions
 *   - Uses SSE to listen for real-time updates to the drive content and refresh the file list
 *   - Allows selecting files and viewing their details in a fixed side panel
 *   - Supports pagination for large lists of files and folders
 *
 * Props:
 *   - `id`: The user ID passed to the component, used for uploading and file interaction
 *
 * Dependencies:
 *   - UI Components: `Button`, `Input`, `Checkbox`, `Dialog`, `Label`, `Badge`, etc.
 *   - Custom Components: `FolderBreadcrumb`, `FileGrid`, `UploadButton`, `CreateFolderButton`, `FileDetails`
 *   - `getFolderContents`, `getFolderPath`: Functions to fetch folder contents and path information
 *   - `useSearchParams`: Used to read query parameters for folder navigation
 *   - SSE for real-time updates: `EventSource` is used to listen for file changes and refresh the content
 *   - `DriveFile`, `DriveFolder`, `DriveFilePermission`: Types from Prisma for file and folder management
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { getFolderContents, getFolderPath } from "./drive-actions"
import { FolderBreadcrumb } from "./folder-breadcrumb"
import { FileGrid } from "./file-grid"
import { UploadButton } from "./upload-button"
import { CreateFolderButton } from "./create-folder-button"
import { FileDetails } from "./file-details"
import { DriveFile, DriveFilePermission, DriveFolder, User } from "@/prisma/generated/main"
interface PathItem {
  id: number | null;
  name: string;
}
interface FileData {
  id: number
  name: string
  type: string
  url: string
  createdAt: Date
  updatedAt: Date
  owner: User
  permissions: DriveFilePermissionWithUser[]
}
interface DriveFilePermissionWithUser extends DriveFilePermission {
  user?: User
}

export default function DriveExplorer({id}: {id:number}) {
  const searchParams = useSearchParams()
  const folderIdParam = searchParams.get("folder")
  const folderId = folderIdParam ? Number.parseInt(folderIdParam) : null

  const [folders, setFolders] = useState<DriveFolder[]>([])
const [files, setFiles] = useState<(DriveFile & { owner: User; permissions: DriveFilePermission[] })[]>([])
  const [path, setPath] = useState<PathItem[]>([{ id: null, name: "My Drive" }])
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [parentId, setparent] = useState<number | null>(null)




  useEffect(() => {
    async function loadFolderContents() {
    
      setIsLoading(true)
      try {
        const { folders, files } = await getFolderContents(folderId)
        const pathData = await getFolderPath(folderId)
        const parentId = path.length > 1 ? path[path.length - 2].id : null
        setparent(parentId)
        setFolders(folders)
        setFiles(files)
        setPath(pathData)
      } catch (error) {
        console.error("Error loading folder contents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFolderContents()
  }, [folderId, path])

  const handleFileSelect = (file: FileData) => {
    setSelectedFile(file)
  }


  const handleCloseDetails = () => {
    setSelectedFile(null)
  }

  const handleRefresh = useCallback(async () => {
    const { folders, files } = await getFolderContents(folderId)
    setFolders(folders)
    setFiles(files)
  }, [folderId])
useEffect(() => {
  const eventSource = new EventSource("/api/drive-events")

  eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log("SSE update:", message)
    handleRefresh()
  }

  return () => eventSource.close()
}, [handleRefresh])
const validFiles = files.filter(f => f.owner && f.permissions)

  return (
    <div className="flex flex-col h-full m-5 p-5">
      <div className="flex flex-wrap items-center gap-2 ">
        <h1 className="text-2xl font-bold">My Drive</h1>


        <UploadButton userId={id} folderId={folderId} onUploadComplete={handleRefresh} />
        <CreateFolderButton parentId={folderId} onFolderCreated={handleRefresh} />
        <FolderBreadcrumb path={path} />

      </div>


      <div className="flex flex-1 mt-4">
        <div className={`flex-1 transition-all ${selectedFile ? "pr-4 lg:pr-80" : ""}`}>
<FileGrid
  folders={folders}
  files={validFiles} // ✅ Use filtered and properly typed files
  isLoading={isLoading}
  onFileSelect={handleFileSelect}
  onRefresh={handleRefresh}
  parentFolderId={parentId}
/>
        </div>

        {selectedFile && (
          <div className="fixed top-0 right-0 h-full w-full sm:w-80 bg-background border-l z-30 overflow-auto p-4 shadow-lg transition-transform transform-gpu">
            <FileDetails file={selectedFile} onClose={handleCloseDetails} onUpdate={handleRefresh} />
          </div>
        )}
      </div>
    </div>
  )
}

