export type CheckoutItem = {
  id: string
  name: string
  detail: string
  price: string
  qty: string
  image: string
}

export const checkoutItems: CheckoutItem[] = [
  {
    id: 'osh',
    name: 'Samarqandcha To‘y Oshi',
    detail: '1 porsiya · Maxsus bezak',
    price: '48,000',
    qty: '1x dona',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
  },
  {
    id: 'salat',
    name: 'Achichuk Salati',
    detail: '2 porsiya · Yangi pomidor',
    price: '30,000',
    qty: '2x dona',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  },
  {
    id: 'non',
    name: 'Samarqand Non',
    detail: 'Issiq tandir noni',
    price: '8,000',
    qty: '1x dona',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
  },
  {
    id: 'choy',
    name: 'Ko‘k choy limon bilan',
    detail: 'Choynakda · yangi yalpiz',
    price: '12,000',
    qty: '1x choynak',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop',
  },
]

export const checkoutRestaurant = {
  name: 'Samarqand Osh Markazi',
  rating: 4.9,
  dishes: '4 ta taom',
  prep: 'Tayyorlash 20 daqiqa',
}
