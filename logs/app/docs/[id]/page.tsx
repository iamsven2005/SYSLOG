/*
 * app/docs/[id]/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A dynamic page that renders a specific documentation section based on the `id` parameter passed in the URL.
 *   The page reads the corresponding markdown file (`README.md`) from the file system, parses the content, and 
 *   displays it using the `MarkdownRenderer` component.
 *   The title "Alerts System" is passed statically, but the content is dynamically loaded based on the `id`.
 *
 * Features:
 *   - **Dynamic Rendering**: Based on the `id` parameter in the URL, the page dynamically loads and displays the appropriate markdown file (`README.md`).
 *   - **File System Access**: The markdown file is read from the local file system using Node's `fs` module, ensuring that the correct documentation is fetched.
 *   - **Markdown Rendering**: The content of the markdown file is passed to the `MarkdownRenderer` component, which parses and formats it into HTML for display.
 *   - **Title**: The page uses a static title ("Alerts System") while the content is dynamically loaded based on the `id` parameter.
 *
 * Returns:
 *   - Renders a markdown-based page with parsed content displayed by the `MarkdownRenderer` component.
 *
 * Dependencies:
 *   - Node.js modules: `fs` (promises API), `path` for file handling
 *   - `MarkdownRenderer` component for parsing and rendering the markdown content
 *
 * Improvements:
 *   - Add error handling to check for missing or incorrect markdown files, providing a 404 page or error message when the file is not found.
 *   - Dynamically update the page title based on the `id` (e.g., using the title from the markdown file).
 */


import { promises as fs } from "fs"
import path from "path"
import { MarkdownRenderer } from "../markdown-renderer"

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const id = (await props.params).id
    const filePath = path.join(process.cwd(), "app", `${id}`, "README.md")
  const content = await fs.readFile(filePath, "utf8")

  return <MarkdownRenderer content={content} title="Alerts System" />
}
