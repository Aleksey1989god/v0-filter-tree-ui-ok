export type UserRole = "admin" | "user"

export interface User {
  username: string
  role: UserRole
}

// Mock user database - in production, this would be a real database
const USERS: Record<string, { password: string; role: UserRole }> = {
  admin: { password: "admin123", role: "admin" },
  user: { password: "user123", role: "user" },
}

export async function validateCredentials(username: string, password: string): Promise<User | null> {
  const user = USERS[username]
  if (user && user.password === password) {
    return { username, role: user.role }
  }
  return null
}
