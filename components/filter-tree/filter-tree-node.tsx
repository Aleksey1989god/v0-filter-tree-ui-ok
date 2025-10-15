"use client"

import type { FilterNode } from "@/lib/types/filter-tree"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { FilterTreeLeaf } from "./filter-tree-leaf"

interface FilterTreeNodeProps {
  node: FilterNode
  onAddNode?: (parentId: string) => void
  onAddLeaf?: (parentId: string) => void
  onRemove?: (id: string) => void
  onToggleOperator?: (id: string) => void
  onToggleEnabled?: (id: string) => void
  onUpdateLeaf?: (id: string, updates: any) => void
  isRoot?: boolean
  readOnly?: boolean
}

export function FilterTreeNode({
  node,
  onAddNode,
  onAddLeaf,
  onRemove,
  onToggleOperator,
  onToggleEnabled,
  onUpdateLeaf,
  isRoot = false,
  readOnly = false,
}: FilterTreeNodeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge
          variant={node.operator === "AND" ? "default" : "secondary"}
          className={`cursor-pointer font-mono text-xs ${!node.enabled ? "opacity-50" : ""}`}
          onClick={() => !readOnly && onToggleOperator?.(node.id)}
        >
          {node.operator}
        </Badge>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onAddNode?.(node.id)}>
              <Plus className="h-3 w-3 mr-1" />
              Group
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onAddLeaf?.(node.id)}>
              <Plus className="h-3 w-3 mr-1" />
              Condition
            </Button>
            {!isRoot && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onToggleEnabled?.(node.id)}
                >
                  {node.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => onRemove?.(node.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="ml-6 border-l-2 border-border pl-4 space-y-2">
          {node.children.map((child) =>
            child.type === "node" ? (
              <FilterTreeNode
                key={child.id}
                node={child}
                onAddNode={onAddNode}
                onAddLeaf={onAddLeaf}
                onRemove={onRemove}
                onToggleOperator={onToggleOperator}
                onToggleEnabled={onToggleEnabled}
                onUpdateLeaf={onUpdateLeaf}
                readOnly={readOnly}
              />
            ) : (
              <FilterTreeLeaf
                key={child.id}
                leaf={child}
                onRemove={onRemove}
                onToggleEnabled={onToggleEnabled}
                onUpdate={onUpdateLeaf}
                readOnly={readOnly}
              />
            ),
          )}
        </div>
      )}

      {node.children.length === 0 && !readOnly && (
        <div className="ml-6 text-sm text-muted-foreground italic">
          No conditions yet. Add a group or condition to get started.
        </div>
      )}
    </div>
  )
}
