import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SECTIONS } from './sections'

// A picker's route down the page: the line fills as you scroll and each
// section is a stop on it.
export function ScrollRail() {
  const { tr } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
        let current = SECTIONS[0].id
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id)
          if (
            el &&
            el.getBoundingClientRect().top < window.innerHeight * 0.45
          ) {
            current = s.id
          }
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <nav
      aria-label={tr({ es: 'Recorrido de la página', en: 'Page route' })}
      className="fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative h-[52vh] w-6">
        <span className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <span
          className="absolute top-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-primary"
          style={{ height: `${progress * 100}%` }}
        />
        {SECTIONS.map((s, i) => {
          const at = (i / (SECTIONS.length - 1)) * 100
          const isActive = s.id === active
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={isActive ? 'location' : undefined}
              className="group absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center outline-none"
              style={{ top: `${at}%` }}
            >
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-sm border font-data text-[8px] font-bold transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring motion-reduce:transition-none',
                  progress * 100 >= at - 0.5
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {s.code.slice(1)}
              </span>
              <span
                className={cn(
                  'absolute left-8 hidden font-data text-[10px] 2xl:block tracking-widest whitespace-nowrap uppercase transition-opacity motion-reduce:transition-none',
                  isActive
                    ? 'text-foreground opacity-100'
                    : 'text-muted-foreground opacity-0 group-hover:opacity-100',
                )}
              >
                {tr(s.label)}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
