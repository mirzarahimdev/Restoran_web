const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client'

type GoogleTokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void
}

type GoogleOauth2 = {
  initTokenClient: (config: {
    client_id: string
    scope: string
    callback: (response: { access_token?: string; error?: string }) => void
  }) => GoogleTokenClient
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: GoogleOauth2
      }
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Google script load failed')))
      if (window.google?.accounts?.oauth2) resolve()
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

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || ''
}

/** Opens Google account picker and returns an OAuth access token. */
export async function requestGoogleAccessToken(): Promise<string> {
  const clientId = getGoogleClientId()
  if (!clientId) {
    throw new Error(
      'Google Client ID sozlanmagan. .env fayliga VITE_GOOGLE_CLIENT_ID qo‘shing.',
    )
  }

  await loadGoogleScript()
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services yuklanmadi')
  }

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'Google orqali kirish bekor qilindi'))
          return
        }
        resolve(response.access_token)
      },
    })
    client.requestAccessToken({ prompt: 'select_account' })
  })
}
