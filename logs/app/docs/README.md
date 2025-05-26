# Documentation Feature

## Overview

The **Documentation Feature** is designed to provide users with easy access to comprehensive guides and documentation for the application. The feature allows users to browse various sections of the documentation, including setup instructions, API references, and other essential guides.

The documentation is displayed in a user-friendly interface with a searchable modal and structured layout, providing a seamless way to find relevant information.

## Features

* **Dynamic Documentation Pages**: The content for each section is dynamically loaded based on the URL, rendering markdown files into well-structured HTML content.
* **Search Functionality**: A global search allows users to quickly find relevant documentation content based on keywords or phrases.
* **Navigation**: The sidebar provides easy navigation through documentation sections like "Getting Started," "API Reference," and other specific guides.
* **Interactive Code Blocks**: Documentation containing code examples can be copied directly to the clipboard with the click of a button.
* **Responsive Layout**: The design is responsive, adapting to mobile and desktop screens seamlessly.
* **Content Highlighting**: Search results within the documentation are highlighted for easy identification of relevant sections.

## Pages

The documentation feature is composed of the following key components:

### 1. **Home Page (`HomePage`)**

The home page of the documentation features an overview of key documentation sections with a simple card-based layout. Each section card includes:

* Title
* Short description
* Link to the detailed documentation page

### 2. **Dynamic Documentation Pages**

Each section (e.g., Chat Documentation, Authentication Guide) has a dedicated page that loads the corresponding `README.md` file dynamically based on the `id` parameter passed in the URL.

#### Example:

* `/docs/chat` renders the documentation for the Chat system.
* `/docs/auth` renders the Authentication guide.

### 3. **Search Docs (`SearchDocs`)**

A search modal that allows users to search for documentation content across all sections. Key features of the search functionality:

* Real-time search with debouncing.
* Displays search results with highlighted matches.
* Displays relevant documentation snippets (excerpts) for easy preview.
* Allows navigation to the exact section from search results.

## File Structure

The documentation content is stored in markdown files, and each section of the documentation corresponds to a markdown file (`README.md`) located in the `app` directory, under specific subdirectories for each documentation topic.

Example file structure:

```
app/
  docs/
    chat/
      README.md
    auth/
      README.md
    alerts/
      README.md
```

## Code Overview

### 1. **HomePage**

The home page provides an overview and links to the main documentation sections.

```tsx
export default function HomePage() {
  const sections = [
    { title: "Chat Documentation", href: "/docs/chat" },
    { title: "Authentication Guide", href: "/docs/auth" },
    { title: "Alerts System", href: "/docs/alerts" },
  ]
  // Render the sections with links and cards
}
```

### 2. **Dynamic Documentation Page**

Each documentation page is dynamically rendered based on the `id` parameter.

```tsx
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

### 3. **SearchDocs Modal**

The search modal allows users to search through the documentation.

```tsx
export function SearchDocs({ isOpen, onClose }: SearchDocsProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  const searchDocs = async (searchQuery: string) => {
    // Fetch results from the API and display them
  }

  // Render search results and handle highlights
}
```