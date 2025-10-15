"use server"

import { validateCredentials } from "@/lib/auth"
import type { User } from "@/lib/auth"

export async function login(prevState: { error: string | null; user?: User } | null, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const user = await validateCredentials(username, password)

  if (!user) {
    return { error: "Invalid credentials" }
  }

  return { error: null, user }
}
