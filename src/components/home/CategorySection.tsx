import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { categories } from '../../data/home'

export function CategoryCard({
  name,
  count,
  image,
  id,
}: {
  name: string
  count: string
  image: string
  id: string
}) {
  return (
    <Link
      to={`/restoranlar?category=${id}`}
      className="group flex w-[120px] shrink-0 flex-col items-center rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(20,27,43,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F1F3FF] hover:shadow-md min-[900px]:w-auto"
    >
      <div className="mb-3 h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-[#E9EDFF] transition-transform group-hover:scale-105">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <span className="line-clamp-1 w-full text-center text-[14px] leading-5 font-bold text-[#141b2b] group-hover:text-[#9d4300]">
        {name}
      </span>
      <span className="mt-1 text-[12px] leading-4 text-[#584237]">{count}</span>
    </Link>
  )
}

export function CategorySection() {
  return (
    <section className="w-full px-[55px] py-6 lg:py-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <span className="text-[11px] leading-[14px] font-bold tracking-widest text-[#9d4300] uppercase">
            Katalog
          </span>
          <h2 className="text-[28px] leading-9 font-bold tracking-[-0.02em] text-[#141b2b] lg:text-[32px] lg:leading-10">
            Kategoriyalar bo&apos;yicha qidiring
          </h2>
        </div>
        <Link
          to="/kategoriyalar"
          className="inline-flex items-center gap-1 text-[15px] leading-5 font-semibold text-[#9d4300] hover:text-[#a73a00]"
        >
          Barchasi
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:grid min-[900px]:grid-cols-8 min-[900px]:gap-4 min-[900px]:overflow-visible">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} {...cat} />
        ))}
      </div>
    </section>
  )
}
