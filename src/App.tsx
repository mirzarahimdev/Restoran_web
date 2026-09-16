import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { CheckoutPage } from './pages/CheckoutPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { PromotionsPage } from './pages/PromotionsPage'
import { RegisterPage } from './pages/RegisterPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { RestaurantsPage } from './pages/RestaurantsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="kirish" element={<LoginPage />} />
        <Route path="royxatdan-otish" element={<RegisterPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="parolni-tiklash" element={<ForgotPasswordPage />} />

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restoranlar" element={<RestaurantsPage />} />
          <Route path="restoranlar/:id" element={<RestaurantDetailPage />} />
          <Route path="aksiyalar" element={<PromotionsPage />} />
          <Route path="buyurtmalarim" element={<CheckoutPage />} />
          <Route path="savat" element={<Navigate to="/buyurtmalarim" replace />} />
          <Route path="sevimlilar" element={<FavoritesPage />} />
          <Route path="profil" element={<ProfilePage />} />
        </Route>
        <Route path="kategoriyalar" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
