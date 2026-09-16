import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../auth/AuthContext'

const GUEST_KEY = 'fooduz_favorites_guest'

function readGuest(): Set<string> {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function writeGuest(ids: Set<string>) {
  localStorage.setItem(GUEST_KEY, JSON.stringify([...ids]))
}

export function useRestaurantFavorites() {
  const { token } = useAuth()
  const [ids, setIds] = useState<Set<string>>(() => (token ? new Set() : readGuest()))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setIds(readGuest())
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const guest = [...readGuest()]
        if (guest.length) {
          await Promise.allSettled(guest.map((id) => api.addFavorite(id, token)))
          writeGuest(new Set())
        }
        const rows = await api.favorites(token)
        if (!cancelled) setIds(new Set(rows.map((r) => r.id)))
      } catch {
        if (!cancelled) setIds(new Set())
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const isFavorite = useCallback((restaurantId: string) => ids.has(restaurantId), [ids])

  const toggle = useCallback(
    async (restaurantId: string) => {
      const was = ids.has(restaurantId)
      if (!token) {
        setIds((prev) => {
          const next = new Set(prev)
          if (was) next.delete(restaurantId)
          else next.add(restaurantId)
          writeGuest(next)
          return next
        })
        return
      }
      setIds((prev) => {
        const next = new Set(prev)
        if (was) next.delete(restaurantId)
        else next.add(restaurantId)
        return next
      })
      try {
        if (was) await api.removeFavorite(restaurantId, token)
        else await api.addFavorite(restaurantId, token)
      } catch {
        setIds((prev) => {
          const next = new Set(prev)
          if (was) next.add(restaurantId)
          else next.delete(restaurantId)
          return next
        })
      }
    },
    [ids, token],
  )

  return { ids, loading, isFavorite, toggle, isLoggedIn: Boolean(token) }
}
