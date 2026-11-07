import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { WarehouseMap } from '@/components/app/tools/pick-route'
import { Button } from '@/components/ui/button'
import { BLOG_URL, LINKEDIN_URL } from '@/data/content'
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
    const duration = 7000
    const tick = (now: number) => {
      const t = (now - start) / duration
      setProgress(Math.min(1, t))
      if (t >= 1.25) {
        setSeed((s) => s + 1)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seed])

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-[0_40px_90px_-40px_rgb(59_130_246/0.45)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-data tracking-wider text-muted-foreground uppercase">
          {tr({
            es: 'Ruta calculada en tu navegador',
            en: 'Route computed in your browser',
          })}
        </span>
        <span className="font-data font-bold">{Math.round(best)} m</span>
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
      <p className="mt-2 text-xs text-muted-foreground">
        {tr({
          es: `Pedido de ejemplo: ${Math.round(sShape - best)} m menos que recorriendo en S-shape.`,
          en: `Example order: ${Math.round(sShape - best)} m less than walking S-shape.`,
        })}
      </p>
    </div>
  )
}

export function Hero() {
  const { tr } = useLanguage()
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="floor-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-content gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-24">
        <div>
          <p className="font-data text-xs font-medium tracking-widest text-primary uppercase">
            {tr({
              es: 'Herramientas para operaciones de almacén',
              en: 'Tools for warehouse operations',
            })}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-extrabold sm:text-6xl">
            {tr({
              es: 'Lo que un turno necesita, sin hojas de cálculo.',
              en: 'What a shift needs, without spreadsheets.',
            })}
          </h1>
          <p className="mt-5 max-w-reading text-lg leading-relaxed text-muted-foreground">
            {tr({
              es: 'Reparte la carga, acorta recorridos, llega a los cortes y deja el relevo hecho. Gratis, sin registro, y tus datos no salen de tu navegador.',
              en: 'Balance the load, shorten walks, make the cutoffs and leave the handover done. Free, no sign-up, and your data stays in your browser.',
            })}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link to="/app">
                {tr({
                  es: 'Abrir el espacio de trabajo',
                  en: 'Open the workspace',
                })}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
                <BookOpen />
                {tr({ es: 'Leer el blog', en: 'Read the blog' })}
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-5 text-sm">
            <span className="font-display font-semibold">
              José Antonio Gálvez Marcos
            </span>
            <span className="text-muted-foreground">
              {tr({ es: 'Team Leader de Pick', en: 'Pick Team Leader' })}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-3.5" />
              {tr({ es: 'Oviedo, Asturias', en: 'Oviedo, Asturias' })}
            </span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <LinkedInIcon className="size-3.5" />
              LinkedIn
            </a>
          </div>
        </div>
        <LiveRoute />
      </div>
    </section>
  )
}
