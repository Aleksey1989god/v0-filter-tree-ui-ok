import { z } from "zod"

// Zod schemas for validation

export const logicalOperatorSchema = z.enum(["AND", "OR"])

export const comparisonOperatorSchema = z.enum([
  "equals",
  "not_equals",
  "contains",
  "not_contains",
  "greater_than",
  "less_than",
  "greater_than_or_equal",
  "less_than_or_equal",
  "in",
  "not_in",
  "is_null",
  "is_not_null",
])

export const fieldTypeSchema = z.enum(["string", "number", "boolean", "date", "array", "object"])

export const filterFieldSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: fieldTypeSchema,
  description: z.string().optional(),
  enum: z.array(z.string()).optional(),
})

export const filterLeafSchema: z.ZodType<any> = z.object({
  id: z.string(),
  type: z.literal("leaf"),
  field: z.string(),
  operator: comparisonOperatorSchema,
  value: z.any(),
  fieldType: fieldTypeSchema,
  enabled: z.boolean(),
})

export const filterNodeSchema: z.ZodType<any> = z.object({
  id: z.string(),
  type: z.literal("node"),
  operator: logicalOperatorSchema,
  children: z.lazy(() => z.array(z.union([filterNodeSchema, filterLeafSchema]))),
  enabled: z.boolean(),
})

export const filterTreeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  root: filterNodeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  version: z.number(),
})

export const evaluationContextSchema = z.object({
  data: z.record(z.any()),
  timestamp: z.string(),
})
