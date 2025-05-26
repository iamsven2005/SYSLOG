/**
 * question-view.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component renders an individual question in a form based on its type (e.g., text, textarea, radio, checkbox, dropdown, or file).
 *   It allows users to input their responses to the question, handling different input types with appropriate UI components.
 *
 * Key Features:
 *   - Supports multiple question types, including text, textarea, radio buttons, checkboxes, dropdowns, and file uploads.
 *   - Dynamically handles user input, including text-based responses, multiple choices, file uploads, and checkbox selections.
 *   - Provides feedback on required fields by displaying an asterisk (*) next to required questions.
 *   - Handles file selection and displays the selected file name.
 *
 * Props:
 *   - `question`: The question object that defines the content and type of the question to be displayed.
 *   - `value`: The current value or answer of the question (e.g., text, selected options, or file).
 *   - `onChange`: A function to propagate changes in the value of the question to the parent component.
 *   - `onFileChange`: A function to propagate changes in the file input (if applicable) to the parent component.
 *
 * Question Types:
 *   - `TEXT`: Renders a short text input field.
 *   - `TEXTAREA`: Renders a larger text area input for longer answers.
 *   - `RADIO`: Renders a group of radio buttons for single-choice questions.
 *   - `CHECKBOX`: Renders checkboxes for multi-choice questions.
 *   - `DROPDOWN`: Renders a dropdown menu for selecting a single option.
 *   - `FILE`: Renders a file input for users to upload files.
 *
 * Notes:
 *   - For radio, checkbox, and dropdown questions, the component renders the corresponding options.
 *   - For file input, it displays the selected file's name, allowing the user to select or change the file.
 *   - The `required` property in the question object determines if an asterisk (*) is shown beside the question text to indicate that the question is mandatory.
 */

"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { cn } from "@/lib/utils"
type QuestionType = "TEXT" | "TEXTAREA" | "RADIO" | "CHECKBOX" | "DROPDOWN" | "FILE"

interface QuestionOption {
  id: number | string
  text: string
}

interface Question {
  id: number | string
  text: string
  type: QuestionType
  required?: boolean
  options?: QuestionOption[]
}
interface QuestionOption {
  id: string | number;
  text: string;
}


type QuestionValue =
  | string              // for TEXT, TEXTAREA, RADIO, DROPDOWN
  | number[]            // for CHECKBOX
  | undefined           // initial

type QuestionViewProps = {
  question: Question
  value: QuestionValue
  file: File | undefined
  onChange: (value: QuestionValue) => void
  onFileChange: (file: File | null) => void
}

export function QuestionView({ question, value, onChange, onFileChange }: QuestionViewProps) {
  const [fileName, setFileName] = useState<string>("")

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      setFileName(selectedFile.name)
      onFileChange(selectedFile)
    } else {
      setFileName("")
      onFileChange(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-1">
        <Label className="text-base font-medium">{question.text}</Label>
        {question.required && <span className="text-destructive">*</span>}
      </div>

{question.type === "TEXT" && (
  <Input
    value={typeof value === "string" ? value : ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Your answer"
    className="max-w-md"
  />
)}

{question.type === "TEXTAREA" && (
  <Textarea
    value={typeof value === "string" ? value : ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Your answer"
    className="min-h-[100px]"
  />
)}

{question.type === "RADIO" && (
  <RadioGroup
    value={typeof value === "string" ? value : ""}
    onValueChange={onChange}
    className="space-y-2"
  >
    {question.options?.map((option) => (
      <div key={option.id} className="flex items-center space-x-2">
        <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
        <Label htmlFor={`option-${option.id}`} className="font-normal">
          {option.text}
        </Label>
      </div>
    ))}
  </RadioGroup>
)}


{question.type === "CHECKBOX" && (
  <div className="space-y-2">
    {question.options?.map((option) => (
      <div key={option.id} className="flex items-center space-x-2">
        <Checkbox
          id={`option-${option.id}`}
checked={Array.isArray(value) && value.includes(Number(option.id))}
          onCheckedChange={(checked) => {
            const currentValue: number[] = Array.isArray(value) ? value : []
            if (checked) {
onChange(currentValue.filter((id) => id !== Number(option.id)))
            } else {
              onChange(currentValue.filter((id) => id !== option.id))
            }
          }}
        />
        <Label htmlFor={`option-${option.id}`} className="font-normal">
          {option.text}
        </Label>
      </div>
    ))}
  </div>
)}


{question.type === "DROPDOWN" && (
  <Select
    value={typeof value === "string" ? value : ""}
    onValueChange={onChange}
  >
    <SelectTrigger className="max-w-md">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      {question.options?.map((option) => (
        <SelectItem key={option.id} value={option.id.toString()}>
          {option.text}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}


      {question.type === "FILE" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input type="file" id={`file-${question.id}`} onChange={handleFileInputChange} className="hidden" />
            <Label
              htmlFor={`file-${question.id}`}
              className={cn(
                "cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              Choose File
            </Label>
            <span className="text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
          </div>
        </div>
      )}
    </div>
  )
}
