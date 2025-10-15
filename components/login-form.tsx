"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions/auth"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Вход..." : "Войти"}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [redirecting, setRedirecting] = useState(false)
  const [state, formAction] = useActionState(login, { error: null })

  useEffect(() => {
    if (state?.user && !redirecting) {
      setRedirecting(true)
      setUser(state.user)
      router.push("/dashboard")
    }
  }, [state, redirecting, setUser, router])

  if (redirecting) {
    return (
      <Card className="w-full max-w-md border-border">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Перенаправление на панель управления...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Конструктор фильтров</CardTitle>
        <CardDescription className="text-muted-foreground">
          Введите учетные данные для доступа к приложению
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="admin или user"
              required
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              required
              className="bg-secondary border-border"
            />
          </div>
          {state?.error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{state.error}</div>
          )}
          <SubmitButton />
          <div className="text-xs text-muted-foreground mt-4 space-y-1">
            <p>Демо учетные данные:</p>
            <p className="font-mono">admin / admin123 (полный доступ)</p>
            <p className="font-mono">user / user123 (только чтение)</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
