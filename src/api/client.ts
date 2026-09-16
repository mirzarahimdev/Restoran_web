const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const data = (await res.json()) as { detail?: string | { msg?: string }[] }
      if (typeof data.detail === 'string') {
        detail = data.detail
      } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
        detail = data.detail.map((d) => d.msg).filter(Boolean).join('. ')
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export { API_BASE }
