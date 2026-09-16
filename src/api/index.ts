import { apiFetch } from './client'
import type {
  CategoryDto,
  FeaturedPromoDto,
  MenuDishDto,
  OrderDto,
  PopularDishDto,
  PromotionDto,
  RestaurantDetailDto,
  RestaurantListItemDto,
  TokenDto,
  UserDto,
} from './types'

export const api = {
  health: () => apiFetch<{ status: string; app: string }>('/health'),

  categories: (params?: { group?: string; popular?: boolean }) => {
    const q = new URLSearchParams()
    if (params?.group) q.set('group', params.group)
    if (params?.popular != null) q.set('popular', String(params.popular))
    const qs = q.toString()
    return apiFetch<CategoryDto[]>(`/categories${qs ? `?${qs}` : ''}`)
  },

  restaurants: (params?: {
    q?: string
    category?: string
    freeDelivery?: boolean
    openNow?: boolean
    priceTier?: number
    minRating?: number
    maxEta?: number
    sort?: string
  }) => {
    const q = new URLSearchParams()
    if (params?.q) q.set('q', params.q)
    if (params?.category) q.set('category', params.category)
    if (params?.freeDelivery != null) q.set('free_delivery', String(params.freeDelivery))
    if (params?.openNow != null) q.set('open_now', String(params.openNow))
    if (params?.priceTier != null) q.set('price_tier', String(params.priceTier))
    if (params?.minRating != null) q.set('min_rating', String(params.minRating))
    if (params?.maxEta != null) q.set('max_eta', String(params.maxEta))
    if (params?.sort) q.set('sort', params.sort)
    const qs = q.toString()
    return apiFetch<RestaurantListItemDto[]>(`/restaurants${qs ? `?${qs}` : ''}`)
  },

  restaurant: (id: string) => apiFetch<RestaurantDetailDto>(`/restaurants/${id}`),

  menu: (id: string, params?: { category?: string; q?: string }) => {
    const q = new URLSearchParams()
    if (params?.category) q.set('category', params.category)
    if (params?.q) q.set('q', params.q)
    const qs = q.toString()
    return apiFetch<MenuDishDto[]>(`/restaurants/${id}/menu${qs ? `?${qs}` : ''}`)
  },

  menuCategories: (id: string) =>
    apiFetch<{ id: string; label: string }[]>(`/restaurants/${id}/menu-categories`),

  promotions: (params?: { filter?: string; sort?: string }) => {
    const q = new URLSearchParams()
    if (params?.filter) q.set('filter', params.filter)
    if (params?.sort) q.set('sort', params.sort)
    const qs = q.toString()
    return apiFetch<PromotionDto[]>(`/promotions${qs ? `?${qs}` : ''}`)
  },

  promotionsFeatured: () => apiFetch<FeaturedPromoDto>('/promotions/featured'),

  popularDishes: (limit = 8) =>
    apiFetch<PopularDishDto[]>(`/dishes/popular?limit=${limit}`),

  searchDishes: (q: string, limit = 24) =>
    apiFetch<PopularDishDto[]>(`/dishes/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  favorites: (token: string) =>
    apiFetch<RestaurantListItemDto[]>('/favorites', { token }),

  addFavorite: (restaurantId: string, token: string) =>
    apiFetch<{ ok: boolean }>('/favorites', {
      method: 'POST',
      body: { restaurantId },
      token,
    }),

  removeFavorite: (restaurantId: string, token: string) =>
    apiFetch<{ ok: boolean }>(`/favorites/${restaurantId}`, {
      method: 'DELETE',
      token,
    }),

  login: (payload: { phone?: string; email?: string; password: string }) =>
    apiFetch<TokenDto>('/auth/login', {
      method: 'POST',
      body: payload,
    }),

  register: (payload: {
    fullName: string
    phone: string
    email?: string
    password: string
  }) =>
    apiFetch<TokenDto>('/auth/register', {
      method: 'POST',
      body: payload,
    }),

  googleAuth: (accessToken: string) =>
    apiFetch<TokenDto>('/auth/google', {
      method: 'POST',
      body: { accessToken },
    }),

  me: (token: string) => apiFetch<UserDto>('/auth/me', { token }),

  updateProfile: (
    payload: { fullName?: string; phone?: string; email?: string; avatar?: string },
    token: string,
  ) =>
    apiFetch<UserDto>('/auth/me', {
      method: 'PATCH',
      body: payload,
      token,
    }),

  changePassword: (
    payload: { currentPassword: string; newPassword: string },
    token: string,
  ) =>
    apiFetch<{ ok: boolean }>('/auth/change-password', {
      method: 'POST',
      body: payload,
      token,
    }),

  createOrder: (
    payload: {
      restaurantId: string
      items: { dishId: string; name: string; qty: number; price: number; image?: string }[]
      recipientName: string
      recipientPhone: string
      address: string
      paymentMethod?: string
      comment?: string
    },
    token?: string | null,
  ) =>
    apiFetch<{ id: number; total: number; status: string }>('/orders', {
      method: 'POST',
      body: payload,
      token,
    }),

  orders: (token: string) => apiFetch<OrderDto[]>('/orders', { token }),
}
