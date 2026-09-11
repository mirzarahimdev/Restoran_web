import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { RegisterPage } from './pages/RegisterPage'
import { RestaurantsPage } from './pages/RestaurantsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="kirish" element={<LoginPage />} />
        <Route path="royxatdan-otish" element={<RegisterPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restoranlar" element={<RestaurantsPage />} />
          <Route
            path="restoranlar/:id"
            element={
              <PlaceholderPage
                title="Restoran menyusi"
                description="Samarqand Osh Markazi va boshqa restoran menyulari tez orada."
              />
            }
          />
          <Route
            path="kategoriyalar"
            element={
              <PlaceholderPage
                title="Kategoriyalar"
                description="Taom kategoriyalari sahifasi keyingi qadamda qo'shiladi."
              />
            }
          />
          <Route
            path="aksiyalar"
            element={
              <PlaceholderPage
                title="Aksiyalar"
                description="Promo va chegirmalar sahifasi tez orada."
              />
            }
          />
          <Route path="buyurtmalarim" element={<CheckoutPage />} />
          <Route
            path="savat"
            element={
              <PlaceholderPage
                title="Savat va checkout"
                description="Buyurtmani rasmiylashtirish sahifasi keyingi bosqichda."
              />
            }
          />
          <Route
            path="sevimlilar"
            element={
              <PlaceholderPage
                title="Sevimlilar"
                description="Saqlangan restoran va taomlaringiz shu yerda ko'rinadi."
              />
            }
          />
          <Route
            path="parolni-tiklash"
            element={
              <PlaceholderPage
                title="Parolni tiklash"
                description="OTP va yangi parol oqimi keyingi bosqichda qo'shiladi."
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
