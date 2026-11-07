import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react'
import { WarehouseMap } from '@/components/app/tools/pick-route'
import { NAV } from '@/components/app/nav'
import { Button } from '@/components/ui/button'
import { LINKEDIN_URL } from '@/data/content'
import {
  optimiseRoute,
  pathLength,
  randomPicks,
  sShapeRoute,
  tourLength,
  tourPath,
} from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { LinkedInIcon } from './linkedin-icon'

const LAYOUT = { aisles: 12, bays: 18, aisleGap: 3.5, bayLength: 1.4 }

function LiveRoute() {
  const { tr } = useLanguage()
  const [seed, setSeed] = useState(11)
  const [progress, setProgress] = useState(1)

  const { picks, path, best, sShape } = useMemo(() => {
    const p = randomPicks(14, LAYOUT, seed)
    const route = optimiseRoute(p, LAYOUT)
    return {
      picks: p,
      path: tourPath(route, LAYOUT),
      best: tourLength(route, LAYOUT),
      sShape: pathLength(sShapeRoute(p, LAYOUT).path),
    }
  }, [seed])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 7000
      setProgress(Math.min(1, t))
      if (t >= 1.3) {
        setSeed((s) => s + 1)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seed])

  return (
    <figure className="relative rounded-xl border border-border bg-card/90 p-4 shadow-[0_50px_120px_-50px_rgb(255_212_0/0.35)] backdrop-blur">
      <div className="absolute -top-3 left-4 rounded-sm bg-primary px-2 py-0.5 font-data text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
        {tr({ es: 'En directo', en: 'Live' })}
      </div>
      <div className="mb-2 flex items-center justify-between gap-3 pt-1 text-xs">
        <span className="font-data tracking-wider text-muted-foreground uppercase">
          {tr({ es: 'Ruta optimizada', en: 'Optimised route' })}
        </span>
        <span className="font-data text-base font-bold">
          {Math.round(best)} m
        </span>
      </div>
      <WarehouseMap
        layout={LAYOUT}
        picks={picks}
        path={path}
        progress={progress}
        mapLabel={tr({
          es: `Pedido de ejemplo de ${picks.length} ubicaciones recorrido en ${Math.round(best)} metros`,
          en: `Example order of ${picks.length} locations walked in ${Math.round(best)} metres`,
        })}
      />
      <figcaption className="mt-2 text-xs text-muted-foreground">
        {tr({
          es: `Pedido inventado, calculado ahora en tu navegador: ${Math.round(sShape - best)} m menos que en S-shape.`,
          en: `Made-up order, computed now in your browser: ${Math.round(sShape - best)} m less than S-shape.`,
        })}
      </figcaption>
    </figure>
  )
}

function Ticker() {
  const { tr } = useLanguage()
  const items = NAV.filter((n) => n.group !== 'learn').map((n) => tr(n.label))
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-primary/40 bg-primary text-primary-foreground">
      <div className="marquee flex w-max gap-10 py-3" aria-hidden>
        {[...row, ...row].map((label, i) => (
          <span
            key={i}
            className="signage flex items-center gap-10 text-lg whitespace-nowrap"
          >
            {label}
            <span className="size-2 rotate-45 bg-primary-foreground" />
          </span>
        ))}
      </div>
      <p className="sr-only">{items.join(', ')}</p>
    </div>
  )
}

export function Hero() {
  const { tr } = useLanguage()
  const big = 'signage rise block text-[13vw] sm:text-7xl lg:text-[5.6rem]'
  return (
    <section id="inicio" className="relative scroll-mt-20 overflow-hidden">
      <div className="floor-grid pointer-events-none absolute inset-0" />
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-content gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-20 lg:pb-24">
        <div>
          <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 font-data text-xs tracking-widest text-muted-foreground uppercase">
            <span className="text-primary">A00</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              Oviedo, Asturias
            </span>
            <span>·</span>
            <span>
              {tr({ es: 'Team Leader de Pick', en: 'Pick Team Leader' })}
            </span>
          </p>
          <h1 className="mt-6">
            <span className={big}>José Antonio</span>
            <span
              className={`${big} outline-text`}
              style={{ animationDelay: '120ms' }}
            >
              Gálvez
            </span>
            <span
              className={`${big} text-primary`}
              style={{ animationDelay: '240ms' }}
            >
              Marcos
            </span>
          </h1>
          <p
            className="rise mt-7 max-w-reading text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: '360ms' }}
          >
            {tr({
              es: 'Más de 15 años en logística, distribución e inventarios. Hoy dirijo un equipo de pick. Aquí comparto cómo trabajo, con herramientas que puedes usar en tu propia operación.',
              en: '15+ years in logistics, distribution and inventory. Today I lead a pick team. Here I show how I work, with tools you can use in your own operation.',
            })}
          </p>
          <div
            className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '480ms' }}
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-6 text-base font-semibold"
            >
              <Link to="/app">
                {tr({ es: 'Abrir las herramientas', en: 'Open the tools' })}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <a href="#quien">
                {tr({ es: 'Conóceme', en: 'About me' })}
                <ArrowDown />
              </a>
            </Button>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid size-12 place-items-center self-start rounded-md border border-border text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:self-auto motion-reduce:transition-none"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </div>
        </div>
        <LiveRoute />
      </div>
      <Ticker />
    </section>
  )
}
