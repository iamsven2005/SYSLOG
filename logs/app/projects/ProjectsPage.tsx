/**
 * ProjectsPage.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This page is used to display and manage projects within the system. It supports features like searching for projects, assigning 
 *   project types to projects, adding new projects, assigning users to projects, and managing model entries. The page includes modals 
 *   for adding a new project, assigning users, and uploading project data.
 *
 * Components:
 *   - `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`: Used to display a list of projects in a table format.
 *   - `Button`: Provides buttons for actions such as adding a project, assigning users, and uploading project data.
 *   - `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`: Dropdown component to select a project type for a project.
 *   - `AddProjectModal`: Modal for creating a new project.
 *   - `AssignUsersModal`: Modal for assigning users to a project.
 *   - `ModelEntryModal`: Modal for managing model entries associated with a project.
 *   - `UploadProjects`: Modal for uploading multiple projects in bulk.
 *   - `Badge`: Displays assigned users and their roles within the project.
 * 
 * Props:
 *   - `user`: The current user object passed down to the component.
 *
 * Behavior:
 *   - The page allows users to search for projects using the search bar, and filter them by project type.
 *   - It allows users to assign a project type to each project and view the project details, including assigned users.
 *   - The "Assign" button opens a modal where users can be assigned to a project with a specific role.
 *   - The "Model Entry" button opens a modal for managing model entries related to the project.
 *   - The "Add Project" button opens a modal where a new project can be created.
 *   - The `fetchData` function fetches the latest list of projects and project types from the database.
 *   - The `handleSearch` function triggers the search and updates the project list accordingly.
 * 
 * Notes:
 *   - The project types are displayed in a dropdown within the table for each project, and users can select a type for the project.
 *   - The table displays key information about each project, including the project code, project type, assigned users, and model entries.
 *   - The project assignment functionality checks for existing assignments before making updates, preventing duplicate assignments.
 *   - The page provides modals for various actions, such as adding a project, assigning users, and managing model entries, all of which 
 *     trigger data refreshes after actions are successfully completed.
 */

"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getAllProjects, getProjectTypes, assignProjectType } from "./project-actions" // Import actions
import { toast } from "sonner"
import { Plus, HardDrive, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProjectModal } from "./AddProjectModal"
import { AssignUsersModal } from "./AssignUsersModal"
import { ModelEntryModal } from "./ModelEntryModal"
import UploadProjects from "./UploadProjects"

interface Project {
  id: number
  businessCode: string
  projectCode: string
  name: string
  createDate: Date
  projectType?: {
    id: number
    name: string
  } | null
  assignments: ProjectAssignment[]
  _count?: {
    models: number
  }
}


interface ProjectType {
  id: number
  name: string
}

interface ProjectAssignment {
  id: number
  userId: number
  projectId: number
  role: string
  user: {
    id: number
    username: string | null
  }
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isModelEntryModalOpen, setIsModelEntryModalOpen] = useState(false)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)



  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [projectsData, projectTypesData] = await Promise.all([
        getAllProjects(searchQuery),
        getProjectTypes()
      ])
      setProjects(projectsData)
      setProjectTypes(projectTypesData)
    } catch (error) {
      toast.error("Failed to fetch data")
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [fetchData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  const handleProjectTypeChange = async (projectId: number, projectTypeId: string) => {
    try {
      const projectTypeIdNumber = Number.parseInt(projectTypeId)
      await assignProjectType(projectId, projectTypeIdNumber)
      toast.success("Project type assigned successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to assign project type")
      console.error("Error assigning project type:", error)
    }
  }

  const openAssignModal = (projectId: number) => {
    setSelectedProjectId(projectId)
    setIsAssignModalOpen(true)
  }

  const closeAssignModal = () => {
    setSelectedProjectId(null)
    setIsAssignModalOpen(false)
  }

  const openModelEntryModal = (projectId: number) => {
    setSelectedProjectId(projectId)
    setIsModelEntryModalOpen(true)
  }

  const closeModelEntryModal = () => {
    setSelectedProjectId(null)
    setIsModelEntryModalOpen(false)
  }

  // Function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const openAddModal = () => {
    setAddModalOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
        <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Projects
        </Button>      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Code</TableHead>
              <TableHead>Project Code</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.businessCode}</TableCell>
                  <TableCell>{project.projectCode}</TableCell>
                  <TableCell className="max-w-[200px] whitespace-normal break-words">{project.name}</TableCell>
                  <TableCell>{formatDate(project.createDate)}</TableCell>
                  <TableCell>
                    <Select
                      value={project.projectType?.id?.toString() || ""}
                      onValueChange={(projectTypeId) => handleProjectTypeChange(project.id, projectTypeId)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {project.assignments &&
                      project.assignments.map((assignment) => (
                        <Badge key={assignment.id} variant="secondary" className="mr-1">
                          {assignment.user.username} ({assignment.role})
                        </Badge>
                      ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openAssignModal(project.id)}>
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openModelEntryModal(project.id)}>
                      <HardDrive className="h-4 w-4 mr-2" />
                      Model Entry {project._count?.models ?? 0}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Users Modal */}
      {selectedProjectId && (
        <AssignUsersModal
          projectId={selectedProjectId}
          isOpen={isAssignModalOpen}
          onClose={closeAssignModal}
          onSuccess={fetchData}
        />
      )}
      <AddProjectModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={fetchData} />
      <ModelEntryModal
        projectId={selectedProjectId || 0}
        isOpen={isModelEntryModalOpen}
        onClose={closeModelEntryModal}
        onSuccess={fetchData}
      />
      <UploadProjects isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onSuccess={fetchData} />
    </div>
  )
}

