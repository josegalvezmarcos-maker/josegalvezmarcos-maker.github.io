import { Link } from '@tanstack/react-router'
import { ArrowRight, Calculator, HardDrive, Share2 } from 'lucide-react'
import { GROUP_LABELS, NAV, type NavItem } from '@/components/app/nav'
import { useLanguage } from '@/lib/i18n'
import { SectionHeading } from './section-heading'

export function ToolsSection() {
  const { tr } = useLanguage()
  const groups: NavItem['group'][] = ['plan', 'improve']

  const facts = [
    {
      icon: Calculator,
      title: tr({
        es: 'Cálculos que puedes comprobar',
        en: 'Calculations you can check',
      }),
      text: tr({
        es: 'Cada herramienta explica su modelo y sus límites. Son apoyo a la decisión, no sustituyen a tu WMS.',
        en: 'Each tool explains its model and its limits. They support decisions and do not replace your WMS.',
      }),
    },
    {
      icon: HardDrive,
      title: tr({
        es: 'Tus datos, en tu navegador',
        en: 'Your data, in your browser',
      }),
      text: tr({
        es: 'Sin cuentas ni servidores propios. Se guarda en este dispositivo y puedes descargar una copia.',
        en: 'No accounts or servers of our own. It is saved on this device and you can download a copy.',
      }),
    },
    {
      icon: Share2,
      title: tr({
        es: 'Comparte el plan con un enlace',
        en: 'Share the plan with a link',
      }),
      text: tr({
        es: 'El plan viaja dentro del propio enlace. Quien lo abre decide si lo carga.',
        en: 'The plan travels inside the link itself. Whoever opens it decides whether to load it.',
      }),
    },
  ]

  return (
    <section id="herramientas" className="border-t border-border/60 py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          eyebrow={tr({ es: 'Espacio de trabajo', en: 'Workspace' })}
          title={tr({
            es: 'Pensadas para usarlas durante el turno',
            en: 'Built to be used during the shift',
          })}
          description={tr({
            es: 'Cada una ocupa toda la pantalla y parte de un artículo del blog o de un problema habitual en planta.',
            en: 'Each one takes the full screen and starts from a blog article or a common floor problem.',
          })}
        />

        <div className="mt-10 space-y-8">
          {groups.map((group) => (
            <div key={group}>
              <h3 className="mb-3 font-data text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
                {tr(GROUP_LABELS[group])}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {NAV.filter((n) => n.group === group).map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                    >
                      <item.icon className="size-6 text-primary" />
                      <span className="mt-4 font-display font-semibold">
                        {tr(item.label)}
                      </span>
                      <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {tr(item.blurb)}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        {tr({ es: 'Abrir', en: 'Open' })}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="mt-12 grid gap-6 border-t border-border/60 pt-10 md:grid-cols-3">
          {facts.map((f) => (
            <li key={f.title} className="flex gap-3">
              <f.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-display text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {f.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
