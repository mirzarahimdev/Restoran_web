export type LatLon = [number, number]

export type YandexAddress = {
  label: string
  city?: string
  street?: string
}

type YMapsGeocodeResult = {
  geoObjects: {
    get: (index: number) => YMapsGeoObject | null
  }
}

type YMapsGeoObject = {
  getAddressLine: () => string
  getThoroughfare?: () => string | null
  getPremiseNumber?: () => string | null
  getLocalities?: () => string[]
  geometry: {
    getCoordinates: () => LatLon
  }
}

export type YMapsMap = {
  destroy: () => void
  setCenter: (coords: LatLon, zoom?: number, options?: object) => void
  setZoom: (zoom: number) => void
  geoObjects: {
    add: (obj: unknown) => void
    remove: (obj: unknown) => void
  }
  events: {
    add: (event: string, handler: (e: { get: (key: string) => LatLon }) => void) => void
    remove: (event: string, handler: (e: { get: (key: string) => LatLon }) => void) => void
  }
  controls: {
    add: (control: string, options?: object) => void
  }
  container: {
    fitToViewport: () => void
  }
}

export type YMapsPlacemark = {
  geometry: {
    getCoordinates: () => LatLon
    setCoordinates: (coords: LatLon) => void
  }
  events: {
    add: (event: string, handler: () => void) => void
  }
}

export type YMapsApi = {
  ready: (cb: () => void) => void
  Map: new (
    element: HTMLElement | string,
    state: {
      center: LatLon
      zoom: number
      controls?: string[]
      type?: string
    },
    options?: object,
  ) => YMapsMap
  Placemark: new (
    coords: LatLon,
    properties?: object,
    options?: object,
  ) => YMapsPlacemark
  geocode: (
    query: string | LatLon,
    options?: object,
  ) => Promise<YMapsGeocodeResult>
}

declare global {
  interface Window {
    ymaps?: YMapsApi
  }
}

const SCRIPT_ID = 'yandex-maps-api-2-1'

export const DEFAULT_TASHKENT: LatLon = [41.3285, 69.2805]

export function getYandexMapsApiKey() {
  return (import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined)?.trim() || ''
}

export function loadYandexMaps(lang = 'uz_UZ'): Promise<YMapsApi> {
  const apiKey = getYandexMapsApiKey()
  if (!apiKey) {
    return Promise.reject(new Error('Yandex Maps API key missing'))
  }

  if (window.ymaps) {
    return new Promise((resolve) => {
      window.ymaps!.ready(() => resolve(window.ymaps!))
    })
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    const onReady = () => {
      if (!window.ymaps) {
        reject(new Error('Yandex Maps failed to initialize'))
        return
      }
      window.ymaps.ready(() => resolve(window.ymaps!))
    }

    if (existing) {
      if (window.ymaps) {
        onReady()
        return
      }
      existing.addEventListener('load', onReady, { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Yandex Maps script failed to load')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=${lang}`
    script.async = true
    script.onload = onReady
    script.onerror = () => reject(new Error('Yandex Maps script failed to load'))
    document.head.appendChild(script)
  })
}

export function parseGeoObject(obj: YMapsGeoObject): YandexAddress {
  const label = obj.getAddressLine()
  const localities = obj.getLocalities?.() ?? []
  const city = localities[0]
  const road = obj.getThoroughfare?.() || ''
  const house = obj.getPremiseNumber?.() || ''
  const street = [road, house].filter(Boolean).join(', ') || undefined
  return { label, city, street }
}

export async function reverseGeocode(
  ymaps: YMapsApi,
  coords: LatLon,
): Promise<YandexAddress> {
  const res = await ymaps.geocode(coords, { results: 1 })
  const obj = res.geoObjects.get(0)
  if (!obj) {
    return { label: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` }
  }
  return parseGeoObject(obj)
}

export function yandexWidgetSrc(coords: LatLon, zoom = 16) {
  const [lat, lon] = coords
  return `https://yandex.uz/map-widget/v1/?ll=${lon}%2C${lat}&z=${zoom}&l=map&pt=${lon},${lat},pm2dgl&lang=uz_UZ`
}
