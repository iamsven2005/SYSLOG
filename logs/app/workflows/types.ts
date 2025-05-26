/**
 * Types for the Audit Workflow System
 * 
 * These are extended types that represent the audit workflows, steps, logs, and users in the system, with relationships between them. 
 * These types are derived from the Prisma schema to provide type safety in interactions with the database.
 * 
 * Types:
 * 
 * - `AuditWorkflow`: Represents an audit workflow. It extends `PrismaAuditWorkflow` and includes an optional list of `steps`.
 * - `AuditStep`: Represents an individual step in an audit workflow. It extends `PrismaAuditStep` and includes optional relations to `assignedTo` (a `User`) and `logs` (an array of `StepLog`).
 * - `StepLog`: Represents a log entry for a step. It directly uses the `PrismaStepLog` type without extension.
 * - `User`: Represents a user in the system, extending `PrismaUser`.
 * - `StepStatus`: Enum representing various statuses a step can have, derived from Prisma's `StepStatus`.
 * 
 * Usage:
 * - These types are used for safe and consistent access to audit workflows, steps, logs, and users throughout the application.
 * 
 * Notes:
 * - The types ensure that the relations between workflows, steps, users, and logs are accurately represented in TypeScript.
 */


import {
  type AuditWorkflow as PrismaAuditWorkflow,
  type AuditStep as PrismaAuditStep,
  type StepLog as PrismaStepLog,
  StepStatus,
  type User as PrismaUser,
} from "@/prisma/generated/main"

// Extended types with relations
export type AuditWorkflow = PrismaAuditWorkflow & {
  steps?: AuditStep[]
}

export type AuditStep = PrismaAuditStep & {
  assignedTo?: User | null
  logs?: StepLog[]
}

export type StepLog = PrismaStepLog

export type User = PrismaUser

export { StepStatus }
