import { Icon } from '../../components/ui/Icon'

type AdminPlaceholderProps = {
  title: string
  description?: string
  icon?: string
}

export function AdminPlaceholder({
  title,
  description = 'Bu bo‘lim tez orada to‘ldiriladi. Dashboard dizayni asosida keyingi iteratsiyada ochiladi.',
  icon = 'construction',
}: AdminPlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4ED] text-[#F97316]">
        <Icon name={icon} className="text-[28px]" />
      </span>
      <h1 className="text-[22px] font-bold tracking-tight text-[#141b2b]">{title}</h1>
      <p className="mt-2 max-w-md text-[14px] text-[#584237]">{description}</p>
    </div>
  )
}
