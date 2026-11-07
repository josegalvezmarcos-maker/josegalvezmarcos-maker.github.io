import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { SECTORS } from '@/data/sectors'
import { useLanguage } from '@/lib/i18n'

export function NorthSection() {
  const { tr } = useLanguage()
  return (
    <section
      id="norte"
      className="relative scroll-mt-20 overflow-hidden border-b border-border/60 py-24"
    >
      <div className="floor-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-data text-xs tracking-widest text-primary uppercase">
              A03 · {tr({ es: 'Casos del norte', en: 'Northern cases' })}
            </p>
            <h2 className="signage mt-5 text-4xl sm:text-6xl">
              {tr({ es: 'Cinco formas', en: 'Five ways' })}
              <br />
              <span className="outline-text">
                {tr({ es: 'de mover el norte', en: 'the north moves goods' })}
              </span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            {tr({
              es: 'Operaciones habituales entre Asturias, Galicia, Cantabria y León, con datos públicos de la región, un escenario jugable y sus KPIs.',
              en: 'Common operations across Asturias, Galicia, Cantabria and León, with public regional data, a playable scenario and its KPIs.',
            })}
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-5">
          {SECTORS.map((s) => (
            <li key={s.id} className="bg-background">
              <Link
                to="/app/casos"
                className="group flex h-full flex-col p-6 outline-none hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <span className="font-data text-xs text-primary">{s.code}</span>
                <span className="mt-4 font-display text-lg leading-tight font-bold">
                  {tr(s.name)}
                </span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tr(s.pressure)}
                </span>
                <span className="mt-4 block border-t border-border pt-3">
                  <span className="font-data text-xl font-bold text-primary">
                    {s.facts[0].value}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {tr(s.facts[0].label)}
                  </span>
                </span>
                <span className="mt-5 flex flex-wrap gap-1">
                  {s.kpis.slice(0, 3).map((k) => (
                    <span
                      key={k.id}
                      className="rounded border border-border px-1.5 py-0.5 font-data text-[10px] text-muted-foreground"
                    >
                      {tr(k.label)}
                    </span>
                  ))}
                </span>
                <ArrowUpRight className="mt-4 size-5 text-muted-foreground transition-colors group-hover:text-primary motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
