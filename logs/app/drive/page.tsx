"use client"

import { useState, useEffect, useCallback } from "react"
import { notFound, redirect, useSearchParams } from "next/navigation"
import { getFolderContents, getFolderPath } from "./drive-actions"
import { FolderBreadcrumb } from "./folder-breadcrumb"
import { FileGrid } from "./file-grid"
import { UploadButton } from "./upload-button"
import { CreateFolderButton } from "./create-folder-button"
import { FileDetails } from "./file-details"
import { getCurrentUser } from "../login/actions"
import { checkUserPermission } from "../permissions/permission-actions"
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

export default function DriveExplorer() {
  const searchParams = useSearchParams()
  const folderIdParam = searchParams.get("folder")
  const folderId = folderIdParam ? Number.parseInt(folderIdParam) : null

  const [folders, setFolders] = useState<DriveFolder[]>([])
const [files, setFiles] = useState<(DriveFile & { owner: User; permissions: DriveFilePermission[] })[]>([])
  const [path, setPath] = useState<PathItem[]>([{ id: null, name: "My Drive" }])
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [parentId, setparent] = useState<number | null>(null)
  const [userId, setuser] = useState<number>(0) // default dummy value




  useEffect(() => {
    async function loadFolderContents() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        redirect("/login")
      }
      const perm = await checkUserPermission(currentUser.id, "/drive")
      if (perm.hasPermission === false) {
        return notFound()
      }
      setuser(currentUser.id)
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


        <UploadButton userId={userId} folderId={folderId} onUploadComplete={handleRefresh} />
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

