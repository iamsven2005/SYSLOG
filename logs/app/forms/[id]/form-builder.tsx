/**
 * form-builder.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   Client-side React component for building and editing forms dynamically.
 *   Allows adding, updating, and removing questions, with live option editing and auto-save.
 *
 * Key Features:
 *   - Dynamic rendering and ordering of form questions
 *   - Support for multiple question types (TEXT, RADIO, CHECKBOX, DROPDOWN, etc.)
 *   - Validation for required fields and questions with options
 *   - Auto-save functionality with debounce timer (3s inactivity)
 *   - Save as new form (via `createForm`) or update existing form (via `updateForm`)
 *
 * Props:
 *   - `form?: Form`: Optional form object for edit mode. If absent, operates in create mode.
 *
 * Internal State:
 *   - `title`: Form title (required)
 *   - `description`: Optional description for the form
 *   - `questions`: List of questions, each with ID, type, order, and options
 *   - `isSubmitting`: Boolean to indicate if the form is currently saving
 *   - `autoSaveTimer`: NodeJS timeout used for throttled auto-saving
 *   - `lastSaved`: Date object representing the last successful save
 *
 * Notable Hooks:
 *   - `useEffect`: Triggers auto-save if editing an existing form with valid content
 *   - `useCallback`: `handleSubmit()` handles both manual and auto-save submission
 *
 * Notes:
 *   - New questions and options are assigned `temp-` IDs, which are stripped before saving
 *   - Uses `QuestionEditor` for nested question input and logic
 *   - Uses `toast` from `sonner` for user notifications
 *   - Designed for integration with `/forms/:id/edit` and `/forms/new`
 */

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuestionEditor } from "./question-editor"
import { PlusCircle, Save } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { QuestionType } from "@/prisma/generated/main"
import { createForm, updateForm } from "./actions"
import { toast } from "sonner"

type FormQuestion = {
  id: string | number
  text: string
  type: QuestionType
  required: boolean
  order: number
  options: Array<{
    id: string | number
    text: string
    value: string
  }>
}

interface Form {
  id: number
  title: string
  description?: string
  questions: FormQuestion[]
}

type FormBuilderProps = {
  form?: Form
}


export function FormBuilder({ form }: FormBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(form?.title || "")
  const [description, setDescription] = useState(form?.description || "")
  const [questions, setQuestions] = useState<FormQuestion[]>(
    form?.questions || [
      {
        id: "temp-1",
        text: "",
        type: "TEXT" as QuestionType,
        required: false,
        order: 0,
        options: [],
      },
    ],
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)


  // Auto-save when form changes

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `temp-${Date.now()}`,
        text: "",
        type: "TEXT" as QuestionType,
        required: false,
        order: questions.length,
        options: [],
      },
    ])
  }

  const updateQuestion = (index: number, updatedQuestion: FormQuestion) => {
    const newQuestions = [...questions]
    newQuestions[index] = updatedQuestion
    setQuestions(newQuestions)
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    // Update order for remaining questions
    newQuestions.forEach((q, i) => {
      q.order = i
    })
    setQuestions(newQuestions)
  }

  // Define handleSubmit outside the component render to prevent recreation
const handleSubmit = useCallback(async (isAutoSave = false) => {
    if (!title.trim()) {
      if (!isAutoSave) {
        toast.error("Form title is required")
      }
      return
    }

    if (questions.some((q) => !q.text.trim())) {
      if (!isAutoSave) {
        toast.error("All questions must have text")
      }
      return
    }

    // Validate that questions with options have at least one option
    const invalidQuestion = questions.find(
      (q) => (q.type === "RADIO" || q.type === "CHECKBOX" || q.type === "DROPDOWN") && q.options.length === 0,
    )

    if (invalidQuestion) {
      if (!isAutoSave) {
        toast.error(`Question "${invalidQuestion.text}" needs at least one option`)
      }
      return
    }

    try {
      if (!isAutoSave) {
        setIsSubmitting(true)
      }

      const formData = {
        id: form?.id,
        title,
        description,
        questions: questions.map((q) => ({
          ...q,
          // Convert temp IDs to null for new questions
          id: typeof q.id === "string" && q.id.toString().startsWith("temp-") ? undefined : q.id,
          // Convert option temp IDs to null for new options
          options: q.options.map((o) => ({
            ...o,
            id: typeof o.id === "string" && o.id.toString().startsWith("temp-") ? undefined : o.id,
          })),
        })),
      }

      if (form) {
        await updateForm(formData)
        setLastSaved(new Date())

        if (!isAutoSave) {
          toast.success("Form updated successfully")
        }
      } else {
        const newFormId = await createForm(formData)
        toast.success("Form created successfully")
        router.push(`/forms/${newFormId}`)
      }
    } catch (error) {
      console.error("Error saving form:", error)
      if (!isAutoSave) {
        toast.error("Please try again later")
      }
    } finally {
      if (!isAutoSave) {
        setIsSubmitting(false)
      }
    }
  }, [title, description, questions, form, router])
useEffect(() => {
  if (!form?.id) return

  if (autoSaveTimer) clearTimeout(autoSaveTimer)

  const timer = setTimeout(() => {
    if (title && questions.length > 0 && questions.every((q) => q.text.trim())) {
      handleSubmit(true)
    }
  }, 3000)

  setAutoSaveTimer(timer)

  return () => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
  }
}, [title, description, questions, form?.id, autoSaveTimer, handleSubmit])


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {form?.id && lastSaved && (
            <span className="text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter form description"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id.toString()}
            question={question}
            onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
            onRemove={() => removeQuestion(index)}
            isOnly={questions.length === 1}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="button" variant="outline" onClick={addQuestion} className="flex-1">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Form"}
        </Button>
      </div>
    </div>
  )
}
