"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Responsive, WidthProvider, type Layout as GridLayout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { dashboard_layouts } from "./actions"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DraggableGridProps {
  children: React.ReactNode[]
  isEditable: boolean
  storageKey: string
  cols?: { [key: string]: number }
  rowHeight?: number
}

export function DraggableGrid({
  children,
  isEditable,
  storageKey,
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight = 30,
}: DraggableGridProps) {
  const [layouts, setLayouts] = useState<{ [key: string]: GridLayout[] }>({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg")
  const [mounted, setMounted] = useState(false)
  const [isLayoutChanged, setIsLayoutChanged] = useState(false)
  const [childrenCount, setChildrenCount] = useState(0)

  // Load layout from database on mount
  useEffect(() => {
    setMounted(true)
    setChildrenCount(children.length)
    fetchLayout()
  }, []) // Only run once on mount

  // Update layouts if children count changes
  useEffect(() => {
    if (mounted && children.length !== childrenCount) {
      setChildrenCount(children.length)

      // When filtering, we want to maintain the layout but adjust for fewer items
      if (children.length < childrenCount) {
        adjustLayoutForFewerItems()
      } else {
        // If we have more children than before, add new items to the layout
        updateLayoutsWithNewItems()
      }
    }
  }, [children.length, mounted])

  const fetchLayout = async () => {
      generateDefaultLayouts()
  }

  const generateDefaultLayouts = () => {
    const defaultLayouts: { [key: string]: GridLayout[] } = {}

    Object.keys(cols).forEach((breakpoint) => {
      const colCount = cols[breakpoint]
      defaultLayouts[breakpoint] = children.map((_, i) => {
        const w = breakpoint === "xxs" ? 2 : breakpoint === "xs" ? 4 : breakpoint === "sm" ? 3 : 4
        const h = 5
        const colsPerRow = Math.floor(colCount / w)
        const row = Math.floor(i / colsPerRow)
        const col = (i % colsPerRow) * w

        return {
          i: i.toString(),
          x: col,
          y: row * h,
          w,
          h,
          minW: 2,
          minH: 3,
        }
      })
    })

    setLayouts(defaultLayouts)
  }

  const updateLayoutsWithNewItems = () => {
    const updatedLayouts = { ...layouts }

    Object.keys(cols).forEach((breakpoint) => {
      const colCount = cols[breakpoint]
      const existingLayout = updatedLayouts[breakpoint] || []
      const existingCount = existingLayout.length

      // Add new items to the layout
      const newItems = Array.from({ length: children.length - existingCount }).map((_, index) => {
        const i = existingCount + index
        const w = breakpoint === "xxs" ? 2 : breakpoint === "xs" ? 4 : breakpoint === "sm" ? 3 : 4
        const h = 5
        const colsPerRow = Math.floor(colCount / w)
        const row = Math.floor(i / colsPerRow)
        const col = (i % colsPerRow) * w

        return {
          i: i.toString(),
          x: col,
          y: row * h,
          w,
          h,
          minW: 2,
          minH: 3,
        }
      })

      updatedLayouts[breakpoint] = [...existingLayout, ...newItems]
    })

    setLayouts(updatedLayouts)
  }

  const adjustLayoutForFewerItems = () => {
    // When filtering, we just need to ensure we don't have more layout items than children
    // The grid will automatically handle the layout of the visible items
    const updatedLayouts = { ...layouts }

    Object.keys(updatedLayouts).forEach((breakpoint) => {
      if (updatedLayouts[breakpoint] && updatedLayouts[breakpoint].length > children.length) {
        // Keep only the layouts for the current visible items
        updatedLayouts[breakpoint] = updatedLayouts[breakpoint].slice(0, children.length)
      }
    })

    setLayouts(updatedLayouts)
  }

  const handleLayoutChange = (layout: GridLayout[], allLayouts: { [key: string]: GridLayout[] }) => {
    if (!isEditable) return // Don't update layouts if not editable

    setLayouts(allLayouts)
    setIsLayoutChanged(true)
  }

  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint)
  }

  const saveLayout = async () => {
    if (!isEditable) {
      toast.error("Authentication Required", {
        description: "You must be authenticated to save layouts.",
      })
      return
    }

    try {
        const serializedLayouts = JSON.parse(JSON.stringify(layouts));

      // Save the default layout to the database
      await await dashboard_layouts("default", serializedLayouts , true);

      setIsLayoutChanged(false)
      toast.success("Layout saved", {
        description: "Your dashboard layout has been saved for all users.",
      })
    } catch (error) {
      console.error("Error saving layout:", error)
      toast.error("Error", {
        description: "Failed to save layout. Please try again.",
      })
    }
  }

  const resetLayout = async () => {
    if (!isEditable) {
      toast.error("Authentication Required", {
        description: "You must be authenticated to reset layouts.",
      })
      return
    }

    try {
      generateDefaultLayouts()
  const serializedLayouts = JSON.parse(JSON.stringify(layouts));

      // Save the default layout to the database
      await await dashboard_layouts("default", serializedLayouts , true);

      setIsLayoutChanged(false)
      toast.success("Layout reset", {
        description: "Your dashboard layout has been reset to default for all users.",
      })
    } catch (error) {
      console.error("Error resetting layout:", error)
      toast.error("Error", {
        description: "Failed to reset layout. Please try again.",
      })
    }
  }

  if (!mounted) return null // Prevents SSR issues with window measurement

  return (
    <div className="relative">
      {isEditable && (
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={resetLayout} className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset Layout
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={saveLayout}
            disabled={!isLayoutChanged}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Layout
          </Button>
        </div>
      )}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={cols}
        rowHeight={rowHeight}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        isDraggable={isEditable}
        isResizable={isEditable}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        compactType="vertical"
        useCSSTransforms={true}
        measureBeforeMount={false}
      >
        {children.map((child, index) => (
          <div key={index} className="bg-card border rounded-lg shadow-sm overflow-hidden">
            {child}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
