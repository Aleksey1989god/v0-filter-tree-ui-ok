"use client"

import type { FilterField } from "@/lib/types/filter-tree"
import { useOpenAPIStore } from "@/lib/store/openapi-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

interface FieldSelectorProps {
  value: string
  onChange: (value: string, field?: FilterField) => void
  className?: string
}

export function FieldSelector({ value, onChange, className }: FieldSelectorProps) {
  const [open, setOpen] = useState(false)
  const { fields, schemaLoaded } = useOpenAPIStore()

  if (!schemaLoaded || fields.length === 0) {
    return (
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="field.path" className={className} />
    )
  }

  const selectedField = fields.find((f) => f.path === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between font-mono text-sm ${className}`}
        >
          {selectedField ? (
            <span className="flex items-center gap-2">
              {selectedField.name}
              <Badge variant="secondary" className="text-xs">
                {selectedField.type}
              </Badge>
            </span>
          ) : (
            <span className="text-muted-foreground">Select field...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search fields..." />
          <CommandList>
            <CommandEmpty>No field found.</CommandEmpty>
            <CommandGroup>
              {fields.map((field) => (
                <CommandItem
                  key={field.path}
                  value={field.path}
                  onSelect={() => {
                    onChange(field.path, field)
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === field.path ? "opacity-100" : "opacity-0"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{field.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{field.path}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
