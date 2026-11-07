import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { BLOG_URL, LINKEDIN_URL } from '@/data/content'
import { useStrings } from '@/data/ui-strings'
import { LinkedInIcon } from './linkedin-icon'
import { LanguageToggle } from './language-toggle'

export function SiteHeader() {
  const t = useStrings().header
  const { tr } = useLanguage()
  const nav = [
    { href: '#blog', label: t.nav.blog },
    { href: '#herramientas', label: t.nav.tools },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#inicio"
          className="flex items-center gap-2.5 rounded-md font-display text-sm font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-data text-xs font-bold text-primary-foreground">
            JG
          </span>
          <span className="hidden md:inline">{t.brand}</span>
        </a>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground motion-reduce:transition-none"
            >
              {item.label}
            </a>
          ))}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.openBlog}
            className="ml-1 hidden size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:grid motion-reduce:transition-none"
          >
            <BookOpen className="size-4" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.linkedin}
            className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground motion-reduce:transition-none"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <LanguageToggle />
          <Button asChild size="sm" className="ml-2 hidden sm:inline-flex">
            <Link to="/app">{tr({ es: 'Abrir app', en: 'Open app' })}</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
