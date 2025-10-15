import type {
  FilterTree,
  FilterNode,
  FilterLeaf,
  FilterTreeItem,
  EvaluationContext,
  EvaluationResult,
  ComparisonOperator,
} from "@/lib/types/filter-tree"

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Create a new empty filter node
export function createFilterNode(operator: "AND" | "OR" = "AND"): FilterNode {
  return {
    id: generateId(),
    type: "node",
    operator,
    children: [],
    enabled: true,
  }
}

// Create a new filter leaf
export function createFilterLeaf(
  field = "",
  operator: ComparisonOperator = "equals",
  value: any = "",
  fieldType: "string" | "number" | "boolean" | "date" | "array" | "object" = "string",
): FilterLeaf {
  return {
    id: generateId(),
    type: "leaf",
    field,
    operator,
    value,
    fieldType,
    enabled: true,
  }
}

// Create a new filter tree
export function createFilterTree(name: string, createdBy: string): FilterTree {
  return {
    id: generateId(),
    name,
    description: "",
    root: createFilterNode("AND"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    version: 1,
  }
}

// Find an item in the tree by ID
export function findItemById(root: FilterTreeItem, id: string): FilterTreeItem | null {
  if (root.id === id) {
    return root
  }

  if (root.type === "node") {
    for (const child of root.children) {
      const found = findItemById(child, id)
      if (found) return found
    }
  }

  return null
}

// Find parent of an item
export function findParent(root: FilterNode, childId: string): FilterNode | null {
  for (const child of root.children) {
    if (child.id === childId) {
      return root
    }
    if (child.type === "node") {
      const found = findParent(child, childId)
      if (found) return found
    }
  }
  return null
}

// Add a child to a node
export function addChild(tree: FilterTree, parentId: string, child: FilterTreeItem): FilterTree {
  const newTree = JSON.parse(JSON.stringify(tree)) as FilterTree
  const parent = findItemById(newTree.root, parentId) as FilterNode

  if (parent && parent.type === "node") {
    parent.children.push(child)
    newTree.updatedAt = new Date().toISOString()
    newTree.version += 1
  }

  return newTree
}

// Remove a child from a node
export function removeChild(tree: FilterTree, itemId: string): FilterTree {
  const newTree = JSON.parse(JSON.stringify(tree)) as FilterTree
  const parent = findParent(newTree.root, itemId)

  if (parent) {
    parent.children = parent.children.filter((child) => child.id !== itemId)
    newTree.updatedAt = new Date().toISOString()
    newTree.version += 1
  }

  return newTree
}

// Update an item in the tree
export function updateItem(tree: FilterTree, itemId: string, updates: Partial<FilterTreeItem>): FilterTree {
  const newTree = JSON.parse(JSON.stringify(tree)) as FilterTree
  const item = findItemById(newTree.root, itemId)

  if (item) {
    Object.assign(item, updates)
    newTree.updatedAt = new Date().toISOString()
    newTree.version += 1
  }

  return newTree
}

// Get value from nested object using path
function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

// Evaluate a single leaf condition
function evaluateLeaf(leaf: FilterLeaf, data: Record<string, any>): boolean {
  if (!leaf.enabled) return true

  const fieldValue = getValueByPath(data, leaf.field)
  const { operator, value } = leaf

  switch (operator) {
    case "equals":
      return fieldValue === value
    case "not_equals":
      return fieldValue !== value
    case "contains":
      return String(fieldValue).includes(String(value))
    case "not_contains":
      return !String(fieldValue).includes(String(value))
    case "greater_than":
      return Number(fieldValue) > Number(value)
    case "less_than":
      return Number(fieldValue) < Number(value)
    case "greater_than_or_equal":
      return Number(fieldValue) >= Number(value)
    case "less_than_or_equal":
      return Number(fieldValue) <= Number(value)
    case "in":
      return Array.isArray(value) && value.includes(fieldValue)
    case "not_in":
      return Array.isArray(value) && !value.includes(fieldValue)
    case "is_null":
      return fieldValue === null || fieldValue === undefined
    case "is_not_null":
      return fieldValue !== null && fieldValue !== undefined
    default:
      return false
  }
}

// Evaluate a filter tree
export function evaluateTree(item: FilterTreeItem, context: EvaluationContext): EvaluationResult {
  if (item.type === "leaf") {
    const result = evaluateLeaf(item, context.data)
    return {
      passed: result,
      details: {
        nodeId: item.id,
        type: "leaf",
        result,
        operator: item.operator,
      },
    }
  }

  // Node evaluation
  if (!item.enabled) {
    return {
      passed: true,
      details: {
        nodeId: item.id,
        type: "node",
        result: true,
        operator: item.operator,
        children: [],
      },
    }
  }

  const childResults = item.children.map((child) => evaluateTree(child, context))

  let result: boolean
  if (item.operator === "AND") {
    result = childResults.every((r) => r.passed)
  } else {
    // OR
    result = childResults.some((r) => r.passed)
  }

  return {
    passed: result,
    details: {
      nodeId: item.id,
      type: "node",
      result,
      operator: item.operator,
      children: childResults,
    },
  }
}

// Convert tree to text representation
export function treeToText(item: FilterTreeItem, indent = 0): string {
  const prefix = "  ".repeat(indent)

  if (item.type === "leaf") {
    const status = item.enabled ? "" : "[DISABLED] "
    return `${prefix}${status}${item.field} ${item.operator} ${JSON.stringify(item.value)}`
  }

  const status = item.enabled ? "" : "[DISABLED] "
  const lines = [`${prefix}${status}${item.operator}`]

  for (const child of item.children) {
    lines.push(treeToText(child, indent + 1))
  }

  return lines.join("\n")
}

// Count nodes and leaves in tree
export function countItems(item: FilterTreeItem): { nodes: number; leaves: number } {
  if (item.type === "leaf") {
    return { nodes: 0, leaves: 1 }
  }

  let nodes = 1
  let leaves = 0

  for (const child of item.children) {
    const counts = countItems(child)
    nodes += counts.nodes
    leaves += counts.leaves
  }

  return { nodes, leaves }
}
