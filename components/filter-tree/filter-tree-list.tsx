"use client"

import type { FilterTreeMetadata } from "@/lib/types/filter-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface FilterTreeListProps {
  trees: FilterTreeMetadata[]
  currentTreeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function FilterTreeList({ trees, currentTreeId, onSelect, onDelete }: FilterTreeListProps) {
  if (trees.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>No filter trees yet. Create your first one to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {trees.map((tree) => (
        <Card
          key={tree.id}
          className={`border-border cursor-pointer transition-colors hover:bg-secondary/50 ${
            currentTreeId === tree.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect(tree.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{tree.name}</h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    v{tree.version}
                  </Badge>
                </div>
                {tree.description && <p className="text-sm text-muted-foreground mb-2">{tree.description}</p>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created by {tree.createdBy}</span>
                  <span>Updated {formatDistanceToNow(new Date(tree.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(tree.id)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(tree.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
