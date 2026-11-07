import { GraduationCap } from 'lucide-react'
import type { Localized } from '@/lib/i18n'
import { useLanguage } from '@/lib/i18n'

interface Stop {
  code: string
  title: Localized
  detail: Localized
  current?: boolean
}

const PATH: Stop[] = [
  {
    code: '01',
    title: { es: 'Laboratorio', en: 'Laboratory' },
    detail: {
      es: 'Procedimientos, trazabilidad y la costumbre de medir antes de opinar.',
      en: 'Procedures, traceability and the habit of measuring before giving an opinion.',
    },
  },
  {
    code: '02',
    title: { es: 'Inventarios', en: 'Inventories' },
    detail: {
      es: 'Recuentos, descuadres y por qué el stock del sistema y el de la estantería no siempre coinciden.',
      en: 'Counts, discrepancies and why system stock and shelf stock do not always match.',
    },
  },
  {
    code: '03',
    title: { es: 'Distribución alimentaria', en: 'Food distribution' },
    detail: {
      es: 'Fechas, frío y rutas: cuando el reloj manda sobre todo lo demás.',
      en: 'Dates, cold chain and routes: when the clock overrides everything else.',
    },
  },
  {
    code: '04',
    title: { es: 'Sector café', en: 'Coffee sector' },
    detail: {
      es: 'Producto, cliente y la cadena completa vista desde otro ángulo.',
      en: 'Product, customer and the whole chain seen from another angle.',
    },
  },
  {
    code: '05',
    title: { es: 'Team Leader de Pick', en: 'Pick Team Leader' },
    detail: {
      es: 'Desde 2024 dirijo un equipo de preparación de pedidos. Personas, ritmo y calidad en el mismo turno.',
      en: 'Since 2024 I have led an order-picking team. People, pace and quality in the same shift.',
    },
    current: true,
  },
]

export function About() {
  const { tr } = useLanguage()
  return (
    <section
      id="quien"
      className="scroll-mt-20 border-b border-border/60 py-24"
    >
      <div className="mx-auto grid max-w-content gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-data text-xs tracking-widest text-primary uppercase">
            A01 · {tr({ es: 'Quién soy', en: 'About me' })}
          </p>
          <h2 className="signage mt-5 text-5xl sm:text-6xl">
            {tr({ es: 'De la bata', en: 'From lab coat' })}
            <br />
            <span className="outline-text">
              {tr({ es: 'al chaleco', en: 'to hi-vis' })}
            </span>
          </h2>
          <p className="mt-6 max-w-reading text-lg leading-relaxed text-muted-foreground">
            {tr({
              es: 'Mi recorrido ha pasado por el laboratorio, los inventarios, la distribución alimentaria y el café antes de llegar al pick. En todos aparece la misma pregunta: cómo conseguir que lo correcto llegue a su sitio, a tiempo y sin errores, sin desgastar a quien lo hace.',
              en: 'My path went through the lab, inventories, food distribution and coffee before reaching pick. The same question shows up in all of them: how to get the right thing to the right place, on time and without errors, without wearing down the people who do it.',
            })}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <GraduationCap className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {tr({
                  es: 'Máster en Gestión de la Calidad',
                  en: 'Master in Quality Management',
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Universidad de Oviedo
              </p>
            </div>
          </div>
        </div>

        <ol className="relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[23px] before:w-px before:bg-border">
          {PATH.map((stop) => (
            <li key={stop.code} className="relative flex gap-5">
              <span
                className={
                  stop.current
                    ? 'relative z-10 grid size-12 shrink-0 place-items-center rounded-md bg-primary font-data text-sm font-bold text-primary-foreground'
                    : 'relative z-10 grid size-12 shrink-0 place-items-center rounded-md border border-border bg-background font-data text-sm text-muted-foreground'
                }
              >
                {stop.code}
              </span>
              <div
                className={
                  stop.current
                    ? 'flex-1 rounded-lg border border-primary/50 bg-primary/[0.07] p-5'
                    : 'flex-1 rounded-lg border border-border bg-card p-5'
                }
              >
                <h3 className="font-display text-lg font-bold">
                  {tr(stop.title)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {tr(stop.detail)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
