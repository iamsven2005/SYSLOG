/**
 * takeScreenshot function
 * 
 * This function captures a screenshot of a specified DOM element by its ID and provides two features:
 * 1. It downloads the image as a JPEG file.
 * 2. It attempts to copy the image to the clipboard.
 * 
 * Features:
 * - Captures the screenshot of the DOM element with background color adjustments based on the page's theme (dark or light).
 * - Excludes invisible elements (those with `display: none` or `visibility: hidden`).
 * - Allows the user to download the screenshot and also attempts to copy it to the clipboard.
 * 
 * Parameters:
 * - `elementId` (string): The ID of the DOM element to capture.
 * - `filename` (string): The name of the file to download (default: "chat-screenshot.png").
 * 
 * Returns:
 * - `Promise<boolean>`: Resolves to `true` if the screenshot is successfully captured, downloaded, and copied to the clipboard; otherwise, it throws an error.
 */


import domtoimage from "dom-to-image"

export async function takeScreenshot(elementId: string, filename = "chat-screenshot.png") {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    // Use dom-to-image for better compatibility
    const dataUrl = await domtoimage.toJpeg(element, {
      quality: 0.95,
      bgcolor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
      style: {
        "background-color": document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
      },
      filter: (node) => {
        // Skip invisible elements
        if (node instanceof HTMLElement) {
          const style = window.getComputedStyle(node)
          return style.display !== "none" && style.visibility !== "hidden"
        }
        return true
      },
    })

    // Create download link
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Copy to clipboard
    await copyImageToClipboard(dataUrl)

    return true
  } catch (error) {
    console.error("Error taking screenshot:", error)
    throw error
  }
}

async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Convert data URL to Blob
    const res = await fetch(dataUrl)
    const blob = await res.blob()

    // Try to use the clipboard API to copy the image
    if (navigator.clipboard && navigator.clipboard.write) {
      const item = new ClipboardItem({
        [blob.type]: blob,
      })
      await navigator.clipboard.write([item])
      return true
    } else {
      // Fallback for browsers that don't support clipboard.write with images
      console.warn("Clipboard API for images not supported in this browser")
      return false
    }
  } catch (error) {
    console.error("Failed to copy image to clipboard:", error)
    return false
  }
}

