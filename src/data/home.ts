export type Category = {
  id: string
  name: string
  count: string
  image: string
}

export type Restaurant = {
  id: string
  name: string
  cuisine: string
  rating: number
  reviews: string
  eta: string
  distance: string
  delivery: string
  badge?: string
  badgeTone?: 'primary' | 'secondary' | 'neutral' | 'fixed'
  image: string
  verified?: boolean
}

export type Dish = {
  id: string
  restaurant: string
  name: string
  description: string
  price: string
  rating: number
  image: string
  tag?: string
}

export const categories: Category[] = [
  {
    id: 'milliy',
    name: 'Milliy taomlar',
    count: '62+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtYUiTbJldvspf5Fo0oGvmwcQfoLvflhWoKngeT0UZ5cbaCD7amHstfM9cNSqYE6c14MDYKVzqPJlyiQTtnxm_VkqSMeu33N59YOmhiwCWf2nyJUgEPPNVEDyQ2-OCzjHUVgl4S6INhBuNmbgXupkf-lBPB9zov7RzfKTTLWg-Okgw8SsQx5nFcaKkvsPRNjRiDNiqRdeA8xvGm70CuOK8-s7YW-976fSL6_7S9ZISLOWg7RhAN7EA',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    count: '34+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjEaxzqGBqyaRHUtgm6jF9tociSuZpYG0DLW7kMwonkFBu3HZAkhMmuXEB9S-6CdoWddhAI_uzl6lql-UsfH9BJiWMv3UKgQPZ1n90WFQuIIUAjXRNH20Zy1TFYRLsVwMTkTA6eDX_cL8H4uGpAAZbUTGsLTbyXrEYrowdTKGT5eBXMpavN40OH54YWb4dkGvF-yyAKonlrpNu_k2IiZlVX6ZTVFYufnsgXx_N8kk3kf8VdbzgAuMB',
  },
  {
    id: 'fastfood',
    name: 'Fast Food',
    count: '48+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVeqykVT_qV72hBq3osnjj4h8Sw4-Ncj-EDJ7geoOt6mN2vZ5OkkX1-gdP0AHkOJfo9PWNlPyCznl44GBaefz6bBslIPPeBMAgreYrc3y3vTZbpic1ti_UXWqM_rhWdDfUpL5TRpLSHQFXieHXOfJHcG4NcHDylJDhZ-cfckvDLIYqFEWH94rDoMN-hqz4zfWtPjkISIl3L2RdVFeezB6JIlMACLYiOKqyquTZouaBtdXXaNsgf7Cx',
  },
  {
    id: 'sushi',
    name: 'Sushi & Roll',
    count: '21+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9mcpOH_5ccjo1V765yNbQ3DdWeJ-z8mnx7O3TZcEqFH6avZP-p8ibfdQWnvn2DKAiGqSFdwdHliwYnjXWTfTKp2_8Wet80K7rdJFDvgj3Fbwlt84G2UrlYMFtbmMbKb68e15IquoNN6-Y9kQeKHlnU2Y5sOJpsMuW6rJaN1v_0LC-ZTta-JfToHx9ogIfxa7qO-VYTzfHdf8Kv8XbGFPB9o71bhbLBVKgHd7uYqPPO99zovGalTVz',
  },
  {
    id: 'dessert',
    name: 'Shirinliklar',
    count: '29+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPr73mkR2OkA9ARh2xwhw4oYt_w2409BCIuK9YfJSWS7Cu6uqGacpPvCECKSsUBYf7VQ3uGKE6AWSYC2lgUUY87Ro-3p5DpgfhDw4GNPsOfGCSqOH6kAyb4cvu29W09M0iDS1gNoj320AbQZXdKrBj6PtigWRqZ8WaU1YY7KgpHurYPq4Jbh_zvQeWU9JAUUE60rwzVCmYOwOqgLVmP7-_S99fWJHCVRvmU2G72iDKNkUmcAFsEjcN',
  },
  {
    id: 'drinks',
    name: 'Ichimliklar',
    count: '40+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMdsrGjjQPGApskErDYHGkim72-bH9BemMaoAbiRyZM10DyNKoWp2TtzqAxg4_OGI91A6eF-fqqiBenM732IV6AmXmho4rWBBedB-Jp5_Kd96ZSGHKjbkJD7vbeaLXksFdrzIbqUbBkAcbCQ0MmahU4QxSWr4UegwxL7GMw8sCdvy-xJ_nPkx1iUEOuuxCaJIiSm8WXUfQk71iarfggb5Ja7Ibr-XQoRiExIvEnmdCLE6zpYFFk4R',
  },
  {
    id: 'coffee',
    name: 'Qahvaxona',
    count: '18+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9u6CPzrvN3bBqzRdxaudfYcimUT3DPhTNF8MQD3Gy7QeEa62j6bzNhpgPnzSJvZvJdlw_jgZQFMzveqY3iW3wJ2a8Rj8La57Sw5n365lhwVbjtL_If78cTv5fG3rQMoZo4TWlSmz3UAnCZMU9r-m6vvBnqhAGtD-TFDtpmbNuyrtZwpS9lgqT6kQzOgEYsLQFlI2XDvhWs1nvYwR-8IZBlwE5PHva3zXwdlT0SwYkDIsbjV177sI',
  },
  {
    id: 'healthy',
    name: "Sog'lom ovqat",
    count: '15+ joy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD667i-LEtkMoWfrFLVVOyyaCuPVxZZXQ3FdJa6qok0lmx8jKYOTDujZgW_yV61QjkojDve2_lWJDS2aoWTY3AFoNZRZYf5LhXLx3fgLwvcQmJCOcDiqBAhm7yorcHgcGob2m_NVxsqA2M1qPoXiNYxwuqczBGnq-5zERw5v_K7gInbbW-HaPxr--3X-ci08OOVHQ1J5wv7NLN7AXikHTacMFCKUHwfYzW2j_-QpDSWDfrjEp8kjGx1',
  },
]

export const restaurants: Restaurant[] = [
  {
    id: 'samarqand-osh',
    name: 'Samarqand Osh Markazi',
    cuisine: "Milliy taomlar, Palov, Shashlik, Sho'rva",
    rating: 4.9,
    reviews: '1.2k+',
    eta: '25-35 daq',
    distance: '1.8 km',
    delivery: 'Bepul',
    badge: 'Tavsiya etiladi',
    badgeTone: 'primary',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
  },
  {
    id: 'bella-pizza',
    name: 'Bella Pizza Trattoria',
    cuisine: 'Italyan pitsasi, Pasta, Kalzone, Salatlar',
    rating: 4.8,
    reviews: '890+',
    eta: '30-40 daq',
    distance: '2.4 km',
    delivery: "8,000 so'm",
    badge: '-20% Chegirma',
    badgeTone: 'secondary',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
  },
  {
    id: 'burger-house',
    name: 'Burger House Artisan',
    cuisine: 'Gourmet burgerlar, Fri, Nuggets, Milkshake',
    rating: 4.7,
    reviews: '650+',
    eta: '20-30 daq',
    distance: '1.2 km',
    delivery: "5,000 so'm",
    badge: 'Tez yetkazish',
    badgeTone: 'neutral',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=500&fit=crop',
  },
  {
    id: 'sushi-time',
    name: 'Sushi Time Tashkent',
    cuisine: 'Yapon taomlari, Rollar, Setlar, Vok',
    rating: 4.9,
    reviews: '420+',
    eta: '35-45 daq',
    distance: '3.1 km',
    delivery: 'Bepul',
    badge: 'Yangi',
    badgeTone: 'fixed',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=500&fit=crop',
  },
]

export const popularDishes: Dish[] = [
  {
    id: 'toy-oshi',
    restaurant: 'Samarqand Osh Markazi',
    name: "To'y Oshi (Samarqandcha)",
    description:
      "Dumg'aza go'shti, sariq sabzi, bedana tuxumi, no'xat, mayiz va maxsus ziravorlar.",
    price: "48,000 so'm",
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=400&fit=crop',
  },
  {
    id: 'pepperoni',
    restaurant: 'Bella Pizza',
    name: 'Pepperoni Max Pizza (32 sm)',
    description:
      "Italiya pishlog'i Mozzarella, achchiq mol salyami, maxsus pomidor sousi va oregano.",
    price: "75,000 so'm",
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop',
  },
  {
    id: 'double-angus',
    restaurant: 'Burger House',
    name: 'Double Cheeseburger Angus',
    description:
      "2 qavat shirali Black Angus mol go'shti kotleti, ikki karra cheddir pishlog'i va xushbo'y sous.",
    price: "52,000 so'm",
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
  },
  {
    id: 'philadelphia',
    restaurant: 'Sushi Time',
    name: 'Filadelfiya Classic (8 dona)',
    description:
      "Norvegiya yangi losos balig'i, yumshoq Philadelphia krem-pishlog'i, bodring va yapon guruchi.",
    price: "68,000 so'm",
    rating: 4.9,
    tag: 'Takliflar',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
  },
]

export const restaurantFilters = [
  'Barchasi',
  'Yaqinida',
  'Reyting 4.5+',
  'Bepul yetkazish',
  'Chegirmalar',
] as const

export type CatalogBadge = {
  label: string
  tone: 'orange' | 'red' | 'peach' | 'green'
}

export type CatalogRestaurant = {
  id: string
  name: string
  rating: number
  reviews: string
  eta: string
  distance: string
  delivery: string
  minOrder: string
  tags: string[]
  badges: CatalogBadge[]
  image: string
  freeDelivery: boolean
  open: boolean
  priceTier: 1 | 2 | 3
  category: string
  deliveryMinutes: number
}

export const catalogCategories = [
  { id: 'milliy', label: 'Milliy taomlar', count: 42 },
  { id: 'pizza', label: 'Pitsa', count: 28 },
  { id: 'burger', label: 'Burger & Fast Food', count: 35 },
  { id: 'sushi', label: 'Sushi & Osiyo', count: 18 },
  { id: 'dessert', label: 'Shirinliklar', count: 22 },
  { id: 'europe', label: 'Yevropa taomlari', count: 16 },
] as const

export const catalogRestaurants: CatalogRestaurant[] = [
  {
    id: 'samarqand-osh',
    name: 'Samarqand Osh Markazi',
    rating: 4.9,
    reviews: '1,240',
    eta: '25–35 daq',
    distance: '1.8 km',
    delivery: 'Bepul',
    minOrder: "30,000 so'm",
    tags: ['Milliy taomlar', 'Osh, Manti'],
    badges: [
      { label: 'Top tanlov', tone: 'orange' },
      { label: '-15% Aksiya', tone: 'peach' },
    ],
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=500&fit=crop',
    freeDelivery: true,
    open: true,
    priceTier: 1,
    category: 'milliy',
    deliveryMinutes: 35,
  },
  {
    id: 'bella-pizza',
    name: 'Bella Pizza Trattoria',
    rating: 4.8,
    reviews: '890',
    eta: '30–40 daq',
    distance: '3.2 km',
    delivery: "8,000 so'm",
    minOrder: "50,000 so'm",
    tags: ['Pitsa', 'Italiya taomlari'],
    badges: [{ label: 'Top tanlov', tone: 'orange' }],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop',
    freeDelivery: false,
    open: true,
    priceTier: 2,
    category: 'pizza',
    deliveryMinutes: 40,
  },
  {
    id: 'burger-house',
    name: 'Burger House Artisan',
    rating: 4.7,
    reviews: '650',
    eta: '20–30 daq',
    distance: '2.1 km',
    delivery: "5,000 so'm",
    minOrder: "40,000 so'm",
    tags: ['Burger', 'Fast Food'],
    badges: [{ label: 'Katta kombo', tone: 'peach' }],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop',
    freeDelivery: false,
    open: true,
    priceTier: 2,
    category: 'burger',
    deliveryMinutes: 30,
  },
  {
    id: 'sushi-time',
    name: 'Sushi Time Tashkent',
    rating: 4.9,
    reviews: '420',
    eta: '35–45 daq',
    distance: '3.7 km',
    delivery: 'Bepul',
    minOrder: "60,000 so'm",
    tags: ['Sushi', 'Rollar, Osiyo'],
    badges: [{ label: 'Top tanlov', tone: 'orange' }],
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=500&fit=crop',
    freeDelivery: true,
    open: true,
    priceTier: 3,
    category: 'sushi',
    deliveryMinutes: 45,
  },
  {
    id: 'rayhon-milliy',
    name: 'Rayhon Milliy Taomlari',
    rating: 4.6,
    reviews: '980',
    eta: '25–35 daq',
    distance: '2.4 km',
    delivery: "7,000 so'm",
    minOrder: "35,000 so'm",
    tags: ["Lag'mon, Manti", 'Shashlik'],
    badges: [{ label: 'Issiq tandir', tone: 'orange' }],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=500&fit=crop',
    freeDelivery: false,
    open: true,
    priceTier: 1,
    category: 'milliy',
    deliveryMinutes: 35,
  },
  {
    id: 'coffee-sweet',
    name: 'Coffee & Sweet Corner',
    rating: 4.8,
    reviews: '310',
    eta: '15–25 daq',
    distance: '1.2 km',
    delivery: 'Bepul',
    minOrder: "25,000 so'm",
    tags: ['Desertlar', 'Qahva, Nonushta'],
    badges: [{ label: 'Tez yetkazish', tone: 'green' }],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop',
    freeDelivery: true,
    open: true,
    priceTier: 2,
    category: 'dessert',
    deliveryMinutes: 25,
  },
]

