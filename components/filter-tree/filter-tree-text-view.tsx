"use client"

import type { FilterTree } from "@/lib/types/filter-tree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { treeToText } from "@/lib/utils/filter-tree"
import { useState } from "react"

interface FilterTreeTextViewProps {
  tree: FilterTree
}

export function FilterTreeTextView({ tree }: FilterTreeTextViewProps) {
  const [copied, setCopied] = useState(false)
  const textRepresentation = treeToText(tree.root)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textRepresentation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Text Representation</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm font-mono text-foreground">
          {textRepresentation}
        </pre>
      </CardContent>
    </Card>
  )
}
