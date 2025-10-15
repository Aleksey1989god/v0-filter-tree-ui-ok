"use client"

import type { FilterTree } from "@/lib/types/filter-tree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import { useState } from "react"

interface FilterTreeJsonViewProps {
  tree: FilterTree
}

export function FilterTreeJsonView({ tree }: FilterTreeJsonViewProps) {
  const [copied, setCopied] = useState(false)
  const jsonString = JSON.stringify(tree, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tree.name.replace(/\s+/g, "-").toLowerCase()}-${tree.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">JSON Export</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-xs font-mono text-foreground max-h-96">
          {jsonString}
        </pre>
      </CardContent>
    </Card>
  )
}
