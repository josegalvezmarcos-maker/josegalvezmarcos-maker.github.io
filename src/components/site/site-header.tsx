import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useLanguage } from '@/lib/i18n'
import { LanguageToggle } from './language-toggle'
import { SECTIONS } from './sections'

export function SiteHeader() {
  const { tr } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      <div className="hazard h-1.5" aria-hidden />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
          <a
            href="#inicio"
            className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-9 place-items-center rounded-md bg-primary font-data text-xs font-bold text-primary-foreground">
              JG
            </span>
            <span className="hidden leading-none sm:block">
              <span className="signage block text-[13px]">Pie de campo</span>
              <span className="mt-1 block font-data text-[10px] tracking-widest text-muted-foreground uppercase">
                J. A. Gálvez Marcos
              </span>
            </span>
          </a>

          <nav
            aria-label={tr({ es: 'Secciones', en: 'Sections' })}
            className="hidden items-center gap-1 lg:flex"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-baseline gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <span className="font-data text-[10px] text-primary/70 group-hover:text-primary">
                  {s.code}
                </span>
                {tr(s.label)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button
              asChild
              size="sm"
              className="hidden font-semibold sm:inline-flex"
            >
              <Link to="/app">
                {tr({ es: 'Abrir app', en: 'Open app' })}
                <ArrowUpRight />
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label={tr({ es: 'Abrir menú', en: 'Open menu' })}
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-sidebar p-0">
                <div className="hazard h-1.5" aria-hidden />
                <div className="p-6">
                  <SheetTitle className="signage text-lg">
                    Pie de campo
                  </SheetTitle>
                  <SheetDescription className="mt-1 text-xs">
                    José Antonio Gálvez Marcos
                  </SheetDescription>
                  <nav className="mt-8 space-y-1">
                    {SECTIONS.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-3 rounded-md px-2 py-3 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="font-data text-xs text-primary">
                          {s.code}
                        </span>
                        <span className="signage text-xl">{tr(s.label)}</span>
                      </a>
                    ))}
                  </nav>
                  <Button asChild className="mt-8 w-full font-semibold">
                    <Link to="/app">
                      {tr({ es: 'Abrir app', en: 'Open app' })}
                      <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
