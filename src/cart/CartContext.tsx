import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const CART_KEY = 'fooduz_cart'

export type CartItem = {
  dishId: string
  restaurantId: string
  restaurantName: string
  name: string
  description?: string
  price: number
  qty: number
  image: string
}

type CartState = {
  restaurantId: string | null
  restaurantName: string
  items: CartItem[]
}

type CartContextValue = {
  restaurantId: string | null
  restaurantName: string
  items: CartItem[]
  count: number
  foodTotal: number
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (dishId: string, qty: number) => void
  removeItem: (dishId: string) => void
  clear: () => void
  linesForRestaurant: (restaurantId: string) => { dishId: string; qty: number; price: number; name: string; image: string }[]
  syncRestaurantCart: (
    restaurantId: string,
    restaurantName: string,
    lines: { dishId: string; name: string; price: number; qty: number; image: string; description?: string }[],
  ) => void
}

const emptyCart: CartState = { restaurantId: null, restaurantName: '', items: [] }

function readCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return emptyCart
    return JSON.parse(raw) as CartState
  } catch {
    return emptyCart
  }
}

function persist(state: CartState) {
  localStorage.setItem(CART_KEY, JSON.stringify(state))
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => readCart())

  const commit = useCallback((next: CartState) => {
    persist(next)
    setState(next)
  }, [])

  const addItem = useCallback(
    (item: Omit<CartItem, 'qty'>, qty = 1) => {
      setState((prev) => {
        let base = prev
        if (prev.restaurantId && prev.restaurantId !== item.restaurantId) {
          base = emptyCart
        }
        const found = base.items.find((i) => i.dishId === item.dishId)
        let items: CartItem[]
        if (found) {
          items = base.items.map((i) =>
            i.dishId === item.dishId ? { ...i, qty: i.qty + qty } : i,
          )
        } else {
          items = [...base.items, { ...item, qty }]
        }
        const next: CartState = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          items,
        }
        persist(next)
        return next
      })
    },
    [],
  )

  const setQty = useCallback(
    (dishId: string, qty: number) => {
      setState((prev) => {
        const items =
          qty <= 0
            ? prev.items.filter((i) => i.dishId !== dishId)
            : prev.items.map((i) => (i.dishId === dishId ? { ...i, qty } : i))
        const next: CartState = {
          ...prev,
          items,
          restaurantId: items.length ? prev.restaurantId : null,
          restaurantName: items.length ? prev.restaurantName : '',
        }
        persist(next)
        return next
      })
    },
    [],
  )

  const removeItem = useCallback((dishId: string) => {
    setQty(dishId, 0)
  }, [setQty])

  const clear = useCallback(() => {
    commit(emptyCart)
  }, [commit])

  const syncRestaurantCart = useCallback(
    (
      restaurantId: string,
      restaurantName: string,
      lines: {
        dishId: string
        name: string
        price: number
        qty: number
        image: string
        description?: string
      }[],
    ) => {
      setState((prev) => {
        if (prev.restaurantId && prev.restaurantId !== restaurantId) {
          const next: CartState = {
            restaurantId,
            restaurantName,
            items: lines.map((l) => ({
              dishId: l.dishId,
              restaurantId,
              restaurantName,
              name: l.name,
              description: l.description,
              price: l.price,
              qty: l.qty,
              image: l.image,
            })),
          }
          persist(next)
          return next
        }
        const next: CartState = {
          restaurantId,
          restaurantName,
          items: lines.map((l) => ({
            dishId: l.dishId,
            restaurantId,
            restaurantName,
            name: l.name,
            description: l.description,
            price: l.price,
            qty: l.qty,
            image: l.image,
          })),
        }
        persist(next)
        return next
      })
    },
    [],
  )

  const linesForRestaurant = useCallback(
    (restaurantId: string) =>
      state.restaurantId === restaurantId
        ? state.items.map((i) => ({
            dishId: i.dishId,
            qty: i.qty,
            price: i.price,
            name: i.name,
            image: i.image,
          }))
        : [],
    [state],
  )

  const count = useMemo(() => state.items.reduce((n, i) => n + i.qty, 0), [state.items])
  const foodTotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items],
  )

  const value = useMemo(
    () => ({
      restaurantId: state.restaurantId,
      restaurantName: state.restaurantName,
      items: state.items,
      count,
      foodTotal,
      addItem,
      setQty,
      removeItem,
      clear,
      linesForRestaurant,
      syncRestaurantCart,
    }),
    [
      state,
      count,
      foodTotal,
      addItem,
      setQty,
      removeItem,
      clear,
      linesForRestaurant,
      syncRestaurantCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function formatCartSum(n: number) {
  return `${n.toLocaleString('uz-UZ')} so'm`
}
