// Core filter tree types based on the specification

export type LogicalOperator = "AND" | "OR"

export type ComparisonOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null"

export type FieldType = "string" | "number" | "boolean" | "date" | "array" | "object"

export interface FilterField {
  name: string
  path: string // JSON path, e.g., "user.profile.email"
  type: FieldType
  description?: string
  enum?: string[] // For fields with predefined values
}

export interface FilterLeaf {
  id: string
  type: "leaf"
  field: string // Field path
  operator: ComparisonOperator
  value: any
  fieldType: FieldType
  enabled: boolean
}

export interface FilterNode {
  id: string
  type: "node"
  operator: LogicalOperator
  children: (FilterNode | FilterLeaf)[]
  enabled: boolean
}

export type FilterTreeItem = FilterNode | FilterLeaf

export interface FilterTree {
  id: string
  name: string
  description?: string
  root: FilterNode
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

export interface FilterTreeMetadata {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

// Evaluation context for testing filters
export interface EvaluationContext {
  data: Record<string, any>
  timestamp: string
}

export interface EvaluationResult {
  passed: boolean
  details: {
    nodeId: string
    type: "node" | "leaf"
    result: boolean
    operator?: LogicalOperator | ComparisonOperator
    children?: EvaluationResult[]
  }
}

// History for undo/redo
export interface HistoryEntry {
  tree: FilterTree
  timestamp: string
  action: string
}
