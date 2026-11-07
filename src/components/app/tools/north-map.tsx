import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { MAP_POINTS, type MapPoint } from '@/data/north-map'
import { sectorById } from '@/data/sectors'
import { sourceById } from '@/data/sources'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Panel, ToolHeader } from '../primitives'

const KIND_STYLE: Record<MapPoint['kind'], string> = {
  port: 'background:#3b82f6;border-radius:999px;',
  zone: 'background:#ffd400;border-radius:3px;',
  site: 'background:#f2f0ea;border-radius:999px;',
}

export function NorthMap() {
  const { tr } = useLanguage()
  const el = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<MapPoint>(MAP_POINTS[3])
  const focus = useRef<(p: MapPoint) => void>(() => {})

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    void import('leaflet').then((L) => {
      if (disposed || !el.current) return
      const map = L.map(el.current, {
        center: [43.1, -6.2],
        zoom: 7,
        scrollWheelZoom: false,
        attributionControl: true,
      })
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
        className: 'osm-dark',
      }).addTo(map)
      requestAnimationFrame(() => map.invalidateSize())
      const markers = new Map<string, ReturnType<typeof L.marker>>()
      for (const p of MAP_POINTS) {
        const icon = L.divIcon({
          className: '',
          html: `<span style="display:block;width:18px;height:18px;border:3px solid #0a0b0d;box-shadow:0 0 0 2px rgba(255,212,0,.35);${KIND_STYLE[p.kind]}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })
        const m = L.marker([p.lat, p.lng], {
          icon,
          keyboard: true,
          title: p.name.es,
        })
          .addTo(map)
          .on('click', () => setActive(p))
        markers.set(p.id, m)
      }
      focus.current = (p) =>
        map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 9), { duration: 0.8 })
      cleanup = () => map.remove()
    })
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  const select = (p: MapPoint) => {
    setActive(p)
    focus.current(p)
  }

  const kindLabel: Record<MapPoint['kind'], string> = {
    port: tr({ es: 'Puerto', en: 'Port' }),
    zone: tr({ es: 'Zona logística', en: 'Logistics zone' }),
    site: tr({ es: 'Operación', en: 'Operation' }),
  }
  const src = active.source ? sourceById(active.source) : undefined
  const sector = active.sector ? sectorById(active.sector) : undefined

  return (
    <>
      <ToolHeader
        title={tr({
          es: 'Mapa logístico del norte',
          en: 'Northern logistics map',
        })}
        description={tr({
          es: 'Puertos, zonas logísticas y operaciones de referencia entre Galicia, Asturias, Cantabria y León. Ubicaciones aproximadas; cada punto enlaza a su caso y a la fuente del dato.',
          en: 'Ports, logistics zones and reference operations across Galicia, Asturias, Cantabria and León. Approximate locations; each point links to its case and to the data source.',
        })}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="self-start overflow-hidden rounded-xl border border-border">
          <div
            ref={el}
            className="h-[62vh] min-h-[380px] w-full bg-[#0e0f11]"
            role="application"
            aria-label={tr({
              es: 'Mapa del norte de España',
              en: 'Map of northern Spain',
            })}
          />
        </div>
        <div className="space-y-4">
          <Panel>
            <p className="font-data text-[10px] tracking-widest text-primary uppercase">
              {kindLabel[active.kind]}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">
              {tr(active.name)}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {tr(active.text)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sector && (
                <Link
                  to="/app/casos"
                  search={{ caso: sector.id }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {tr({ es: 'Ver el caso', en: 'See the case' })} {sector.code}
                </Link>
              )}
              {src && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {tr({ es: 'Fuente', en: 'Source' })}: {src.publisher}
                  <ArrowUpRight className="size-3" />
                </a>
              )}
            </div>
          </Panel>
          <Panel title={tr({ es: 'Puntos', en: 'Points' })}>
            <ul className="space-y-1">
              {MAP_POINTS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => select(p)}
                    aria-pressed={p.id === active.id}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      p.id === active.id ? 'bg-primary/15' : 'hover:bg-accent',
                    )}
                  >
                    <span
                      className="size-3 shrink-0"
                      style={
                        { cssText: KIND_STYLE[p.kind] } as React.CSSProperties
                      }
                      aria-hidden
                    >
                      <span
                        className="block size-3"
                        style={{
                          background:
                            p.kind === 'port'
                              ? '#3b82f6'
                              : p.kind === 'zone'
                                ? '#ffd400'
                                : '#f2f0ea',
                          borderRadius: p.kind === 'zone' ? 2 : 999,
                        }}
                      />
                    </span>
                    {tr(p.name)}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
              {(['port', 'zone', 'site'] as const).map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <span
                    className="block size-2.5"
                    style={{
                      background:
                        k === 'port'
                          ? '#3b82f6'
                          : k === 'zone'
                            ? '#ffd400'
                            : '#f2f0ea',
                      borderRadius: k === 'zone' ? 2 : 999,
                    }}
                  />
                  {kindLabel[k]}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  )
}
