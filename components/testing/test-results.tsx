"use client"

import type { EvaluationResult } from "@/lib/types/filter-tree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { useState } from "react"

interface TestResultsProps {
  result: EvaluationResult
}

export function TestResults({ result }: TestResultsProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Test Results</CardTitle>
          <Badge variant={result.passed ? "default" : "destructive"} className="text-sm">
            {result.passed ? "PASSED" : "FAILED"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResultNode result={result} />
      </CardContent>
    </Card>
  )
}

function ResultNode({ result, depth = 0 }: { result: EvaluationResult; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = result.details.children && result.details.children.length > 0

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-2 p-2 rounded-md ${result.passed ? "bg-success/10" : "bg-destructive/10"}`}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="hover:bg-background/50 rounded p-0.5">
            <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        )}

        {result.passed ? (
          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        )}

        <div className="flex-1 flex items-center gap-2">
          {result.details.type === "node" ? (
            <>
              <Badge variant="outline" className="font-mono text-xs">
                {result.details.operator}
              </Badge>
              <span className="text-sm text-muted-foreground">{result.details.children?.length || 0} conditions</span>
            </>
          ) : (
            <span className="text-sm font-mono">{result.details.operator}</span>
          )}
        </div>

        <Badge variant={result.passed ? "default" : "destructive"} className="text-xs">
          {result.passed ? "Pass" : "Fail"}
        </Badge>
      </div>

      {expanded && hasChildren && (
        <div className="space-y-2">
          {result.details.children?.map((child, index) => (
            <ResultNode key={index} result={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
