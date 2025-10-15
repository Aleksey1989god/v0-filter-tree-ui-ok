"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileJson, TestTube } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ImportTreeDialog } from "@/components/filter-tree/import-tree-dialog"
import { useFilterTreeStore } from "@/lib/store/filter-tree-store"

export default function DashboardPage() {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const { trees } = useFilterTreeStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Деревья фильтров</h2>
            <p className="text-muted-foreground">
              Создавайте и управляйте логическими деревьями фильтров с помощью drag-and-drop интерфейса
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <FileJson className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Link href="/dashboard/builder">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Новое дерево фильтров
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/builder">
            <div className="border border-border rounded-lg p-6 bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">Деревья фильтров</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Создавайте и управляйте сложными логическими структурами фильтров
              </p>
              <div className="text-2xl font-bold">{trees.length}</div>
            </div>
          </Link>

          <Link href="/dashboard/schema">
            <div className="border border-border rounded-lg p-6 bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">Схема OpenAPI</h3>
              <p className="text-sm text-muted-foreground mb-4">Загрузите и управляйте API схемами для выбора полей</p>
              <div className="text-2xl font-bold">Настроить</div>
            </div>
          </Link>

          <Link href="/dashboard/test">
            <div className="border border-border rounded-lg p-6 bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">Тестирование фильтров</h3>
              <p className="text-sm text-muted-foreground mb-4">Тестируйте фильтры с примерами данных</p>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <TestTube className="h-6 w-6" />
                Запустить тесты
              </div>
            </div>
          </Link>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4">Быстрый старт</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Создайте новое дерево фильтров с логическими операторами AND/OR</p>
            <p>2. Загрузите схему OpenAPI для использования её полей (опционально)</p>
            <p>3. Добавьте условия фильтрации с путями полей, операторами и значениями</p>
            <p>4. Протестируйте фильтры с примерами JSON данных</p>
            <p>5. Экспортируйте дерево фильтров в JSON для развертывания</p>
          </div>
        </div>
      </div>

      <ImportTreeDialog open={showImportDialog} onOpenChange={setShowImportDialog} />
    </div>
  )
}
