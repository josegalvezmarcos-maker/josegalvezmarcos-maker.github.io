import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { NAV } from '@/components/app/nav'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ToolsSection() {
  const { tr } = useLanguage()
  const tools = NAV.filter((n) => n.group !== 'learn')

  return (
    <section
      id="herramientas"
      className="scroll-mt-20 border-b border-border/60 py-24"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-data text-xs tracking-widest text-primary uppercase">
              A03 · {tr({ es: 'Herramientas', en: 'Tools' })}
            </p>
            <h2 className="signage mt-5 text-4xl sm:text-6xl">
              {tr({ es: 'Seis puestos', en: 'Six stations' })}
              <br />
              <span className="outline-text">
                {tr({ es: 'de trabajo', en: 'to work at' })}
              </span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            {tr({
              es: 'A pantalla completa, con tus datos guardados y un enlace para compartir el plan con quien releva.',
              en: 'Full screen, with your data saved and a link to share the plan with whoever takes over.',
            })}
          </p>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {tools.map((item, i) => (
            <li
              key={item.to}
              className={cn(i < 2 ? 'lg:col-span-3' : 'lg:col-span-2')}
            >
              <Link
                to={item.to}
                className={cn(
                  'group relative flex h-full min-h-52 flex-col overflow-hidden rounded-xl border p-6 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                  i === 0
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/70',
                )}
              >
                <span
                  className={cn(
                    'font-data text-xs',
                    i === 0 ? 'text-primary-foreground/70' : 'text-primary',
                  )}
                >
                  {`T${String(i + 1).padStart(2, '0')}`}
                </span>
                <item.icon
                  className={cn(
                    'absolute top-6 right-6 size-7',
                    i === 0
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-primary',
                  )}
                />
                <span className="signage mt-auto pt-10 text-2xl">
                  {tr(item.label)}
                </span>
                <span
                  className={cn(
                    'mt-2 max-w-sm text-sm leading-relaxed',
                    i === 0
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground',
                  )}
                >
                  {tr(item.blurb)}
                </span>
                <ArrowUpRight className="absolute right-6 bottom-6 size-5 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
