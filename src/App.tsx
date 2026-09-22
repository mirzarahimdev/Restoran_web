import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminShell } from './admin/components/AdminShell'
import { RequirePanelAuth } from './admin/components/RequirePanelAuth'
import { SuperAdminShell } from './admin/components/SuperAdminShell'
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage'
import {
  AdminCategoriesPage,
  AdminCustomersPage,
  AdminMenuPage,
  AdminOrdersPage,
  AdminPaymentsPage,
  AdminProductsPage,
  AdminProfilePage,
  AdminPromosPage,
  AdminReviewsPage,
  AdminSettingsPage,
  AdminStatsPage,
  SuperAdminsPage,
  SuperFinancePage,
  SuperLogsPage,
  SuperOrdersPage,
  SuperReportsPage,
  SuperRestaurantsPage,
  SuperSettingsPage,
} from './admin/pages/placeholders'
import { SuperAdminDashboardPage } from './admin/pages/SuperAdminDashboardPage'
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

        {/* Admin — kirish umumiy /kirish orqali */}
        <Route path="admin">
          <Route path="kirish" element={<Navigate to="/kirish" replace />} />
          <Route
            element={
              <RequirePanelAuth role="admin">
                <AdminShell />
              </RequirePanelAuth>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="buyurtmalar" element={<AdminOrdersPage />} />
            <Route path="profil" element={<AdminProfilePage />} />
            <Route path="menyu" element={<AdminMenuPage />} />
            <Route path="toifalar" element={<AdminCategoriesPage />} />
            <Route path="mahsulotlar" element={<AdminProductsPage />} />
            <Route path="aksiyalar" element={<AdminPromosPage />} />
            <Route path="mijozlar" element={<AdminCustomersPage />} />
            <Route path="sharhlar" element={<AdminReviewsPage />} />
            <Route path="tolovlar" element={<AdminPaymentsPage />} />
            <Route path="statistika" element={<AdminStatsPage />} />
            <Route path="sozlamalar" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Super Admin — kirish umumiy /kirish orqali */}
        <Route path="super-admin">
          <Route path="kirish" element={<Navigate to="/kirish" replace />} />
          <Route
            element={
              <RequirePanelAuth role="super-admin">
                <SuperAdminShell />
              </RequirePanelAuth>
            }
          >
            <Route index element={<SuperAdminDashboardPage />} />
            <Route path="restoranlar" element={<SuperRestaurantsPage />} />
            <Route path="adminlar" element={<SuperAdminsPage />} />
            <Route path="buyurtmalar" element={<SuperOrdersPage />} />
            <Route path="moliya" element={<SuperFinancePage />} />
            <Route path="hisobotlar" element={<SuperReportsPage />} />
            <Route path="loglar" element={<SuperLogsPage />} />
            <Route path="sozlamalar" element={<SuperSettingsPage />} />
          </Route>
        </Route>

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
