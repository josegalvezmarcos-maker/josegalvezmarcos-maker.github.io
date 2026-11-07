import { GraduationCap } from 'lucide-react'
import type { Localized } from '@/lib/i18n'
import { useLanguage } from '@/lib/i18n'

interface Stop {
  years: string
  title: Localized
  where: Localized
  detail: Localized
  current?: boolean
}

// Taken from his own LinkedIn profile; employers are described, not named.
const PATH: Stop[] = [
  {
    years: '2013–2017',
    title: {
      es: 'Encargado comercial y coordinador de inventarios',
      en: 'Commercial lead and inventory coordinator',
    },
    where: {
      es: 'Empresa de servicios de inventario · grandes superficies de Asturias',
      en: 'Inventory services company · large Asturian retailers',
    },
    detail: {
      es: 'Equipos de inventario en moda y alimentación, y responsable regional de reposición y campañas de un fabricante de snacks.',
      en: 'Inventory teams in fashion and grocery, and regional lead for a snack maker’s replenishment and campaigns.',
    },
  },
  {
    years: '2018–2019',
    title: {
      es: 'Responsable comercial y de procesos',
      en: 'Commercial and process lead',
    },
    where: { es: 'Tostadora de café', en: 'Coffee roaster' },
    detail: {
      es: 'Rediseño del layout productivo, estándares de calidad y trazabilidad, y reordenación de rutas comerciales.',
      en: 'Production layout redesign, quality and traceability standards, and commercial route reorganisation.',
    },
  },
  {
    years: '2019–2024',
    title: {
      es: 'Encargado general de logística, tienda y e-commerce',
      en: 'Head of logistics, shop and e-commerce',
    },
    where: { es: 'Distribuidora cárnica', en: 'Meat distributor' },
    detail: {
      es: 'Equipo de 15 personas. Trazabilidad y etiquetado nuevos (−40 % de errores logísticos), recepción y preparación rediseñadas (−30 % en tiempo de entrega) y apertura de una ruta comercial en León.',
      en: 'Team of 15. New traceability and labelling (−40% logistics errors), redesigned receiving and picking (−30% delivery time) and a new sales route in León.',
    },
  },
  {
    years: '2024–',
    title: { es: 'Team Leader de Pick', en: 'Pick Team Leader' },
    where: {
      es: 'Centro logístico robotizado de alto volumen',
      en: 'High-volume robotic fulfilment centre',
    },
    detail: {
      es: 'Organización del turno por volumen y horas de salida, ritmo y calidad de escaneo, seguridad, formación de incorporaciones y refuerzo en campañas.',
      en: 'Shift organisation by volume and departure times, pace and scan quality, safety, onboarding and peak-season support.',
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
            {tr({ es: '+15 años', en: '15+ years' })}
            <br />
            <span className="outline-text">
              {tr({ es: 'en planta', en: 'on the floor' })}
            </span>
          </h2>
          <p className="mt-6 max-w-reading text-lg leading-relaxed text-muted-foreground">
            {tr({
              es: 'Líder de operaciones en logística, distribución e inventarios, en textil, alimentación, industria y e-commerce. Coordino y formo equipos, mejoro procesos y monto sistemas de calidad y trazabilidad. Mi liderazgo es cercano, formador y orientado al rendimiento.',
              en: 'Operations leader in logistics, distribution and inventory, across fashion, food, industry and e-commerce. I coordinate and train teams, improve processes and build quality and traceability systems. My leadership is close, coaching and performance-driven.',
            })}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <GraduationCap className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {tr({
                  es: 'Máster en Gestión de la Calidad · formación en Biología',
                  en: 'Master in Quality Management · background in Biology',
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Universidad de Oviedo
              </p>
            </div>
          </div>
        </div>

        <ol className="relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[39px] before:w-px before:bg-border">
          {PATH.map((stop) => (
            <li key={stop.years} className="relative flex gap-5">
              <span
                className={
                  stop.current
                    ? 'relative z-10 grid h-12 w-20 shrink-0 place-items-center rounded-md bg-primary font-data text-xs font-bold text-primary-foreground'
                    : 'relative z-10 grid h-12 w-20 shrink-0 place-items-center rounded-md border border-border bg-background font-data text-xs text-muted-foreground'
                }
              >
                {stop.years}
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
                <p className="mt-0.5 font-data text-[11px] tracking-wide text-primary uppercase">
                  {tr(stop.where)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
