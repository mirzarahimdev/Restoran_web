import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#F9F9FF]">
      <div className="fixed inset-x-0 top-0 z-[60] h-[15px] bg-[#F9F9FF]" aria-hidden />
      <Header />
      {/* 15px gap + 56px header = 71px */}
      <main className="flex-1 pt-[71px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
