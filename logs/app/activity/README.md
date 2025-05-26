# Dynamic Markdown Documentation Page

## Overview

This page component dynamically loads a specific documentation section based on the `id` parameter passed in the URL. It reads the corresponding markdown file (`README.md`) from the file system, parses the content, and renders it using the `MarkdownRenderer` component. The title is static, while the content is dynamically loaded based on the given `id`.

## Features

* **Dynamic Rendering**: The page dynamically loads and displays markdown content based on the `id` parameter in the URL.
* **File System Access**: The markdown file is read from the local file system using Node's `fs` module.
* **Markdown Rendering**: The content is passed to the `MarkdownRenderer` component to be parsed and displayed as HTML.
* **Static Title**: The page has a static title ("Alerts System"), while the content is loaded dynamically based on the `id`.

## How it Works

1. The `id` parameter is passed in the URL and extracted using `props.params`.
2. The corresponding markdown file (`README.md`) is read from the file system.
3. The markdown content is passed to the `MarkdownRenderer` component for rendering.
4. The page renders the content using the `MarkdownRenderer` component, which handles parsing and displaying the markdown.

## Code Explanation

### File Reading and Content Rendering

The page reads the markdown file dynamically based on the `id`:

```ts
import { promises as fs } from "fs"
import path from "path"
import { MarkdownRenderer } from "../markdown-renderer"

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const id = (await props.params).id
    const filePath = path.join(process.cwd(), "app", `${id}`, "README.md")
    const content = await fs.readFile(filePath, "utf8")

    return <MarkdownRenderer content={content} title="Alerts System" />
}
```

### Dependencies

* **Node.js Modules**:

  * `fs` (promises API) for reading files
  * `path` for handling file paths
* **`MarkdownRenderer` Component**: For rendering the parsed markdown content.

## Improvements

* **Error Handling**: Implement error handling to check for missing or incorrect markdown files. If the file is not found, you could display a 404 page or an error message.
* **Dynamic Title**: Update the page title dynamically based on the `id`, using the title from the markdown file.

## Usage

1. **URL Structure**:
   The URL must include the `id` parameter (e.g., `/docs/{id}`).
2. **File System Structure**:
   Ensure that markdown files are stored in the appropriate directory (`app/{id}/README.md`).
