import { Link } from '@tanstack/react-router'
import { ArrowUpRight, BookOpen, Code2 } from 'lucide-react'
import { BLOG_URL, LINKEDIN_URL, REPO_URL } from '@/data/content'
import { useLanguage } from '@/lib/i18n'
import { LinkedInIcon } from './linkedin-icon'

export function SiteFooter() {
  const { tr } = useLanguage()
  return (
    <footer className="relative overflow-hidden bg-sidebar">
      <div className="hazard h-3" aria-hidden />
      <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <Link
          to="/app"
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="font-data text-xs tracking-widest text-primary uppercase">
            {tr({ es: 'Fin del recorrido', en: 'End of the route' })}
          </p>
          <p className="signage mt-4 text-[15vw] transition-colors group-hover:text-primary sm:text-8xl lg:text-9xl motion-reduce:transition-none">
            {tr({ es: 'Abre', en: 'Start' })}
            <br />
            <span className="outline-text group-hover:[-webkit-text-stroke-color:var(--primary)]">
              {tr({ es: 'el turno', en: 'the shift' })}
            </span>
            <ArrowUpRight className="ml-3 inline size-[0.6em] align-baseline transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 motion-reduce:transition-none" />
          </p>
        </Link>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-bold">José Antonio Gálvez Marcos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tr({
                es: 'Opiniones personales. No representan a ninguna empresa.',
                en: 'Personal opinions. They do not represent any company.',
              })}{' '}
              <Link
                to="/fuentes"
                className="underline underline-offset-2 hover:text-primary"
              >
                {tr({ es: 'Fuentes de los datos', en: 'Data sources' })}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { href: BLOG_URL, label: 'Blog', icon: BookOpen },
              { href: LINKEDIN_URL, label: 'LinkedIn', icon: LinkedInIcon },
              { href: REPO_URL, label: 'GitHub', icon: Code2 },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="grid size-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <l.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
