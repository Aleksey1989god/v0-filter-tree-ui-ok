"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TestRun {
  id: string
  timestamp: string
  treeName: string
  result: {
    passed: boolean
  }
  context: {
    data: Record<string, any>
  }
}

interface TestHistoryProps {
  history: TestRun[]
  onLoadRun: (run: TestRun) => void
}

export function TestHistory({ history, onLoadRun }: TestHistoryProps) {
  if (history.length === 0) {
    return null
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Test History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((run) => (
            <div
              key={run.id}
              className="flex items-center gap-2 p-3 rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              {run.result.passed ? (
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium truncate">{run.treeName}</span>
                  <Badge variant={run.result.passed ? "default" : "destructive"} className="text-xs">
                    {run.result.passed ? "Pass" : "Fail"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(run.timestamp), { addSuffix: true })}
                </p>
              </div>

              <Button variant="ghost" size="sm" onClick={() => onLoadRun(run)}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
