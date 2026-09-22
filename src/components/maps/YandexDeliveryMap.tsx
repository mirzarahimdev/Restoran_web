import { useEffect, useRef, useState } from 'react'
import { Icon } from '../ui/Icon'
import {
  getYandexMapsApiKey,
  loadYandexMaps,
  reverseGeocode,
  yandexWidgetSrc,
  type LatLon,
  type YandexAddress,
  type YMapsMap,
  type YMapsPlacemark,
} from '../../lib/yandexMaps'

type YandexDeliveryMapProps = {
  coords: LatLon
  label: string
  selectedTitle: string
  changeLabel: string
  mapTitle: string
  pickHint: string
  onLocationChange: (coords: LatLon, address: YandexAddress) => void
}

export function YandexDeliveryMap({
  coords,
  label,
  selectedTitle,
  changeLabel,
  mapTitle,
  pickHint,
  onLocationChange,
}: YandexDeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<YMapsMap | null>(null)
  const placemarkRef = useRef<YMapsPlacemark | null>(null)
  const pickModeRef = useRef(false)
  const onLocationChangeRef = useRef(onLocationChange)
  const coordsRef = useRef(coords)

  const [pickMode, setPickMode] = useState(false)
  const [ready, setReady] = useState(false)
  const [useWidget, setUseWidget] = useState(!getYandexMapsApiKey())
  const hasKey = Boolean(getYandexMapsApiKey())

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange
  }, [onLocationChange])

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  useEffect(() => {
    pickModeRef.current = pickMode
  }, [pickMode])

  useEffect(() => {
    if (!hasKey || useWidget) return

    let cancelled = false
    let clickHandler: ((e: { get: (key: string) => LatLon }) => void) | null = null
    let resizeObserver: ResizeObserver | null = null

    const timer = window.setTimeout(() => {
      if (!containerRef.current) {
        setUseWidget(true)
        return
      }

      loadYandexMaps('uz_UZ')
        .then((ymaps) => {
          if (cancelled || !containerRef.current) return

          const start = coordsRef.current
          const map = new ymaps.Map(
            containerRef.current,
            {
              center: start,
              zoom: 16,
              controls: [],
              type: 'yandex#map',
            },
            {
              suppressMapOpenBlock: true,
              yandexMapDisablePoiInteractivity: true,
            },
          )

          map.controls.add('zoomControl', { position: { left: 12, top: 12 } })
          map.controls.add('geolocationControl', { position: { left: 12, top: 108 } })

          const placemark = new ymaps.Placemark(
            start,
            {
              hintContent: mapTitle,
            },
            {
              preset: 'islands#darkGreenCircleDotIcon',
              draggable: true,
              cursor: 'pointer',
            },
          )

          map.geoObjects.add(placemark)
          mapRef.current = map
          placemarkRef.current = placemark
          setReady(true)

          const applyCoords = async (next: LatLon) => {
            placemark.geometry.setCoordinates(next)
            map.setCenter(next, undefined, { duration: 200 })
            try {
              const address = await reverseGeocode(ymaps, next)
              onLocationChangeRef.current(next, address)
            } catch {
              onLocationChangeRef.current(next, {
                label: `${next[0].toFixed(5)}, ${next[1].toFixed(5)}`,
              })
            }
          }

          clickHandler = (e) => {
            if (!pickModeRef.current) return
            const next = e.get('coords')
            void applyCoords(next).then(() => {
              if (!cancelled) setPickMode(false)
            })
          }

          map.events.add('click', clickHandler)
          placemark.events.add('dragend', () => {
            void applyCoords(placemark.geometry.getCoordinates())
          })

          const fit = () => map.container.fitToViewport()
          window.setTimeout(fit, 80)
          window.setTimeout(fit, 300)
          resizeObserver = new ResizeObserver(fit)
          resizeObserver.observe(containerRef.current)
        })
        .catch((err) => {
          console.error('Yandex Maps init failed', err)
          if (!cancelled) setUseWidget(true)
        })
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      resizeObserver?.disconnect()
      if (mapRef.current && clickHandler) {
        mapRef.current.events.remove('click', clickHandler)
      }
      mapRef.current?.destroy()
      mapRef.current = null
      placemarkRef.current = null
    }
  }, [hasKey, useWidget, mapTitle])

  useEffect(() => {
    if (!mapRef.current || !placemarkRef.current) return
    const current = placemarkRef.current.geometry.getCoordinates()
    if (
      Math.abs(current[0] - coords[0]) < 1e-6 &&
      Math.abs(current[1] - coords[1]) < 1e-6
    ) {
      return
    }
    placemarkRef.current.geometry.setCoordinates(coords)
    mapRef.current.setCenter(coords)
  }, [coords])

  return (
    <div className="relative aspect-[16/9] min-h-[240px] w-full overflow-hidden rounded-[14px] bg-[#E8EEF4] sm:min-h-[280px]">
      {useWidget ? (
        <iframe
          title={mapTitle}
          src={yandexWidgetSrc(coords, 16)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="geolocation"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full [&_.ymaps-2-1-79-map]:!rounded-none"
            aria-label={mapTitle}
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#E8EEF4] text-[13px] font-medium text-[#6B7280]">
              Yandex Maps yuklanmoqda…
            </div>
          )}
        </>
      )}

      {pickMode && !useWidget && (
        <div className="absolute top-[10px] right-[10px] z-10 rounded-full bg-[#F97316] px-[10px] py-[5px] text-[11px] font-semibold text-white shadow-sm">
          {pickHint}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

      <div className="absolute inset-x-[10px] bottom-[10px] z-10 flex min-w-0 items-center gap-[8px] rounded-[12px] bg-white/95 px-[10px] py-[8px] shadow-[0_4px_16px_rgba(20,27,43,0.08)] sm:inset-x-[12px] sm:bottom-[12px] sm:gap-[10px] sm:px-[12px] sm:py-[10px]">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white sm:h-[36px] sm:w-[36px]">
          <Icon name="near_me" className="text-[16px] sm:text-[18px]" filled />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-[9px] font-semibold tracking-[0.1em] text-[#F97316] uppercase sm:text-[10px]">
            {selectedTitle}
          </p>
          <p className="truncate text-[12px] font-medium text-[#141b2b] sm:text-[13px]">
            {label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (useWidget) {
              window.open(
                `https://yandex.uz/maps/?ll=${coords[1]}%2C${coords[0]}&z=16&pt=${coords[1]},${coords[0]},pm2dgl&l=map`,
                '_blank',
                'noopener,noreferrer',
              )
              return
            }
            setPickMode((v) => !v)
          }}
          className={`hidden shrink-0 cursor-pointer rounded-[8px] border px-[8px] py-[5px] text-[11px] font-semibold whitespace-nowrap sm:inline-flex sm:text-[12px] ${
            pickMode
              ? 'border-[#F97316] bg-[#FFF4ED] text-[#F97316]'
              : 'border-[#D8DEF5] text-[#7B88D4] hover:bg-[#F5F6FF]'
          }`}
        >
          {changeLabel}
        </button>
      </div>
    </div>
  )
}
