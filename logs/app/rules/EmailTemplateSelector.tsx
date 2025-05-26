/**
 * EmailTemplateSelector.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   This component allows users to select an email template from a list of available templates. 
 *   It fetches templates from an API endpoint and provides a search functionality to filter through the available templates. 
 *   The selected template is highlighted with a checkmark, and the current selection is displayed on the button. 
 *   Users can also clear their selection by choosing the "No template" option.
 *
 * Components:
 *   - `Popover`, `PopoverTrigger`, `PopoverContent`: Used to display the dropdown list of email templates when the user interacts with the button.
 *   - `Button`: A button that displays the selected template's name or a placeholder if none is selected.
 *   - `Command`, `CommandList`, `CommandInput`, `CommandItem`, `CommandEmpty`: Command components to handle template selection, including search functionality.
 *   - `Check`, `ChevronsUpDown`: Icons for the checkmark next to the selected template and dropdown indicator, respectively.
 *   - `cn`: Utility function to conditionally combine class names.
 *
 * Props:
 *   - `selectedTemplateId`: The ID of the currently selected email template, or `null` if no template is selected.
 *   - `onChange`: A function that is called when a template is selected or the selection is cleared. It passes the selected template's ID, or `null` if no template is selected.
 *   - `className`: Optional class name for custom styling of the button.
 *   - `placeholder`: A placeholder text displayed when no template is selected.
 *
 * Behavior:
 *   - When the component loads, it fetches email templates from the `/api/email-templates` endpoint.
 *   - It displays a button with the name of the selected template or a placeholder.
 *   - Clicking the button opens a dropdown list of templates, where users can search and select a template.
 *   - The selected template is highlighted, and a checkmark is shown next to it.
 *   - The user can also clear their selection by selecting the "No template" option from the list.
 *
 * Notes:
 *   - The `loading` state ensures that the button displays a "Loading templates..." message until the templates are fetched.
 *   - The `selectedTemplate` is used to highlight the currently selected template in the dropdown.
 *   - The component is accessible, with appropriate `aria` roles and attributes for combobox interaction.
 */


"use client"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"

interface EmailTemplate {
  id: number
  name: string
  subject: string
}

interface EmailTemplateSelectorProps {
  selectedTemplateId: number | null | undefined
  onChange: (templateId: number | null) => void
  className?: string
  placeholder?: string
}

export function EmailTemplateSelector({
  selectedTemplateId,
  onChange,
  className,
  placeholder = "Select email template...",
}: EmailTemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/email-templates")
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error("Failed to fetch email templates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={loading}
        >
          {loading ? "Loading templates..." : selectedTemplate ? selectedTemplate.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search templates..." />
          <CommandList>
            <CommandEmpty>No email template found.</CommandEmpty>
            <CommandGroup>
              {templates.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.name}
                  onSelect={() => {
                    onChange(template.id === selectedTemplateId ? null : template.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedTemplateId === template.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{template.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{template.subject}</span>
                  </div>
                </CommandItem>
              ))}
              <CommandItem
                value="clear"
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
                className="text-muted-foreground"
              >
                <Check className={cn("mr-2 h-4 w-4", selectedTemplateId === null ? "opacity-100" : "opacity-0")} />
                No template (clear selection)
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

