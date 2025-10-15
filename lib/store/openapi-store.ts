import { create } from "zustand"
import type { FilterField } from "@/lib/types/filter-tree"

interface OpenAPIStore {
  // OpenAPI schema data
  fields: FilterField[]
  schemaUrl: string | null
  schemaLoaded: boolean
  schemaError: string | null

  // Actions
  setFields: (fields: FilterField[]) => void
  loadSchema: (url: string) => Promise<void>
  clearSchema: () => void
  getFieldByPath: (path: string) => FilterField | undefined
}

export const useOpenAPIStore = create<OpenAPIStore>((set, get) => ({
  fields: [],
  schemaUrl: null,
  schemaLoaded: false,
  schemaError: null,

  setFields: (fields) => set({ fields, schemaLoaded: true }),

  loadSchema: async (url) => {
    set({ schemaUrl: url, schemaLoaded: false, schemaError: null })

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load schema: ${response.statusText}`)
      }

      const schema = await response.json()

      // Parse OpenAPI schema and extract fields
      // This is a simplified version - real implementation would be more complex
      const fields: FilterField[] = []

      // Extract fields from schema components
      if (schema.components?.schemas) {
        for (const [schemaName, schemaObj] of Object.entries(schema.components.schemas)) {
          const properties = (schemaObj as any).properties || {}

          for (const [propName, propObj] of Object.entries(properties)) {
            const prop = propObj as any
            fields.push({
              name: propName,
              path: `${schemaName}.${propName}`,
              type: mapOpenAPITypeToFieldType(prop.type),
              description: prop.description,
              enum: prop.enum,
            })
          }
        }
      }

      set({ fields, schemaLoaded: true, schemaError: null })
    } catch (error) {
      set({
        schemaError: error instanceof Error ? error.message : "Unknown error",
        schemaLoaded: false,
      })
    }
  },

  clearSchema: () =>
    set({
      fields: [],
      schemaUrl: null,
      schemaLoaded: false,
      schemaError: null,
    }),

  getFieldByPath: (path) => {
    const state = get()
    return state.fields.find((f) => f.path === path)
  },
}))

// Helper function to map OpenAPI types to our field types
function mapOpenAPITypeToFieldType(openAPIType: string): FilterField["type"] {
  switch (openAPIType) {
    case "string":
      return "string"
    case "number":
    case "integer":
      return "number"
    case "boolean":
      return "boolean"
    case "array":
      return "array"
    case "object":
      return "object"
    default:
      return "string"
  }
}
