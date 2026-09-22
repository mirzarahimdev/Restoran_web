import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type PanelRole = 'admin' | 'super-admin'

export type PanelUser = {
  username: string
  displayName: string
  role: PanelRole
}

type AdminAuthContextValue = {
  user: PanelUser | null
  login: (username: string, password: string, expectedRole: PanelRole) => void
  logout: () => void
  isRole: (role: PanelRole) => boolean
}

const STORAGE_KEY = 'fooduz_panel_auth'

const CREDENTIALS: Record<
  PanelRole,
  { username: string; password: string; displayName: string }
> = {
  admin: {
    username: 'Admin',
    password: 'admin123',
    displayName: 'Aziza Karimova',
  },
  'super-admin': {
    username: 'Superadmin',
    password: 'superadmin123',
    displayName: 'Aziza Karimova',
  },
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function readStoredPanelUser(): PanelUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PanelUser
    if (parsed?.role === 'admin' || parsed?.role === 'super-admin') return parsed
  } catch {
    /* ignore */
  }
  return null
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PanelUser | null>(() => readStoredPanelUser())

  // Sahifa yangilanganda / HMR da sessiyani tiklash
  useEffect(() => {
    const stored = readStoredPanelUser()
    if (stored && !user) setUser(stored)
  }, [user])

  const login = useCallback((username: string, password: string, expectedRole: PanelRole) => {
    const cred = CREDENTIALS[expectedRole]
    const loginName = username.trim()
    if (
      loginName.toLowerCase() !== cred.username.toLowerCase() ||
      password !== cred.password
    ) {
      throw new Error('Login yoki parol noto‘g‘ri')
    }

    const next: PanelUser = {
      username: cred.username,
      displayName: cred.displayName,
      role: expectedRole,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const isRole = useCallback((role: PanelRole) => user?.role === role, [user])

  const value = useMemo(
    () => ({ user, login, logout, isRole }),
    [user, login, logout, isRole],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export function panelHomePath(role: PanelRole) {
  return role === 'super-admin' ? '/super-admin' : '/admin'
}

export function panelLoginPath(_role?: PanelRole) {
  return '/kirish'
}

export function matchPanelRole(username: string, password: string): PanelRole | null {
  const loginName = username.trim().toLowerCase()
  for (const role of Object.keys(CREDENTIALS) as PanelRole[]) {
    const cred = CREDENTIALS[role]
    if (loginName === cred.username.toLowerCase() && password === cred.password) {
      return role
    }
  }
  return null
}

export function isPanelUsername(username: string): boolean {
  const loginName = username.trim().toLowerCase()
  return (Object.keys(CREDENTIALS) as PanelRole[]).some(
    (role) => CREDENTIALS[role].username.toLowerCase() === loginName,
  )
}
