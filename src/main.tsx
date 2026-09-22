import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminAuthProvider } from './admin/auth/AdminAuthContext'
import { AuthProvider } from './auth/AuthContext'
import { CartProvider } from './cart/CartContext'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
