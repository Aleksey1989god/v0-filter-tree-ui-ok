"use client"

import type { User } from "@/lib/store/auth-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Конструктор фильтров</h1>
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
              {user.role === "admin" ? "администратор" : "пользователь"}
            </Badge>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm">
                Главная
              </Button>
            </Link>
            <Link href="/dashboard/builder">
              <Button variant={pathname === "/dashboard/builder" ? "secondary" : "ghost"} size="sm">
                Конструктор
              </Button>
            </Link>
            <Link href="/dashboard/schema">
              <Button variant={pathname === "/dashboard/schema" ? "secondary" : "ghost"} size="sm">
                Схема
              </Button>
            </Link>
            <Link href="/dashboard/test">
              <Button variant={pathname === "/dashboard/test" ? "secondary" : "ghost"} size="sm">
                Тестирование
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.username}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  )
}
