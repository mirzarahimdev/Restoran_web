import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

type CartButtonProps = {
  total?: string
  count?: number
}

export function CartButton({ total = "85,000 so'm", count = 3 }: CartButtonProps) {
  return (
    <Link
      to="/savat"
      className="flex h-[36px] cursor-pointer items-center gap-[8px] rounded-full bg-[#293040] px-[14px] text-white transition-colors hover:bg-[#141b2b] focus-visible:ring-2 focus-visible:ring-[#F97316]/50 focus-visible:outline-none"
    >
      <span className="relative flex items-center justify-center">
        <Icon name="shopping_bag" className="text-[18px]" />
        <span className="sr-only">{count} ta mahsulot</span>
      </span>
      <span className="hidden text-[13px] font-semibold whitespace-nowrap sm:inline">{total}</span>
    </Link>
  )
}
