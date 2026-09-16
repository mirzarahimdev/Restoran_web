export type CategoryDto = {
  id: string
  name: string
  count: string
  image: string
  thumb: string
  description: string
  group: string
  queryParam: string
  badge: string | null
  badgeTone: string | null
  restaurantCount: number
  popularity: number
  popular: boolean
}

export type BadgeDto = {
  label: string
  tone: string
}

export type RestaurantListItemDto = {
  id: string
  name: string
  rating: number
  reviews: string
  eta: string
  distance: string
  delivery: string
  minOrder: string
  tags: string[]
  badges: BadgeDto[]
  image: string
  freeDelivery: boolean
  open: boolean
  priceTier: number
  category: string
  deliveryMinutes: number
}

export type RestaurantDetailDto = {
  id: string
  name: string
  logo: string
  cover: string
  verified: boolean
  cuisine: string
  description: string
  rating: number
  reviews: string
  hours: string
  address: string
  deliveryTime: string
  deliveryFee: string
  freeDelivery: boolean
  minOrder: string
  accepting: boolean
  category: string
  tags: string[]
}

export type MenuDishDto = {
  id: string
  name: string
  description: string
  price: number
  priceLabel: string
  image: string
  badge?: string | null
  weight?: string | null
  category: string
  popular?: boolean
  ingredients?: string[]
}

export type PromotionDto = {
  id: string
  restaurantId: string
  name: string
  cuisine: string
  rating: number
  reviews: string
  eta: string
  price: string
  oldPrice: string
  delivery: string
  freeDelivery: boolean
  badge: string
  badgeTone: string
  filterTags: string[]
  image: string
  isNew?: boolean
  discountPercent?: number | null
  popularity: number
}

export type UserDto = {
  id: number
  fullName: string
  phone: string
  email: string | null
  avatar: string | null
}

export type TokenDto = {
  accessToken: string
  tokenType: string
  user: UserDto
}

export type PopularDishDto = {
  id: string
  restaurantId: string
  restaurant: string
  name: string
  description: string
  price: string
  priceAmount: number
  rating: number
  image: string
  tag?: string | null
}

export type FeaturedPromoDto = {
  promotionId: string
  restaurantId: string
  tag: string
  title: string
  description: string
  cta: string
  image: string
  imageBadge: string
  secondsRemaining: number
  activePromoCount: number
}

export type OrderItemDto = {
  dishId: string
  name: string
  qty: number
  price: number
  image?: string
}

export type OrderDto = {
  id: number
  restaurantId: string
  status: string
  foodTotal: number
  deliveryFee: number
  serviceFee: number
  total: number
  items: OrderItemDto[]
  recipientName: string
  recipientPhone: string
  address: string
  paymentMethod: string
}
