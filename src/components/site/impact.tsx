import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LINKEDIN_URL } from '@/data/content'
import { useLanguage } from '@/lib/i18n'

export function Impact() {
  const { tr } = useLanguage()
  const results = [
    {
      value: '−40 %',
      label: tr({ es: 'errores logísticos', en: 'logistics errors' }),
      how: tr({
        es: 'Con un sistema de trazabilidad y etiquetado implantado desde cero.',
        en: 'With a traceability and labelling system built from scratch.',
      }),
    },
    {
      value: '−30 %',
      label: tr({ es: 'tiempo de entrega', en: 'delivery time' }),
      how: tr({
        es: 'Rediseñando la recepción y la preparación de pedidos.',
        en: 'By redesigning receiving and order picking.',
      }),
    },
    {
      value: '15',
      label: tr({ es: 'personas a cargo', en: 'people led' }),
      how: tr({
        es: 'Entre logística, tienda y e-commerce, con manuales y formación propios.',
        en: 'Across logistics, shop and e-commerce, with in-house manuals and training.',
      }),
    },
    {
      value: '+1',
      label: tr({ es: 'ruta comercial nueva', en: 'new sales route' }),
      how: tr({
        es: 'Abierta en León: más clientes y facturación fuera de la comunidad.',
        en: 'Opened in León: more customers and revenue beyond the region.',
      }),
    },
  ]
  const skills = [
    tr({
      es: 'Planificación de turnos por volumen y corte',
      en: 'Shift planning by volume and cutoff',
    }),
    tr({
      es: 'Productividad sin quemar al equipo',
      en: 'Productivity without burning out the team',
    }),
    tr({
      es: 'Calidad, trazabilidad y seguridad alimentaria',
      en: 'Quality, traceability and food safety',
    }),
    tr({
      es: 'Formación de incorporaciones y campañas',
      en: 'Onboarding and peak-season ramp-up',
    }),
    tr({
      es: 'KPIs: OTIF, exactitud, UPH, mermas',
      en: 'KPIs: OTIF, accuracy, UPH, write-offs',
    }),
    tr({
      es: 'Mejora continua y resolución de incidencias',
      en: 'Continuous improvement and issue resolution',
    }),
  ]

  return (
    <section
      id="aporto"
      className="relative scroll-mt-20 overflow-hidden border-b border-border/60 bg-primary py-24 text-primary-foreground"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <p className="font-data text-xs tracking-widest uppercase opacity-70">
          A05 · {tr({ es: 'Lo que aporto', en: 'What I bring' })}
        </p>
        <h2 className="signage mt-5 max-w-4xl text-4xl sm:text-6xl">
          {tr({
            es: 'Resultados medidos, no promesas',
            en: 'Measured results, not promises',
          })}
        </h2>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-primary-foreground/20 bg-primary-foreground/20 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r) => (
            <li key={r.label} className="bg-primary p-6">
              <p className="signage text-5xl">{r.value}</p>
              <p className="mt-2 font-display font-bold">{r.label}</p>
              <p className="mt-2 text-sm opacity-75">{r.how}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {skills.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3 text-sm font-medium"
              >
                <span className="mt-1.5 size-2 shrink-0 rotate-45 bg-primary-foreground" />
                {s}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-primary-foreground p-6 text-primary">
            <p className="font-display text-lg font-bold">
              {tr({
                es: '¿Diriges una operación en el norte?',
                en: 'Running an operation in the north?',
              })}
            </p>
            <p className="mt-1.5 text-sm text-primary/80">
              {tr({
                es: 'Hablemos de tu almacén, tus cortes o tus KPIs.',
                en: 'Let’s talk about your warehouse, your cutoffs or your KPIs.',
              })}
            </p>
            <Button
              asChild
              className="mt-4 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                {tr({
                  es: 'Escríbeme en LinkedIn',
                  en: 'Message me on LinkedIn',
                })}
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
