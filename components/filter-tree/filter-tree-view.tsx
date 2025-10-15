"use client"

import type { FilterTree } from "@/lib/types/filter-tree"
import { FilterTreeNode } from "./filter-tree-node"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { countItems } from "@/lib/utils/filter-tree"

interface FilterTreeViewProps {
  tree: FilterTree
  onAddNode?: (parentId: string) => void
  onAddLeaf?: (parentId: string) => void
  onRemove?: (id: string) => void
  onToggleOperator?: (id: string) => void
  onToggleEnabled?: (id: string) => void
  onUpdateLeaf?: (id: string, updates: any) => void
  readOnly?: boolean
}

export function FilterTreeView({
  tree,
  onAddNode,
  onAddLeaf,
  onRemove,
  onToggleOperator,
  onToggleEnabled,
  onUpdateLeaf,
  readOnly = false,
}: FilterTreeViewProps) {
  const counts = countItems(tree.root)

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{tree.name}</CardTitle>
            {tree.description && <CardDescription className="mt-1">{tree.description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {counts.nodes} groups
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {counts.leaves} conditions
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              v{tree.version}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FilterTreeNode
          node={tree.root}
          onAddNode={onAddNode}
          onAddLeaf={onAddLeaf}
          onRemove={onRemove}
          onToggleOperator={onToggleOperator}
          onToggleEnabled={onToggleEnabled}
          onUpdateLeaf={onUpdateLeaf}
          isRoot
          readOnly={readOnly}
        />
      </CardContent>
    </Card>
  )
}
