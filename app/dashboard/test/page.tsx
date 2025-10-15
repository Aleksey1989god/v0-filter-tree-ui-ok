"use client"

import { useState } from "react"
import { useFilterTreeStore } from "@/lib/store/filter-tree-store"
import { FilterTreeView } from "@/components/filter-tree/filter-tree-view"
import { TestDataInput } from "@/components/testing/test-data-input"
import { TestResults } from "@/components/testing/test-results"
import { TestHistory } from "@/components/testing/test-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RotateCcw } from "lucide-react"
import { evaluateTree } from "@/lib/utils/filter-tree"
import type { EvaluationContext, EvaluationResult } from "@/lib/types/filter-tree"

interface TestRun {
  id: string
  timestamp: string
  treeName: string
  result: EvaluationResult
  context: EvaluationContext
}

export default function TestPage() {
  const { trees, currentTreeId, setCurrentTree, getCurrentTree } = useFilterTreeStore()
  const [testData, setTestData] = useState<string>('{\n  "user": {\n    "name": "John Doe",\n    "age": 30\n  }\n}')
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<TestRun[]>([])

  const currentTree = getCurrentTree()

  const handleRunTest = () => {
    if (!currentTree) {
      setError("No filter tree selected")
      return
    }

    try {
      const data = JSON.parse(testData)
      const context: EvaluationContext = {
        data,
        timestamp: new Date().toISOString(),
      }

      const evaluationResult = evaluateTree(currentTree.root, context)
      setResult(evaluationResult)
      setError(null)

      // Add to history
      const testRun: TestRun = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        treeName: currentTree.name,
        result: evaluationResult,
        context,
      }
      setHistory([testRun, ...history.slice(0, 9)]) // Keep last 10 runs
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON data")
      setResult(null)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  const handleLoadFromHistory = (run: TestRun) => {
    setTestData(JSON.stringify(run.context.data, null, 2))
    setResult(run.result)
    setError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Тестирование деревьев фильтров</h2>
          <p className="text-muted-foreground">
            Тестируйте деревья фильтров с примерами данных и смотрите результаты в реальном времени
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Выберите дерево фильтров</CardTitle>
            <CardDescription>Выберите дерево фильтров для тестирования</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={currentTreeId || ""} onValueChange={setCurrentTree}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Выберите дерево фильтров..." />
              </SelectTrigger>
              <SelectContent>
                {trees.map((tree) => (
                  <SelectItem key={tree.id} value={tree.id}>
                    {tree.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {currentTree && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Тестовые данные</CardTitle>
                        <CardDescription>Введите JSON данные для тестирования дерева фильтров</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Сбросить
                        </Button>
                        <Button size="sm" onClick={handleRunTest}>
                          <Play className="h-4 w-4 mr-2" />
                          Запустить тест
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TestDataInput value={testData} onChange={setTestData} error={error} />
                  </CardContent>
                </Card>

                {result && <TestResults result={result} />}
              </div>

              <div className="space-y-4">
                <FilterTreeView tree={currentTree} readOnly />

                {history.length > 0 && <TestHistory history={history} onLoadRun={handleLoadFromHistory} />}
              </div>
            </div>
          </>
        )}

        {!currentTree && (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Дерево фильтров не выбрано</h3>
              <p className="text-sm text-muted-foreground">
                Выберите дерево фильтров из выпадающего списка выше для начала тестирования
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
