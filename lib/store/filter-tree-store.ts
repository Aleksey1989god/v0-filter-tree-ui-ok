import { create } from "zustand"
import type { FilterTree, FilterTreeMetadata, HistoryEntry } from "@/lib/types/filter-tree"
import { createFilterTree } from "@/lib/utils/filter-tree"

interface FilterTreeStore {
  // Current trees
  trees: FilterTree[]
  currentTreeId: string | null

  // History for undo/redo
  history: HistoryEntry[]
  historyIndex: number
  maxHistorySize: number

  // Actions
  setTrees: (trees: FilterTree[]) => void
  addTree: (tree: FilterTree) => void
  updateTree: (tree: FilterTree) => void
  deleteTree: (id: string) => void
  setCurrentTree: (id: string | null) => void
  getCurrentTree: () => FilterTree | null

  // History actions
  addToHistory: (tree: FilterTree, action: string) => void
  undo: () => FilterTree | null
  redo: () => FilterTree | null
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void

  // Utility
  getTreeMetadata: () => FilterTreeMetadata[]
  createNewTree: (name: string, createdBy: string) => FilterTree
}

export const useFilterTreeStore = create<FilterTreeStore>((set, get) => ({
  trees: [],
  currentTreeId: null,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  setTrees: (trees) => set({ trees }),

  addTree: (tree) =>
    set((state) => ({
      trees: [...state.trees, tree],
      currentTreeId: tree.id,
    })),

  updateTree: (tree) =>
    set((state) => ({
      trees: state.trees.map((t) => (t.id === tree.id ? tree : t)),
    })),

  deleteTree: (id) =>
    set((state) => ({
      trees: state.trees.filter((t) => t.id !== id),
      currentTreeId: state.currentTreeId === id ? null : state.currentTreeId,
    })),

  setCurrentTree: (id) => set({ currentTreeId: id }),

  getCurrentTree: () => {
    const state = get()
    return state.trees.find((t) => t.id === state.currentTreeId) || null
  },

  addToHistory: (tree, action) =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push({
        tree: JSON.parse(JSON.stringify(tree)),
        timestamp: new Date().toISOString(),
        action,
      })

      // Limit history size
      if (newHistory.length > state.maxHistorySize) {
        newHistory.shift()
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }),

  undo: () => {
    const state = get()
    if (!state.canUndo()) return null

    const newIndex = state.historyIndex - 1
    const entry = state.history[newIndex]

    set({ historyIndex: newIndex })
    get().updateTree(entry.tree)

    return entry.tree
  },

  redo: () => {
    const state = get()
    if (!state.canRedo()) return null

    const newIndex = state.historyIndex + 1
    const entry = state.history[newIndex]

    set({ historyIndex: newIndex })
    get().updateTree(entry.tree)

    return entry.tree
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  clearHistory: () => set({ history: [], historyIndex: -1 }),

  getTreeMetadata: () => {
    const state = get()
    return state.trees.map((tree) => ({
      id: tree.id,
      name: tree.name,
      description: tree.description,
      createdAt: tree.createdAt,
      updatedAt: tree.updatedAt,
      createdBy: tree.createdBy,
      version: tree.version,
    }))
  },

  createNewTree: (name, createdBy) => {
    const tree = createFilterTree(name, createdBy)
    get().addTree(tree)
    get().addToHistory(tree, "Created tree")
    return tree
  },
}))
