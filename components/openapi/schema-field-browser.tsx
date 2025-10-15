"use client"

import type { FilterField } from "@/lib/types/filter-tree"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search } from "lucide-react"

interface SchemaFieldBrowserProps {
  fields: FilterField[]
}

export function SchemaFieldBrowser({ fields }: SchemaFieldBrowserProps) {
  const [search, setSearch] = useState("")

  const filteredFields = fields.filter(
    (field) =>
      field.name.toLowerCase().includes(search.toLowerCase()) ||
      field.path.toLowerCase().includes(search.toLowerCase()) ||
      field.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "string":
        return "bg-blue-500/10 text-blue-500"
      case "number":
        return "bg-green-500/10 text-green-500"
      case "boolean":
        return "bg-purple-500/10 text-purple-500"
      case "date":
        return "bg-orange-500/10 text-orange-500"
      case "array":
        return "bg-pink-500/10 text-pink-500"
      case "object":
        return "bg-cyan-500/10 text-cyan-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fields..."
          className="pl-9 bg-secondary border-border"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredFields.map((field) => (
          <div
            key={field.path}
            className="border border-border rounded-lg p-3 bg-card hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold">{field.name}</span>
                  <Badge className={`text-xs ${getTypeColor(field.type)}`}>{field.type}</Badge>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{field.path}</p>
              </div>
            </div>
            {field.description && <p className="text-sm text-muted-foreground mt-2">{field.description}</p>}
            {field.enum && (
              <div className="mt-2 flex flex-wrap gap-1">
                {field.enum.map((value) => (
                  <Badge key={value} variant="outline" className="text-xs font-mono">
                    {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredFields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No fields found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
