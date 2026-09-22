import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  panelLoginPath,
  readStoredPanelUser,
  useAdminAuth,
  type PanelRole,
} from '../auth/AdminAuthContext'

export function RequirePanelAuth({
  role,
  children,
}: {
  role: PanelRole
  children: ReactNode
}) {
  const { user } = useAdminAuth()
  const location = useLocation()
  const effective = user ?? readStoredPanelUser()

  if (!effective || effective.role !== role) {
    return (
      <Navigate
        to={panelLoginPath(role)}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
