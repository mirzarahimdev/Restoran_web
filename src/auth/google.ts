const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client'

type GoogleTokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void
}

type GoogleCredentialResponse = {
  credential?: string
  select_by?: string
}

type GoogleIdConfig = {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
  context?: string
  ux_mode?: 'popup' | 'redirect'
  use_fedcm_for_prompt?: boolean
}

type GoogleOauth2 = {
  initTokenClient: (config: {
    client_id: string
    scope: string
    callback: (response: { access_token?: string; error?: string; error_description?: string }) => void
    error_callback?: (error: { type?: string; message?: string }) => void
  }) => GoogleTokenClient
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void
          prompt: (momentListener?: (notification: {
            isNotDisplayed: () => boolean
            isSkippedMoment: () => boolean
            isDismissedMoment: () => boolean
            getNotDisplayedReason: () => string
            getSkippedReason: () => string
          }) => void) => void
          cancel: () => void
        }
        oauth2: GoogleOauth2
      }
    }
  }
}

let scriptPromise: Promise<void> | null = null

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || ''
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(getGoogleClientId())
}

export function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`)
    if (existing) {
      if (window.google?.accounts?.oauth2) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google script load failed')), {
        once: true,
      })
      return
    }
    const script = document.createElement('script')
    script.src = GOOGLE_SCRIPT
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google script load failed'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

/** Opens Google account picker and returns an OAuth access token. */
export async function requestGoogleAccessToken(): Promise<string> {
  const clientId = getGoogleClientId()
  if (!clientId) {
    throw new Error(
      'Google Client ID sozlanmagan. .env faylida VITE_GOOGLE_CLIENT_ID ni to‘ldiring va Vite’ni qayta ishga tushiring.',
    )
  }

  await loadGoogleScript()
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services yuklanmadi. Internet aloqasini tekshiring.')
  }

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response) => {
        if (response.error || !response.access_token) {
          const msg =
            response.error_description ||
            response.error ||
            'Google orqali kirish bekor qilindi'
          reject(new Error(msg))
          return
        }
        resolve(response.access_token)
      },
      error_callback: (error) => {
        reject(new Error(error.message || error.type || 'Google oynasi ochilmadi'))
      },
    })
    client.requestAccessToken({ prompt: 'select_account' })
  })
}
