"use client"

import { useEffect, useState } from "react"
import { useFilterTreeStore } from "@/lib/store/filter-tree-store"
import { FilterTreeView } from "@/components/filter-tree/filter-tree-view"
import { FilterTreeTextView } from "@/components/filter-tree/filter-tree-text-view"
import { FilterTreeJsonView } from "@/components/filter-tree/filter-tree-json-view"
import { FilterTreeList } from "@/components/filter-tree/filter-tree-list"
import { TreeEditorToolbar } from "@/components/filter-tree/tree-editor-toolbar"
import { NewTreeDialog } from "@/components/filter-tree/new-tree-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { addChild, removeChild, createFilterNode, createFilterLeaf } from "@/lib/utils/filter-tree"

export default function BuilderPage() {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  const {
    trees,
    currentTreeId,
    setCurrentTree,
    updateTree,
    deleteTree,
    getCurrentTree,
    getTreeMetadata,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useFilterTreeStore()

  const currentTree = getCurrentTree()
  const metadata = getTreeMetadata()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  const handleAddNode = (parentId: string) => {
    if (!currentTree) return
    const newNode = createFilterNode("AND")
    const updatedTree = addChild(currentTree, parentId, newNode)
    updateTree(updatedTree)
    addToHistory(updatedTree, "Added group")
  }

  const handleAddLeaf = (parentId: string) => {
    if (!currentTree) return
    const newLeaf = createFilterLeaf()
    const updatedTree = addChild(currentTree, parentId, newLeaf)
    updateTree(updatedTree)
    addToHistory(updatedTree, "Added condition")
  }

  const handleRemove = (id: string) => {
    if (!currentTree) return
    const updatedTree = removeChild(currentTree, id)
    updateTree(updatedTree)
    addToHistory(updatedTree, "Removed item")
  }

  const handleToggleOperator = (id: string) => {
    if (!currentTree) return
    const item = currentTree.root
    const findAndToggle = (node: any): any => {
      if (node.id === id && node.type === "node") {
        return { ...node, operator: node.operator === "AND" ? "OR" : "AND" }
      }
      if (node.type === "node") {
        return { ...node, children: node.children.map(findAndToggle) }
      }
      return node
    }
    const updatedTree = { ...currentTree, root: findAndToggle(currentTree.root) }
    updateTree(updatedTree)
    addToHistory(updatedTree, "Toggled operator")
  }

  const handleToggleEnabled = (id: string) => {
    if (!currentTree) return
    const findAndToggle = (node: any): any => {
      if (node.id === id) {
        return { ...node, enabled: !node.enabled }
      }
      if (node.type === "node") {
        return { ...node, children: node.children.map(findAndToggle) }
      }
      return node
    }
    const updatedTree = { ...currentTree, root: findAndToggle(currentTree.root) }
    updateTree(updatedTree)
    addToHistory(updatedTree, "Toggled enabled")
  }

  const handleUpdateLeaf = (id: string, updates: any) => {
    if (!currentTree) return
    const findAndUpdate = (node: any): any => {
      if (node.id === id) {
        return { ...node, ...updates }
      }
      if (node.type === "node") {
        return { ...node, children: node.children.map(findAndUpdate) }
      }
      return node
    }
    const updatedTree = { ...currentTree, root: findAndUpdate(currentTree.root) }
    updateTree(updatedTree)
    addToHistory(updatedTree, "Updated condition")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Tree List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Деревья фильтров</h2>
            <Button size="sm" onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FilterTreeList
            trees={metadata}
            currentTreeId={currentTreeId}
            onSelect={setCurrentTree}
            onDelete={deleteTree}
          />
        </div>

        {/* Main Content - Tree Editor */}
        <div className="lg:col-span-3 space-y-4">
          {currentTree ? (
            <>
              <TreeEditorToolbar
                tree={currentTree}
                canUndo={canUndo()}
                canRedo={canRedo()}
                onUndo={undo}
                onRedo={redo}
                onUpdateTree={updateTree}
              />

              <Tabs defaultValue="visual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visual">Визуальный</TabsTrigger>
                  <TabsTrigger value="text">Текстовый</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="visual" className="space-y-4">
                  <FilterTreeView
                    tree={currentTree}
                    onAddNode={handleAddNode}
                    onAddLeaf={handleAddLeaf}
                    onRemove={handleRemove}
                    onToggleOperator={handleToggleOperator}
                    onToggleEnabled={handleToggleEnabled}
                    onUpdateLeaf={handleUpdateLeaf}
                  />
                </TabsContent>
                <TabsContent value="text">
                  <FilterTreeTextView tree={currentTree} />
                </TabsContent>
                <TabsContent value="json">
                  <FilterTreeJsonView tree={currentTree} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="border border-border rounded-lg p-12 text-center bg-card">
              <h3 className="text-xl font-semibold mb-2">Дерево фильтров не выбрано</h3>
              <p className="text-muted-foreground mb-6">
                Выберите дерево фильтров из списка или создайте новое для начала работы.
              </p>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать новое дерево фильтров
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewTreeDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
    </div>
  )
}
