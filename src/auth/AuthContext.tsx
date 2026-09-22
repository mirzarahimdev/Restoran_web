import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api'
import type { UserDto } from '../api/types'
import { requestGoogleAccessToken } from './google'

const TOKEN_KEY = 'fooduz_token'
const USER_KEY = 'fooduz_user'

type AuthContextValue = {
  user: UserDto | null
  token: string | null
  login: (payload: {
    login?: string
    phone?: string
    email?: string
    password: string
  }) => Promise<void>
  register: (payload: {
    fullName: string
    phone: string
    email?: string
    password: string
  }) => Promise<void>
  loginWithGoogle: () => Promise<void>
  updateProfile: (payload: {
    fullName?: string
    phone?: string
    email?: string
    avatar?: string
  }) => Promise<void>
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): UserDto | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as UserDto) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<UserDto | null>(() => readStoredUser())

  const persist = useCallback((nextToken: string, nextUser: UserDto) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const persistUser = useCallback((nextUser: UserDto) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    api
      .me(token)
      .then((next) => {
        if (!cancelled) persistUser(next)
      })
      .catch(() => {
        /* keep cached user if offline */
      })
    return () => {
      cancelled = true
    }
  }, [token, persistUser])

  const login = useCallback(
    async (payload: {
      login?: string
      phone?: string
      email?: string
      password: string
    }) => {
      const res = await api.login(payload)
      persist(res.accessToken, res.user)
    },
    [persist],
  )

  const register = useCallback(
    async (payload: {
      fullName: string
      phone: string
      email?: string
      password: string
    }) => {
      const res = await api.register(payload)
      persist(res.accessToken, res.user)
    },
    [persist],
  )

  const loginWithGoogle = useCallback(async () => {
    const accessToken = await requestGoogleAccessToken()
    const res = await api.googleAuth(accessToken)
    persist(res.accessToken, res.user)
  }, [persist])

  const updateProfile = useCallback(
    async (payload: { fullName?: string; phone?: string; email?: string; avatar?: string }) => {
      if (!token) throw new Error('Not authenticated')
      const next = await api.updateProfile(payload, token)
      persistUser(next)
    },
    [token, persistUser],
  )

  const changePassword = useCallback(
    async (payload: { currentPassword: string; newPassword: string }) => {
      if (!token) throw new Error('Not authenticated')
      await api.changePassword(payload, token)
    },
    [token],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      loginWithGoogle,
      updateProfile,
      changePassword,
      logout,
    }),
    [user, token, login, register, loginWithGoogle, updateProfile, changePassword, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
