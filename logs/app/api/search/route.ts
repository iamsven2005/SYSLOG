// This is for documentation
import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface SearchResult {
  title: string
  slug: string
  excerpt: string
  matches: string[]
}

// Function to get all markdown files recursively from directories
async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true })
  const markdownFiles: string[] = []

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      // Recursively search through subdirectories
      const subFiles = await getMarkdownFiles(fullPath)
      markdownFiles.push(...subFiles)
    } else if (file.isFile() && file.name.endsWith(".md")) {
      markdownFiles.push(fullPath)
    }
  }

  return markdownFiles
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Correct the directory path
    const docsDir = path.join(process.cwd() ,"app")
    const markdownFiles = await getMarkdownFiles(docsDir)

    const results: SearchResult[] = []

    for (const filePath of markdownFiles) {
      const content = await fs.readFile(filePath, "utf8")
const slug = path.relative(docsDir, filePath).replace(/README\.md$/, "");

      // Extract title from first # header
      const titleMatch = content.match(/^# (.+)$/m)
      const title = titleMatch ? titleMatch[1] : slug.charAt(0).toUpperCase() + slug.slice(1)

      // Search in content
      const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
      const matches = content.match(searchRegex)

      if (matches) {
        // Find context around matches
        const lines = content.split("\n")
        const matchingLines: string[] = []
        const contextLines: string[] = []

        lines.forEach((line, index) => {
          if (searchRegex.test(line)) {
            matchingLines.push(line.trim())

            // Add context (line before and after)
            const contextStart = Math.max(0, index - 1)
            const contextEnd = Math.min(lines.length - 1, index + 1)

            for (let i = contextStart; i <= contextEnd; i++) {
              const contextLine = lines[i].trim()
              if (contextLine && !contextLine.startsWith("#") && !contextLine.startsWith("```")) {
                contextLines.push(contextLine)
              }
            }
          }
        })

        // Create excerpt from first matching context
        const excerpt = contextLines[0] || matchingLines[0] || ""
        const cleanExcerpt =
          excerpt
            .replace(/[#*`]/g, "") // Remove markdown formatting
            .substring(0, 150) + (excerpt.length > 150 ? "..." : "")

        // Get unique matching phrases
        const uniqueMatches = [...new Set(matchingLines)]
          .map((line) => line.replace(/[#*`]/g, "").trim())
          .filter((line) => line.length > 0)
          .slice(0, 5)

        results.push({
          title,
          slug,
          excerpt: cleanExcerpt,
          matches: uniqueMatches,
        })
      }
    }

    // Sort by relevance (number of matches)
    results.sort((a, b) => b.matches.length - a.matches.length)

    return NextResponse.json({ results: results.slice(0, 10) })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [] })
  }
}

