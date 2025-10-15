"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileJson } from "lucide-react"

interface TestDataInputProps {
  value: string
  onChange: (value: string) => void
  error?: string | null
}

const SAMPLE_DATA_TEMPLATES = [
  {
    name: "User Profile",
    data: {
      user: {
        id: 123,
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        role: "admin",
        active: true,
      },
    },
  },
  {
    name: "E-commerce Order",
    data: {
      order: {
        id: "ORD-001",
        total: 299.99,
        status: "completed",
        items: ["item1", "item2"],
        customer: {
          name: "Jane Smith",
          tier: "premium",
        },
      },
    },
  },
  {
    name: "API Request",
    data: {
      request: {
        method: "POST",
        path: "/api/users",
        headers: {
          "content-type": "application/json",
        },
        body: {
          username: "testuser",
        },
      },
    },
  },
]

export function TestDataInput({ value, onChange, error }: TestDataInputProps) {
  const handleLoadTemplate = (template: (typeof SAMPLE_DATA_TEMPLATES)[0]) => {
    onChange(JSON.stringify(template.data, null, 2))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Templates:</span>
        {SAMPLE_DATA_TEMPLATES.map((template) => (
          <Button key={template.name} variant="outline" size="sm" onClick={() => handleLoadTemplate(template)}>
            <FileJson className="h-3 w-3 mr-1" />
            {template.name}
          </Button>
        ))}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{\n  "field": "value"\n}'
        className="font-mono text-sm bg-secondary border-border resize-none"
        rows={16}
      />

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
    </div>
  )
}
