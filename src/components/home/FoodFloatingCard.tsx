import { Link } from 'react-router-dom'
import { useCart } from '../../cart/CartContext'
import { Icon } from '../ui/Icon'

type FoodFloatingCardProps = {
  variant: 'main' | 'pizza' | 'burger'
}

const images = {
  main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFl2-inp6g1EYGQuOuyQtgsUk2We0uicvVtb_vMVFIwmj-sSDSXqeSpA6KGYiMdQxsT1KXEq6qQHD0oJw6wyN2H8lPDJZfCo6wiLrI1RxPyNqaVGmeY2nhopQReQhRwvHbIW5ls5SfAb_kZtGY9tWaJ_WVs2I401ekXZKEyOBvOXBDCnGtxMERBX32OXgAJqlMPl2i1vGGZElsZnaoELiKDNqwu1iwVllkZ01C-z8GN7-6PChIZuH4',
  pizza:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAaPK2_PfMtiAV784W_OLiTOdGKiMsycPBEH5_Lg5PQjH7Y6cguFrTsKlushqMAOfukkJky0EnfuxXHmbEv5pmgdPkJROofrG-WT9DJ6pwhR1tUvPgg8eTFAge1m5qVUPeaGb6fHEE_NNHlH2zIcKf38JF0SMfVoo2pNLt658t9RB_r0XCj6LR199ozauOyGDOMikP10JqSFImj-SBC4Lk_KV5sAVDYxMAzAyBA7XEHrFMQRH0UtsxO',
  burger:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAPEbIrcyf6HaKavknW5IsEJFHn0xRPCsBdiVM-oONs9JHPyc0TKwqBvi2sXZxgP1sctXcEyRgXTlZAyL69SCjJtl9Mym-UINZzp3qmpFznH3qZ4-UjL7vWGJVAM89pITzmUCbSxhNqtCEp992jrakZsX7IF-iAz1s76esY5hztu7wr0Gk0ES-yIfB4KR5Qz7aTcyzA-RzahGQwrTBzd9Jo8hqN79dw8OFaJMJy5KAm7fSTrTW53QvF',
}

export function FoodFloatingCard({ variant }: FoodFloatingCardProps) {
  const { addItem } = useCart()

  if (variant === 'main') {
    return (
      <article className="group relative w-[300px] rounded-[24px] bg-white p-3 shadow-[0_20px_48px_rgba(20,27,43,0.14)] transition-transform hover:-translate-y-1">
        <Link
          to="/restoranlar/samarqand-osh"
          className="absolute inset-0 z-0 rounded-[24px]"
          aria-label="To'y Oshi Samarqand"
        />
        <div className="pointer-events-none relative mb-3 overflow-hidden rounded-[16px]">
          <img
            src={images.main}
            alt=""
            className="aspect-[4/3] h-auto w-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F97316]">
              <Icon name="check" className="text-[10px] text-white" filled />
            </span>
            <span className="text-[11px] font-bold text-[#141b2b]">Chef&apos;s Special</span>
          </div>
        </div>
        <div className="pointer-events-none relative z-10 flex flex-col gap-1 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[18px] leading-6 font-bold text-[#141b2b]">
              To&apos;y Oshi Samarqand
            </h3>
            <span className="mt-0.5 shrink-0 rounded-full bg-[#E8EAFF] px-2.5 py-1 text-[11px] font-bold text-[#4F5BD5]">
              25 daq
            </span>
          </div>
          <p className="truncate text-[12px] leading-4 text-[#8A7B74]">
            Lagan, bedana tuxum, no&apos;xat, mayiz
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[22px] font-extrabold text-[#F97316]">48,000 so&apos;m</p>
            <button
              type="button"
              aria-label="Savatga qo'shish"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addItem({
                  dishId: 'toy-oshi',
                  restaurantId: 'samarqand-osh',
                  restaurantName: 'Samarqand Osh',
                  name: "To'y Oshi Samarqand",
                  description: "Lagan, bedana tuxum, no'xat, mayiz",
                  price: 48000,
                  image: images.main,
                })
              }}
              className="pointer-events-auto relative z-20 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_8px_18px_rgba(249,115,22,0.4)] transition-all hover:bg-[#EA580C] active:scale-90"
            >
              <Icon name="add" className="text-[22px]" />
            </button>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'pizza') {
    return (
      <Link
        to="/restoranlar?category=pizza"
        className="block w-[236px] cursor-pointer rounded-[18px] bg-white p-2.5 shadow-[0_16px_36px_rgba(20,27,43,0.12)] transition-transform hover:-translate-y-0.5"
      >
        <div className="relative mb-2 overflow-hidden rounded-[12px]">
          <img
            src={images.pizza}
            alt="Pepperoni Max Pizza"
            className="aspect-[16/10] h-auto w-full object-cover"
          />
          <span className="absolute top-2 right-2 rounded-full bg-[#E53935] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            -20%
          </span>
        </div>
        <div className="px-0.5">
          <p className="truncate text-[13px] font-bold text-[#141b2b]">Pepperoni Max Pizza</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#F97316]">75,000 so&apos;m</span>
            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-[#141b2b]">
              <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
              4.8
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to="/restoranlar?category=fastfood"
      className="block w-[260px] cursor-pointer rounded-[20px] bg-white p-3 shadow-[0_16px_36px_rgba(20,27,43,0.12)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative mb-2.5 overflow-hidden rounded-[14px]">
        <img
          src={images.burger}
          alt="Double Angus Burger"
          className="aspect-[16/10] h-auto w-full object-cover"
        />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-[#FEA619] px-2.5 py-1 text-[12px] font-bold text-[#684000] shadow-sm">
          Xit
        </span>
      </div>
      <div className="px-0.5">
        <p className="truncate text-[15px] font-bold text-[#141b2b]">Double Angus Burger</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#F97316]">52,000 so&apos;m</span>
          <span className="text-[12px] text-[#8A7B74]">20–30 daq</span>
        </div>
      </div>
    </Link>
  )
}
