"use client"

import { useState } from "react"
import { useFilterTreeStore } from "@/lib/store/filter-tree-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NewTreeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTreeDialog({ open, onOpenChange }: NewTreeDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { createNewTree } = useFilterTreeStore()

  const handleCreate = () => {
    if (!name.trim()) return

    // In a real app, we'd get the username from the session
    createNewTree(name, "current-user")

    // Reset form
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новое дерево фильтров</DialogTitle>
          <DialogDescription>
            Создайте новое логическое дерево фильтров с операторами AND/OR и условиями.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="например, Фильтр сегментации пользователей"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание (опционально)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите назначение этого дерева фильтров..."
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Создать дерево фильтров
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
