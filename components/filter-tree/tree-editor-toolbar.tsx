"use client"

import type { FilterTree } from "@/lib/types/filter-tree"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Undo2, Redo2, Save } from "lucide-react"
import { useState } from "react"

interface TreeEditorToolbarProps {
  tree: FilterTree
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onUpdateTree: (tree: FilterTree) => void
}

export function TreeEditorToolbar({ tree, canUndo, canRedo, onUndo, onRedo, onUpdateTree }: TreeEditorToolbarProps) {
  const [name, setName] = useState(tree.name)
  const [description, setDescription] = useState(tree.description || "")

  const handleSave = () => {
    const updatedTree = {
      ...tree,
      name,
      description,
      updatedAt: new Date().toISOString(),
    }
    onUpdateTree(updatedTree)
  }

  const hasChanges = name !== tree.name || description !== tree.description

  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} title="Отменить (Cmd/Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} title="Повторить (Cmd/Ctrl+Shift+Z)">
          <Redo2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" />
          Сохранить
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Версия {tree.version}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Последнее обновление: {new Date(tree.updatedAt).toLocaleString("ru-RU")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Название</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название дерева фильтров"
            className="bg-secondary border-border"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Описание</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опциональное описание"
            className="bg-secondary border-border"
          />
        </div>
      </div>
    </div>
  )
}
