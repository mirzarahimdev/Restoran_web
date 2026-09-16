import { Link } from 'react-router-dom'
import { formatCartSum, useCart } from '../../cart/CartContext'
import { Icon } from '../ui/Icon'

export function CartButton() {
  const { count, foodTotal, items } = useCart()
  const total = items.length ? formatCartSum(foodTotal) : "0 so'm"

  return (
    <Link
      to="/buyurtmalarim"
      className="flex h-[36px] cursor-pointer items-center gap-[8px] rounded-full bg-[#293040] px-[14px] text-white transition-colors hover:bg-[#141b2b] focus-visible:ring-2 focus-visible:ring-[#F97316]/50 focus-visible:outline-none"
    >
      <span className="relative flex items-center justify-center">
        <Icon name="shopping_bag" className="text-[18px]" />
        {count > 0 && (
          <span className="absolute -top-[6px] -right-[8px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#F97316] px-[4px] text-[10px] font-bold">
            {count}
          </span>
        )}
        <span className="sr-only">{count} ta mahsulot</span>
      </span>
      <span className="hidden text-[13px] font-semibold whitespace-nowrap sm:inline">{total}</span>
    </Link>
  )
}
