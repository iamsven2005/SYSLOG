"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface CalculatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (result: string) => void
}

export function CalculatorDialog({ open, onOpenChange, onInsert }: CalculatorDialogProps) {
  const [display, setDisplay] = React.useState("0")
  const [currentValue, setCurrentValue] = React.useState<string | null>(null)
  const [operator, setOperator] = React.useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = React.useState(false)
  const [memory, setMemory] = React.useState(0)
  const [history, setHistory] = React.useState<string[]>([])

  const clearAll = () => {
    setDisplay("0")
    setCurrentValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay("0")
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const toggleSign = () => {
    const newValue = Number.parseFloat(display) * -1
    setDisplay(String(newValue))
  }

  const inputPercent = () => {
    const currentValueNum = Number.parseFloat(display)
    const newValue = currentValueNum / 100
    setDisplay(String(newValue))
  }

  const performOperation = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (currentValue === null) {
      setCurrentValue(display)
    } else if (operator) {
      const currentValueNum = Number.parseFloat(currentValue)
      let newValue: number

      switch (operator) {
        case "+":
          newValue = currentValueNum + inputValue
          break
        case "-":
          newValue = currentValueNum - inputValue
          break
        case "×":
          newValue = currentValueNum * inputValue
          break
        case "÷":
          newValue = currentValueNum / inputValue
          break
        default:
          newValue = inputValue
      }

      setCurrentValue(String(newValue))
      setDisplay(String(newValue))

      // Add to history
      setHistory((prev) => [...prev, `${currentValueNum} ${operator} ${inputValue} = ${newValue}`])
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault()
      inputDigit(e.key)
    } else if (e.key === ".") {
      e.preventDefault()
      inputDecimal()
    } else if (e.key === "=" || e.key === "Enter") {
      e.preventDefault()
      if (operator) performOperation("=")
    } else if (e.key === "Backspace") {
      e.preventDefault()
      if (display !== "0" && display.length > 1) {
        setDisplay(display.substring(0, display.length - 1))
      } else {
        setDisplay("0")
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      clearAll()
    } else if (e.key === "+") {
      e.preventDefault()
      performOperation("+")
    } else if (e.key === "-") {
      e.preventDefault()
      performOperation("-")
    } else if (e.key === "*") {
      e.preventDefault()
      performOperation("×")
    } else if (e.key === "/") {
      e.preventDefault()
      performOperation("÷")
    }
  }

  const handleInsert = () => {
    // Format the calculation result
    let resultText = `🧮 Calculation result: ${display}`

    // Add the last calculation if available
    if (history.length > 0) {
      resultText = `🧮 ${history[history.length - 1]}`
    }

    onInsert(resultText)
    onOpenChange(false)
  }

  React.useEffect(() => {
    if (open) {
      clearAll()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]" onKeyDown={handleKeyDown} tabIndex={0}>
        <DialogHeader>
          <DialogTitle>Calculator</DialogTitle>
          <DialogDescription>Perform calculations and insert the result into your message.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <Input value={display} readOnly className="text-right text-xl font-mono h-12" />

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              onClick={() => clearAll()}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              AC
            </Button>
            <Button
              variant="outline"
              onClick={() => clearEntry()}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              CE
            </Button>
            <Button
              variant="outline"
              onClick={() => inputPercent()}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              %
            </Button>
            <Button
              variant="outline"
              onClick={() => performOperation("÷")}
              className={`${operator === "÷" ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"}`}
            >
              ÷
            </Button>

            <Button variant="outline" onClick={() => inputDigit("7")}>
              7
            </Button>
            <Button variant="outline" onClick={() => inputDigit("8")}>
              8
            </Button>
            <Button variant="outline" onClick={() => inputDigit("9")}>
              9
            </Button>
            <Button
              variant="outline"
              onClick={() => performOperation("×")}
              className={`${operator === "×" ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"}`}
            >
              ×
            </Button>

            <Button variant="outline" onClick={() => inputDigit("4")}>
              4
            </Button>
            <Button variant="outline" onClick={() => inputDigit("5")}>
              5
            </Button>
            <Button variant="outline" onClick={() => inputDigit("6")}>
              6
            </Button>
            <Button
              variant="outline"
              onClick={() => performOperation("-")}
              className={`${operator === "-" ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"}`}
            >
              -
            </Button>

            <Button variant="outline" onClick={() => inputDigit("1")}>
              1
            </Button>
            <Button variant="outline" onClick={() => inputDigit("2")}>
              2
            </Button>
            <Button variant="outline" onClick={() => inputDigit("3")}>
              3
            </Button>
            <Button
              variant="outline"
              onClick={() => performOperation("+")}
              className={`${operator === "+" ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"}`}
            >
              +
            </Button>

            <Button variant="outline" onClick={() => toggleSign()}>
              +/-
            </Button>
            <Button variant="outline" onClick={() => inputDigit("0")}>
              0
            </Button>
            <Button variant="outline" onClick={() => inputDecimal()}>
              .
            </Button>
            <Button
              variant="outline"
              onClick={() => performOperation("=")}
              className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              =
            </Button>
          </div>

          {history.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-h-20 overflow-y-auto">
              <p className="font-medium mb-1">History:</p>
              {history.map((item, index) => (
                <div key={index} className="mb-1">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Result</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
