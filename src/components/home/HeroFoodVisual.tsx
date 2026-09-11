import { FoodFloatingCard } from './FoodFloatingCard'

export function HeroFoodVisual() {
  return (
    <div className="relative mx-auto hidden h-[480px] w-full min-[900px]:block min-[1400px]:h-[560px]">
      <div className="absolute top-0 left-1/2 h-[560px] w-[520px] origin-top -translate-x-1/2 scale-[0.86] min-[1400px]:scale-100">
        <div
          className="absolute top-[48%] left-[48%] z-0 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C4A8]"
          aria-hidden
        />

        <div className="absolute inset-0">
          <div className="absolute top-[88px] left-[64px] z-10">
            <FoodFloatingCard variant="main" />
          </div>

          <div className="absolute bottom-[20px] left-[-56px] z-20 -rotate-[8deg] transition-transform hover:z-40 hover:rotate-0">
            <FoodFloatingCard variant="burger" />
          </div>

          <div className="absolute top-[36px] left-[200px] z-30 rotate-[5deg] transition-transform hover:z-40 hover:rotate-0">
            <FoodFloatingCard variant="pizza" />
          </div>
        </div>
      </div>
    </div>
  )
}
