import { Icon } from '../ui/Icon'

type BenefitPillProps = {
  icon: string
  label: string
  iconBg: string
  filled?: boolean
  onClick?: () => void
}

export function BenefitPill({ icon, label, iconBg, filled, onClick }: BenefitPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-[8px] rounded-full bg-white py-[8px] pr-[20px] pl-[8px] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#F97316]/35 focus-visible:outline-none"
    >
      <span
        className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon name={icon} className="text-[16px]" filled={filled} />
      </span>
      <span className="text-[13px] leading-[18px] font-semibold whitespace-nowrap text-[#141b2b]">
        {label}
      </span>
    </button>
  )
}
