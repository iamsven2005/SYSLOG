/*
 * app/docs/markdown-renderer.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A component that renders markdown content into HTML, allowing the display of formatted text, headers, code blocks, links, and more.
 *   It also includes a feature for copying code blocks to the clipboard, with visual feedback for successful copies.
 *   The markdown is parsed and transformed into styled HTML using simple regex-based parsing for common markdown elements.
 *
 * Features:
 *   - **Markdown Parsing**: Converts markdown elements like headers, bold, italic, links, code blocks, and lists into styled HTML.
 *   - **Code Block Rendering**: Renders code blocks with language labels, along with a button to copy the code to the clipboard.
 *   - **Clipboard Copy**: When the user clicks the copy button, the code is copied to the clipboard, and a success icon appears briefly.
 *   - **Table of Contents**: A basic section providing users with additional help or links to other documentation.
 *   - **Conditional Rendering for Code**: Identifies code blocks and renders them separately from other content, with styling and copy functionality.
 *
 * Returns:
 *   - Renders the parsed markdown content with support for inline and block elements, code blocks, and interactive clipboard copy functionality.
 * 
 * Dependencies:
 *   - React hooks: `useState` for managing the state of clipboard copying
 *   - `lucide-react` for icons like `Copy` and `Check`
 *   - `Card`, `Button`, and other UI components from the `@/components/ui` library
 *
 * Improvements:
 *   - Could integrate a more robust markdown parser like `react-markdown` or `remark` for greater flexibility and better performance.
 *   - Extend the table of contents to dynamically generate links based on the parsed headers in the markdown content.
 */


"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface MarkdownRendererProps {
  content: string
  title: string
}

export function MarkdownRenderer({ content, title }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Simple markdown parser - in a real app, you'd use react-markdown or similar
  const parseMarkdown = (markdown: string) => {
    let html = markdown

    // Headers (order matters - start with h4, then h3, h2, h1)
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold mt-4 mb-2 text-gray-900">$1</h4>')
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>')
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">$1</h2>',
    )
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-0 mb-6 text-gray-900">$1</h1>')

    // Bold and italic (order matters - bold first, then italic)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>')

    // Links
    html = html.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
    )

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>',
    )

    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$1. $2</li>')

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    html = '<p class="mb-4 text-gray-700 leading-relaxed">' + html + "</p>"

    return html
  }

  // Extract and render code blocks separately
  const renderContent = () => {
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const lines = part.split("\n")
        const firstLine = lines[0]
        const language = firstLine.replace("```", "").trim()
        const code = lines.slice(1, -1).join("\n")
        const codeId = `code-${index}`

        return (
          <Card key={index} className="my-6 overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
              <span className="text-sm font-medium text-gray-600">{language || "Code"}</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code, codeId)} className="h-8 w-8 p-0">
                {copiedCode === codeId ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100">
              <code className="text-sm font-mono">{code}</code>
            </pre>
          </Card>
        )
      } else {
        return (
          <div
            key={index}
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(part) }}
          />
        )
      }
    })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="h-1 w-20 bg-blue-600 rounded"></div>
      </div>

      <div className="space-y-6">{renderContent()}</div>

      {/* Table of Contents */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Need Help?</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Check out other documentation sections</p>
          <p>• Review the API reference for detailed information</p>
          <p>• Contact support if you need additional assistance</p>
        </div>
      </div>
    </div>
  )
}
