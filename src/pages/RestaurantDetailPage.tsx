import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import type { MenuDishDto, RestaurantDetailDto } from '../api/types'
import { useCart } from '../cart/CartContext'
import { Icon } from '../components/ui/Icon'
import { useRestaurantFavorites } from '../hooks/useRestaurantFavorites'

function formatSum(n: number) {
  return `${n.toLocaleString('uz-UZ')} so'm`
}

export function RestaurantDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState<RestaurantDetailDto | null>(null)
  const [menu, setMenu] = useState<MenuDishDto[]>([])
  const [menuCategories, setMenuCategories] = useState<{ id: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [tab, setTab] = useState<'menu' | 'reviews' | 'info'>('menu')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const { isFavorite, toggle } = useRestaurantFavorites()
  const { items: cartItems, addItem, setQty: setCartQty, restaurantId: cartRestaurantId } =
    useCart()
  const cart = cartRestaurantId === id ? cartItems : []

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([api.restaurant(id), api.menu(id), api.menuCategories(id)])
      .then(([detail, dishes, cats]) => {
        if (cancelled) return
        setRestaurant(detail)
        setMenu(dishes)
        setMenuCategories(cats)
      })
      .catch((err) => {
        if (cancelled) return
        setRestaurant(null)
        setMenu([])
        setError(err instanceof Error ? err.message : 'Yuklanmadi')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const filtered = useMemo(() => {
    let list = [...menu]
    if (category === 'popular') list = list.filter((d) => d.popular)
    else if (category !== 'all') list = list.filter((d) => d.category === category)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
      )
    }
    return list
  }, [menu, category, query])

  const mainList = useMemo(() => {
    if (category === 'all') return filtered.filter((d) => d.popular)
    return filtered
  }, [filtered, category])

  const otherList = useMemo(() => {
    if (category !== 'all') return []
    return filtered.filter((d) => !d.popular)
  }, [filtered, category])

  const foodTotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0)
  const hasItems = cart.length > 0
  const serviceFee = hasItems ? 4000 : 0
  const deliveryFeeAmount =
    hasItems && restaurant && !restaurant.freeDelivery
      ? Number(String(restaurant.deliveryFee).replace(/[^\d]/g, '')) || 8000
      : 0
  const giftThreshold = 100000
  const giftProgress = Math.min(1, foodTotal / giftThreshold)
  const giftLeft = Math.max(0, giftThreshold - foodTotal)
  const total = foodTotal + serviceFee + deliveryFeeAmount
  const cartCount = cart.reduce((n, l) => n + l.qty, 0)

  const addToCart = (dish: MenuDishDto) => {
    if (!restaurant) return
    addItem({
      dishId: dish.id,
      restaurantId: id,
      restaurantName: restaurant.name,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
    })
  }

  const changeQty = (dishId: string, delta: number) => {
    const line = cart.find((l) => l.dishId === dishId)
    setCartQty(dishId, (line?.qty ?? 0) + delta)
  }

  const DishCard = ({ dish }: { dish: MenuDishDto }) => (
    <article className="group overflow-hidden rounded-[18px] bg-white shadow-[0_6px_20px_rgba(20,27,43,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(20,27,43,0.1)]">
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/10] w-full">
          <img
            src={dish.image}
            alt={dish.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {dish.badge && (
            <span className="absolute top-[10px] left-[10px] z-[1] rounded-full bg-[#141b2b]/80 px-[10px] py-[4px] text-[11px] font-bold text-white">
              {dish.badge}
            </span>
          )}
          {dish.weight && (
            <span className="absolute right-[10px] bottom-[10px] z-[1] rounded-full bg-[#141b2b]/75 px-[8px] py-[3px] text-[11px] font-semibold text-white">
              {dish.weight}
            </span>
          )}
        </div>
      </div>
      <div className="p-[14px]">
        <h3 className="text-[15px] font-bold text-[#141b2b]">{dish.name}</h3>
        <p className="mt-[4px] line-clamp-2 text-[12px] leading-[16px] text-[#8A7B74]">
          {dish.description}
        </p>
        {(dish.ingredients?.length ?? 0) > 0 && (
          <div className="mt-[10px] border-t border-[#F0F1F6] pt-[10px]">
            <p className="font-sans text-[10px] font-extrabold tracking-[0.14em] text-[#F97316] uppercase">
              Taom tarkibi
            </p>
            <p className="mt-[5px] line-clamp-2 font-sans text-[12.5px] leading-[18px] font-medium tracking-[-0.01em] text-[#584237]">
              {dish.ingredients!.join(' · ')}
            </p>
          </div>
        )}
        <div className="mt-[12px] flex items-center justify-between">
          <p className="text-[15px] font-extrabold text-[#141b2b]">{dish.priceLabel}</p>
          <button
            type="button"
            onClick={() => addToCart(dish)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.35)] hover:bg-[#ea6a0c]"
            aria-label="Savatga qo‘shish"
          >
            <Icon name="add" className="text-[22px]" />
          </button>
        </div>
      </div>
    </article>
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-[55px] text-[14px] text-[#6B7280]">
        Yuklanmoqda…
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-[12px] px-[55px]">
        <p className="text-[16px] font-bold text-[#141b2b]">{error || 'Restoran topilmadi'}</p>
        <button
          type="button"
          onClick={() => navigate('/restoranlar')}
          className="rounded-full bg-[#F97316] px-[18px] py-[10px] text-[13px] font-bold text-white"
        >
          Restoranlarga qaytish
        </button>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#F7F8FC] pb-[100px]">
      {/* Hero */}
      <div className="relative h-[240px] w-full overflow-hidden sm:h-[280px] lg:h-[320px]">
        <img
          src={restaurant.cover}
          alt={restaurant.name}
          className="h-full w-full scale-110 object-cover blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b]/55 via-[#141b2b]/25 to-[#141b2b]/15" />

        <div className="absolute inset-x-0 bottom-0 translate-y-[42%] px-[55px]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-[16px] rounded-[24px] bg-white p-[18px] shadow-[0_16px_48px_rgba(20,27,43,0.14)] sm:flex-row sm:items-start sm:p-[20px]">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-[84px] w-[84px] shrink-0 rounded-[18px] bg-[#FBF7F0] object-contain p-[4px] ring-1 ring-[#E9EDFF] sm:h-[96px] sm:w-[96px]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-[12px]">
                <div className="min-w-0">
                  <h1 className="text-[24px] leading-[30px] font-extrabold tracking-[-0.02em] text-[#141b2b] sm:text-[28px] sm:leading-[34px]">
                    {restaurant.name}
                  </h1>
                  <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
                    {restaurant.verified && (
                      <span className="inline-flex items-center gap-[4px] rounded-full bg-[#F97316] px-[10px] py-[4px] text-[11px] font-bold text-white">
                        <Icon name="verified" className="text-[14px]" filled />
                        Tasdiqlangan
                      </span>
                    )}
                    <span className="rounded-full bg-[#F6E8D8] px-[10px] py-[4px] text-[11px] font-bold text-[#9d4300]">
                      {restaurant.cuisine}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  <button
                    type="button"
                    onClick={() => void toggle(id)}
                    className={`flex h-[42px] w-[42px] items-center justify-center rounded-full ${
                      isFavorite(id)
                        ? 'bg-[#FFF1F0] text-[#EF4444]'
                        : 'bg-[#F1F3FF] text-[#584237]'
                    }`}
                    aria-label="Sevimli"
                  >
                    <Icon name="favorite" className="text-[20px]" filled={isFavorite(id)} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const url = window.location.href
                      const title = restaurant?.name ?? 'FoodUZ'
                      try {
                        if (navigator.share) {
                          await navigator.share({ title, url })
                          return
                        }
                      } catch {
                        /* fall through to clipboard */
                      }
                      try {
                        await navigator.clipboard.writeText(url)
                        window.alert('Havola nusxalandi')
                      } catch {
                        window.prompt('Havolani nusxalang:', url)
                      }
                    }}
                    className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#141b2b]"
                    aria-label="Ulashish"
                  >
                    <Icon name="share" className="text-[20px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('info')}
                    className="inline-flex h-[42px] items-center gap-[6px] rounded-full bg-[#F1F3FF] px-[14px] text-[12px] font-bold text-[#141b2b]"
                  >
                    <Icon name="info" className="text-[16px]" />
                    Restoran haqida
                  </button>
                </div>
              </div>

              <p className="mt-[10px] max-w-[640px] text-[14px] leading-[20px] text-[#6B7280]">
                {restaurant.description}
              </p>
              <div className="mt-[12px] flex flex-col gap-[6px] text-[13px] text-[#584237]">
                <span className="inline-flex items-center gap-[6px] font-semibold">
                  <Icon name="star" className="text-[16px] text-[#FEA619]" filled />
                  {restaurant.rating} ({restaurant.reviews} sharhlar)
                </span>
                <span className="inline-flex items-center gap-[6px]">
                  <Icon name="schedule" className="text-[16px] text-[#F97316]" />
                  {restaurant.hours}
                </span>
                <span className="inline-flex items-center gap-[6px]">
                  <Icon name="location_on" className="text-[16px] text-[#F97316]" />
                  {restaurant.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for overlapping card */}
      <div className="h-[148px] sm:h-[120px]" />

      <div className="px-[55px]">
        {/* Delivery info */}
        <div className="mx-auto flex max-w-[1280px] flex-col gap-[14px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-[10px]">
            <div className="flex min-w-[180px] flex-1 items-center gap-[10px] rounded-[16px] bg-white px-[14px] py-[12px] shadow-[0_2px_10px_rgba(20,27,43,0.03)] sm:flex-none">
              <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                <Icon name="pedal_bike" className="text-[20px]" />
              </span>
              <div>
                <p className="text-[11px] text-[#8A7B74]">Yetkazish vaqti</p>
                <p className="text-[13px] font-bold text-[#141b2b]">{restaurant.deliveryTime}</p>
              </div>
            </div>
            <div className="flex min-w-[180px] flex-1 items-center gap-[10px] rounded-[16px] bg-white px-[14px] py-[12px] shadow-[0_2px_10px_rgba(20,27,43,0.03)] sm:flex-none">
              <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                <Icon name="local_shipping" className="text-[20px]" />
              </span>
              <div>
                <p className="text-[11px] text-[#8A7B74]">Yetkazib berish narxi</p>
                <p
                  className={`text-[13px] font-bold ${
                    restaurant.freeDelivery ? 'text-[#F97316]' : 'text-[#141b2b]'
                  }`}
                >
                  {restaurant.deliveryFee}
                </p>
              </div>
            </div>
            <div className="flex min-w-[180px] flex-1 items-center gap-[10px] rounded-[16px] bg-white px-[14px] py-[12px] shadow-[0_2px_10px_rgba(20,27,43,0.03)] sm:flex-none">
              <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                <Icon name="shopping_bag" className="text-[20px]" />
              </span>
              <div>
                <p className="text-[11px] text-[#8A7B74]">Minimal buyurtma</p>
                <p className="text-[13px] font-bold text-[#141b2b]">{restaurant.minOrder}</p>
              </div>
            </div>
          </div>
          {restaurant.accepting && (
            <p className="inline-flex items-center gap-[8px] text-[13px] font-semibold text-[#2D6A4F]">
              <span className="relative flex h-[10px] w-[10px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-60" />
                <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-[#22C55E]" />
              </span>
              Hozir buyurtmalar qabul qilinmoqda
            </p>
          )}
        </div>

        {/* Tabs + search */}
        <div className="mx-auto mt-[18px] flex max-w-[1280px] flex-col gap-[12px] min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between">
          <div className="flex flex-wrap gap-[8px]">
            {(
              [
                { id: 'menu' as const, label: 'Menyu' },
                { id: 'reviews' as const, label: `Sharhlar ${restaurant.reviews.replace('+', '')}` },
                { id: 'info' as const, label: "Restoran ma'lumotlari & Galereya" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-[16px] py-[10px] text-[13px] font-semibold transition-colors ${
                  tab === item.id
                    ? 'bg-[#293040] text-white'
                    : 'bg-white text-[#584237] hover:bg-[#F1F3FF]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="relative w-full min-[960px]:max-w-[280px]">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[18px] text-[#8A7B74]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Menyudan qidirish..."
              className="h-[42px] w-full rounded-full border border-[#E9EDFF] bg-white pr-[14px] pl-[40px] text-[13px] outline-none focus:ring-2 focus:ring-[#F97316]/30"
            />
          </label>
        </div>

        {/* Category chips */}
        <div className="mx-auto mt-[12px] flex max-w-[1280px] gap-[8px] overflow-x-auto pb-[4px]">
          {menuCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategory(c.id)
                setTab('menu')
              }}
              className={`shrink-0 rounded-full px-[14px] py-[8px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
                category === c.id
                  ? 'bg-[#F97316] text-white'
                  : 'bg-white text-[#584237] hover:bg-[#FFF4ED]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-[16px] grid max-w-[1280px] grid-cols-1 items-start gap-[20px] min-[1100px]:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {tab === 'menu' && (
              <>
                <div className="relative flex items-center overflow-hidden rounded-[20px] bg-[#F97316] px-[20px] py-[20px] text-white sm:px-[28px] sm:py-[22px]">
                  <div className="relative z-10 min-w-0 max-w-[640px] flex-1 pr-[16px]">
                    <span className="inline-flex rounded-full bg-[#141b2b]/25 px-[12px] py-[5px] text-[10px] font-bold tracking-[0.1em] text-white uppercase">
                      Aksiya va sovg‘alar
                    </span>
                    <p className="mt-[12px] text-[20px] leading-[26px] font-extrabold sm:text-[22px] sm:leading-[28px]">
                      Katta buyurtmaga bepul rayhonli sharbat!
                    </p>
                    <p className="mt-[8px] text-[13px] leading-[19px] text-white/95 sm:text-[14px] sm:leading-[20px]">
                      100,000 so‘mdan ortiq har bir buyurtmaga Samarkand uslubidagi uy
                      sharoitida tayyorlangan 1 litr sharbat qo‘shib beriladi.
                    </p>
                  </div>
                  <div className="relative z-10 ml-auto hidden h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex sm:h-[100px] sm:w-[100px]">
                    <Icon name="local_cafe" className="text-[42px] text-white sm:text-[48px]" />
                  </div>
                  <div className="pointer-events-none absolute -right-[20px] -bottom-[30px] h-[140px] w-[140px] rounded-full bg-white/10 sm:hidden" />
                </div>

                <div className="mt-[20px] flex items-center justify-between gap-[12px]">
                  <h2 className="text-[20px] font-extrabold text-[#141b2b]">
                    {category === 'all' || category === 'popular'
                      ? 'Mashhur taomlar'
                      : (menuCategories.find((c) => c.id === category)?.label ?? 'Menyu')}
                  </h2>
                  <p className="text-[13px] font-semibold text-[#8A7B74]">
                    {mainList.length} ta taom
                  </p>
                </div>

                <div className="mt-[12px] grid grid-cols-1 gap-[14px] min-[700px]:grid-cols-2">
                  {mainList.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>

                {otherList.length > 0 && (
                  <>
                    <div className="mt-[24px] flex items-center justify-between gap-[12px]">
                      <h2 className="text-[20px] font-extrabold text-[#141b2b]">Boshqa taomlar</h2>
                      <p className="text-[13px] font-semibold text-[#8A7B74]">
                        {otherList.length} ta taom
                      </p>
                    </div>
                    <div className="mt-[12px] grid grid-cols-1 gap-[14px] min-[700px]:grid-cols-2">
                      {otherList.map((dish) => (
                        <DishCard key={dish.id} dish={dish} />
                      ))}
                    </div>
                  </>
                )}

                {mainList.length === 0 && otherList.length === 0 && (
                  <div className="mt-[20px] rounded-[16px] bg-white px-[20px] py-[40px] text-center">
                    <p className="font-bold text-[#141b2b]">Taom topilmadi</p>
                    <p className="mt-[4px] text-[13px] text-[#8A7B74]">
                      Boshqa kategoriya yoki qidiruvni sinab ko‘ring.
                    </p>
                  </div>
                )}

                <div className="mt-[24px] flex items-start gap-[14px] rounded-[18px] bg-[#EEF0FF] px-[18px] py-[16px]">
                  <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)]">
                    <Icon name="restaurant" className="text-[22px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-[#141b2b]">
                      Halol va tabiiy mahsulotlar kafolati
                    </p>
                    <p className="mt-[4px] text-[13px] leading-[18px] text-[#584237]">
                      Barcha go‘sht mahsulotlari halol sertifikatlangan, tabiiy tarzda
                      tayyorlanadi va termal idishlarda yetkazib beriladi.
                    </p>
                  </div>
                </div>
              </>
            )}

            {tab === 'reviews' && (
              <div className="rounded-[18px] bg-white px-[20px] py-[32px] text-center">
                <p className="text-[16px] font-bold text-[#141b2b]">
                  {restaurant.reviews} ta sharh
                </p>
                <p className="mt-[6px] text-[13px] text-[#8A7B74]">
                  Mijozlar sharhlari tez orada qo‘shiladi.
                </p>
              </div>
            )}

            {tab === 'info' && (
              <div className="rounded-[18px] bg-white px-[20px] py-[24px]">
                <h2 className="text-[18px] font-bold text-[#141b2b]">Restoran haqida</h2>
                <p className="mt-[8px] text-[14px] leading-[20px] text-[#584237]">
                  {restaurant.description}. Manzil: {restaurant.address}. Ish vaqti:{' '}
                  {restaurant.hours}.
                </p>
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          <aside className="hidden min-w-0 min-[1100px]:sticky min-[1100px]:top-[86px] min-[1100px]:block">
            <div className="overflow-hidden rounded-[20px] bg-white p-[18px] shadow-[0_10px_32px_rgba(20,27,43,0.08)]">
              <div className="flex items-center justify-between gap-[10px]">
                <div className="flex min-w-0 items-center gap-[8px]">
                  <Icon name="shopping_bag" className="text-[22px] text-[#F97316]" filled />
                  <h3 className="truncate text-[17px] font-extrabold text-[#141b2b]">
                    Sizning savatingiz
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-[#EEF0FF] px-[10px] py-[4px] text-[12px] font-bold text-[#5B5FC7]">
                  {cartCount} ta taom
                </span>
              </div>

              <div className="mt-[14px] flex items-start gap-[10px] rounded-[14px] bg-[#F1F3FF] px-[12px] py-[12px]">
                <Icon name="storefront" className="mt-[1px] text-[20px] text-[#F97316]" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#141b2b]">{restaurant.name}</p>
                  <p className="mt-[2px] text-[12px] text-[#584237]">
                    Yetkazish: {restaurant.deliveryTime}
                  </p>
                </div>
              </div>

              <ul className="mt-[14px] flex flex-col gap-[14px]">
                {cart.map((line) => {
                  const menuDish = menu.find((d) => d.id === line.dishId)
                  const portionLabel =
                    line.dishId === 'achichuk'
                      ? `${line.qty} dona (${line.qty * 180} gr)`
                      : line.dishId === 'non'
                        ? `${line.qty} dona`
                        : menuDish?.weight?.includes('gr')
                          ? `${line.qty} porsiya (${menuDish.weight})`
                          : `${line.qty} porsiya`

                  return (
                    <li key={line.dishId} className="flex items-start justify-between gap-[10px]">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-[18px] font-bold text-[#141b2b]">
                          {line.name}
                        </p>
                        <p className="mt-[2px] text-[11px] text-[#8A7B74]">{portionLabel}</p>
                        <p className="mt-[4px] text-[13px] font-bold text-[#F97316]">
                          {formatSum(line.price * line.qty)}
                        </p>
                      </div>
                      <div className="flex h-[34px] shrink-0 items-center gap-[2px] rounded-full bg-[#F1F3FF] px-[4px]">
                        <button
                          type="button"
                          onClick={() => changeQty(line.dishId, -1)}
                          className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-[#141b2b] shadow-sm"
                          aria-label="Kamaytirish"
                        >
                          <Icon name="remove" className="text-[16px]" />
                        </button>
                        <span className="w-[20px] text-center text-[13px] font-bold">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(line.dishId, 1)}
                          className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-[#F97316] shadow-sm"
                          aria-label="Ko‘paytirish"
                        >
                          <Icon name="add" className="text-[16px]" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {cart.length === 0 && (
                <p className="mt-[16px] text-center text-[13px] text-[#8A7B74]">
                  Savat bo‘sh. Taom qo‘shing.
                </p>
              )}

              {hasItems &&
                (giftLeft > 0 ? (
                <div className="mt-[14px] rounded-[14px] bg-[#FFF4ED] px-[12px] py-[12px]">
                  <div className="flex items-start gap-[8px]">
                    <Icon name="redeem" className="mt-[1px] text-[18px] text-[#F97316]" />
                    <p className="text-[12px] leading-[16px] font-semibold text-[#9d4300]">
                      Yana {formatSum(giftLeft)}lik taom qo‘shing va bepul sharbat sovg‘a oling!
                    </p>
                  </div>
                  <div className="mt-[10px] h-[8px] overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#F97316] transition-all"
                      style={{ width: `${giftProgress * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-[14px] flex items-center gap-[8px] rounded-[14px] bg-[#E8F8EF] px-[12px] py-[12px] text-[12px] font-semibold text-[#2D6A4F]">
                  <Icon name="redeem" className="text-[18px]" />
                  Sovg‘a ochildi! Bepul sharbat qo‘shiladi.
                </div>
              ))}

              <div className="mt-[14px] rounded-[14px] bg-[#F1F3FF] px-[14px] py-[14px]">
                <div className="flex flex-col gap-[10px] text-[13px]">
                  <div className="flex justify-between text-[#584237]">
                    <span>Taomlar narxi</span>
                    <span className="font-semibold text-[#141b2b]">{formatSum(foodTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#584237]">
                    <span>Yetkazib berish</span>
                    {restaurant.freeDelivery || deliveryFeeAmount === 0 ? (
                      <span className="rounded-full bg-[#FFF4ED] px-[10px] py-[3px] text-[12px] font-bold text-[#F97316]">
                        Bepul aksiya!
                      </span>
                    ) : (
                      <span className="font-semibold text-[#141b2b]">
                        {formatSum(deliveryFeeAmount)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[#584237]">
                    <span>Xizmat haqi</span>
                    <span className="font-semibold text-[#141b2b]">{formatSum(serviceFee)}</span>
                  </div>
                  <div className="mt-[2px] flex items-end justify-between border-t border-white/80 pt-[12px]">
                    <p className="text-[14px] font-bold text-[#141b2b]">Jami to‘lov</p>
                    <p className="text-[22px] leading-none font-extrabold text-[#F97316]">
                      {formatSum(total)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/buyurtmalarim')}
                disabled={!hasItems}
                className="mt-[14px] flex h-[50px] w-full items-center justify-between gap-[8px] rounded-full bg-[#F97316] px-[18px] text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)] hover:bg-[#ea6a0c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Buyurtmani rasmiylashtirish</span>
                <span className="inline-flex items-center gap-[6px]">
                  {formatSum(total)}
                  <Icon name="arrow_forward" className="text-[18px]" />
                </span>
              </button>
              <p className="mt-[10px] flex items-center justify-center gap-[5px] text-[11px] text-[#8A7B74]">
                <Icon name="verified_user" className="text-[15px] text-[#F97316]" />
                Xavfsiz onlayn to‘lov va tezkor kuryer
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky checkout */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E9EDFF] bg-white/95 px-[16px] py-[12px] backdrop-blur-md min-[1100px]:hidden">
        <button
          type="button"
          onClick={() => navigate('/buyurtmalarim')}
          disabled={!hasItems}
          className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-full bg-[#F97316] px-[16px] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buyurtmani rasmiylashtirish
          <span className="opacity-90">{formatSum(total)}</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
        <p className="mt-[6px] flex items-center justify-center gap-[4px] text-[11px] text-[#8A7B74]">
          <Icon name="verified_user" className="text-[14px] text-[#F97316]" />
          Xavfsiz onlayn to‘lov va tezkor kuryer
        </p>
      </div>
    </div>
  )
}
