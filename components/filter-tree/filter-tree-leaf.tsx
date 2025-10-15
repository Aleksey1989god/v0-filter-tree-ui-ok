"use client"

import type { FilterLeaf, ComparisonOperator } from "@/lib/types/filter-tree"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { FieldSelector } from "@/components/openapi/field-selector"

interface FilterTreeLeafProps {
  leaf: FilterLeaf
  onRemove?: (id: string) => void
  onToggleEnabled?: (id: string) => void
  onUpdate?: (id: string, updates: Partial<FilterLeaf>) => void
  readOnly?: boolean
}

const OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "not contains" },
  { value: "greater_than", label: ">" },
  { value: "less_than", label: "<" },
  { value: "greater_than_or_equal", label: ">=" },
  { value: "less_than_or_equal", label: "<=" },
  { value: "in", label: "in" },
  { value: "not_in", label: "not in" },
  { value: "is_null", label: "is null" },
  { value: "is_not_null", label: "is not null" },
]

export function FilterTreeLeaf({ leaf, onRemove, onToggleEnabled, onUpdate, readOnly = false }: FilterTreeLeafProps) {
  const [localValue, setLocalValue] = useState(leaf.value)

  const handleValueChange = (value: string) => {
    setLocalValue(value)
    onUpdate?.(leaf.id, { value })
  }

  const handleOperatorChange = (operator: ComparisonOperator) => {
    onUpdate?.(leaf.id, { operator })
  }

  const handleFieldChange = (field: string, fieldInfo?: any) => {
    const updates: Partial<FilterLeaf> = { field }
    if (fieldInfo) {
      updates.fieldType = fieldInfo.type
    }
    onUpdate?.(leaf.id, updates)
  }

  const needsValue = !["is_null", "is_not_null"].includes(leaf.operator)

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-md bg-card border border-border ${!leaf.enabled ? "opacity-50" : ""}`}
    >
      <div className="flex-1 flex items-center gap-2">
        {readOnly ? (
          <>
            <span className="font-mono text-sm text-primary">{leaf.field || "field"}</span>
            <span className="text-sm text-muted-foreground">{leaf.operator}</span>
            {needsValue && <span className="font-mono text-sm">{JSON.stringify(leaf.value)}</span>}
          </>
        ) : (
          <>
            <FieldSelector
              value={leaf.field}
              onChange={handleFieldChange}
              className="w-40 h-8 text-sm bg-secondary border-border"
            />

            <Select value={leaf.operator} onValueChange={handleOperatorChange}>
              <SelectTrigger className="w-32 h-8 text-sm bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value} className="text-sm">
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {needsValue && (
              <Input
                value={localValue}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="value"
                className="w-40 h-8 text-sm font-mono bg-secondary border-border"
              />
            )}
          </>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onToggleEnabled?.(leaf.id)}>
            {leaf.enabled ? "Disable" : "Enable"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            onClick={() => onRemove?.(leaf.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
