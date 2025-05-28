// utils/formatDate.test.ts

import { formatDate } from "@/lib/utils"
import test from "node:test"
import { expect } from "vitest"

test('formats date as YYYY-MM-DD', () => {
  expect(formatDate(new Date('2024-06-01'))).toBe('2024-06-01')
})