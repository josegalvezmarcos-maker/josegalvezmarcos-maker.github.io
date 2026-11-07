import { useState } from 'react'
import {
  BedDouble,
  GraduationCap,
  HardHat,
  Headset,
  Hospital,
  Package,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { SECTORS, type Sector } from '@/data/content'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'

const ICONS: Record<Sector['icon'], LucideIcon> = {
  hotel: BedDouble,
  hospital: Hospital,
  store: ShoppingBag,
  hardhat: HardHat,
  school: GraduationCap,
  headset: Headset,
}

export function SectorMap() {
  const [activeId, setActiveId] = useState(SECTORS[0].id)
  const { tr } = useLanguage()
  const t = useStrings().sectors
  const active = SECTORS.find((s) => s.id === activeId) ?? SECTORS[0]
  const ActiveIcon = ICONS[active.icon]

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div
        role="tablist"
        aria-label={t.tabsLabel}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 lg:self-start"
      >
        {SECTORS.map((s) => {
          const Icon = ICONS[s.icon]
          const selected = s.id === activeId
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`sector-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="sector-panel"
              onClick={() => setActiveId(s.id)}
              className={cn(
                'flex flex-col items-start gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                selected
                  ? 'border-primary bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgb(59_130_246/0.7)]'
                  : 'border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              <Icon className="size-5" />
              {tr(s.name)}
            </button>
          )
        })}
      </div>

      <div
        id="sector-panel"
        role="tabpanel"
        aria-labelledby={`sector-tab-${active.id}`}
        className="rounded-2xl border border-border bg-background/50 p-5 sm:p-6"
      >
        {/* Map header: logistics → sector */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            <Package className="size-4 text-primary" />
            {t.origin}
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-border to-primary" />
          <span
            key={active.id}
            className="inline-flex animate-in items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground fade-in-0 motion-reduce:animate-none"
          >
            <ActiveIcon className="size-4" />
            {tr(active.name)}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {tr(active.summary)}
        </p>

        <ol key={active.id} className="relative mt-6 space-y-4">
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-4 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />
          {active.principles.map((p, i) => (
            <li
              key={p.title.es}
              className="relative flex animate-in gap-4 fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-primary bg-background font-data text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="flex-1 rounded-xl border border-border bg-card p-4">
                <h4 className="font-display font-semibold">{tr(p.title)}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {tr(p.explanation)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
