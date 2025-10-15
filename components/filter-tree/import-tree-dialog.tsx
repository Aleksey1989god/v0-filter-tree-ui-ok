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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { filterTreeSchema } from "@/lib/schemas/filter-tree"
import type { FilterTree } from "@/lib/types/filter-tree"

interface ImportTreeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportTreeDialog({ open, onOpenChange }: ImportTreeDialogProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { addTree } = useFilterTreeStore()

  const handleImport = () => {
    setError(null)

    try {
      const parsed = JSON.parse(jsonInput)
      const validated = filterTreeSchema.parse(parsed)

      addTree(validated as FilterTree)
      setJsonInput("")
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Invalid JSON format")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Filter Tree</DialogTitle>
          <DialogDescription>Paste a JSON representation of a filter tree to import it.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="json">JSON Data</Label>
            <Textarea
              id="json"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"id": "...", "name": "...", ...}'
              className="bg-secondary border-border font-mono text-xs resize-none"
              rows={12}
            />
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonInput.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
