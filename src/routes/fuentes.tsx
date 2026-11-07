import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { SOURCES, SOURCE_KIND_LABEL, type SourceKind } from '@/data/sources'
import { useLanguage } from '@/lib/i18n'

export const Route = createFileRoute('/fuentes')({
  component: SourcesPage,
})

const ORDER: SourceKind[] = ['open-data', 'official', 'press-release', 'press']

function SourcesPage() {
  const { tr } = useLanguage()
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <p className="font-data text-xs tracking-widest text-primary uppercase">
          {tr({ es: 'Anexo', en: 'Appendix' })}
        </p>
        <h1 className="signage mt-4 text-5xl sm:text-7xl">
          {tr({ es: 'Fuentes', en: 'Sources' })}
        </h1>
        <div className="mt-6 grid max-w-3xl gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            {tr({
              es: 'Cada cifra pública de la web enlaza aquí. Solo se toman datos, nunca textos, y siempre con su fuente y fecha. Las estadísticas del INE se reutilizan bajo licencia CC BY 4.0; el resto son estadísticas oficiales publicadas, notas de prensa y prensa especializada de acceso público.',
              en: 'Every public figure on the site links here. Only facts are taken, never text, always with source and date. INE statistics are reused under CC BY 4.0; the rest are published official statistics, press releases and publicly available trade press.',
            })}
          </p>
          <p>
            {tr({
              es: 'Los escenarios y tableros usan datos de ejemplo inventados para enseñar el método; no reflejan resultados de ninguna empresa. Las descripciones de cada tipo de operación se basan en estas fuentes y en experiencia propia, sin información interna de ninguna compañía.',
              en: 'Scenarios and boards use made-up example data to show the method; they do not reflect any company’s results. Descriptions of each type of operation are based on these sources and personal experience, with no internal information from any company.',
            })}
          </p>
        </div>

        {ORDER.map((kind) => {
          const list = SOURCES.filter((s) => s.kind === kind)
          if (!list.length) return null
          return (
            <section key={kind} className="mt-14">
              <h2 className="font-data text-xs tracking-widest text-primary uppercase">
                {tr(SOURCE_KIND_LABEL[kind])}
              </h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {list.map((s) => (
                  <li
                    key={s.id}
                    className="grid gap-2 py-5 md:grid-cols-[1fr_1.2fr] md:gap-8"
                  >
                    <div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 font-display font-bold hover:text-primary"
                      >
                        {s.title}
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                      </a>
                      <p className="mt-1 font-data text-[11px] text-muted-foreground">
                        {s.publisher} · {s.date}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tr(s.usedFor)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </main>
      <SiteFooter />
    </div>
  )
}
