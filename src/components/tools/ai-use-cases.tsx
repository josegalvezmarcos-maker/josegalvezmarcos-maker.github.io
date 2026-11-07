import { useState } from 'react'
import {
  Activity,
  Bot,
  Eye,
  Mic,
  Route as RouteIcon,
  ScanSearch,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import {
  AI_USE_CASES,
  MATURITY_LABELS,
  OBJECTIVE_LABELS,
  OBJECTIVES,
  type AiUseCase,
  type Objective,
} from '@/data/content'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'

const ICONS: Record<AiUseCase['icon'], LucideIcon> = {
  trending: TrendingUp,
  route: RouteIcon,
  wrench: Wrench,
  eye: Eye,
  mic: Mic,
  bot: Bot,
  activity: Activity,
  search: ScanSearch,
}

const OBJECTIVE_COLORS: Record<Objective, string> = {
  Eficiencia: 'text-blue-300 bg-blue-500/15',
  Seguridad: 'text-amber-300 bg-amber-500/15',
  Calidad: 'text-emerald-300 bg-emerald-500/15',
  Coste: 'text-violet-300 bg-violet-500/15',
}

const MATURITY_DOTS: Record<AiUseCase['maturity'], number> = {
  Consolidado: 3,
  'En expansión': 2,
  Emergente: 1,
}

export function AiUseCases() {
  const [filter, setFilter] = useState<Objective | 'Todos'>('Todos')
  const { tr } = useLanguage()
  const t = useStrings().ai
  const visible =
    filter === 'Todos'
      ? AI_USE_CASES
      : AI_USE_CASES.filter((c) => c.objectives.includes(filter))

  const options: (Objective | 'Todos')[] = ['Todos', ...OBJECTIVES]

  return (
    <div>
      <div
        role="group"
        aria-label={t.filterLabel}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const count =
            opt === 'Todos'
              ? AI_USE_CASES.length
              : AI_USE_CASES.filter((c) => c.objectives.includes(opt)).length
          const active = filter === opt
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(opt)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {opt === 'Todos' ? t.all : tr(OBJECTIVE_LABELS[opt])}
              <span
                className={cn(
                  'rounded-full px-1.5 font-data text-[11px]',
                  active ? 'bg-white/20' : 'bg-muted',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {t.shown(visible.length)}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((c) => {
          const Icon = ICONS[c.icon]
          return (
            <li
              key={c.id}
              className="group flex animate-in flex-col rounded-2xl border border-border bg-background/40 p-5 transition-colors duration-300 fade-in-0 zoom-in-95 hover:border-primary/50 motion-reduce:animate-none"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none">
                  <Icon className="size-5" />
                </span>
                <span
                  className="flex gap-1"
                  title={t.maturity(tr(MATURITY_LABELS[c.maturity]))}
                  aria-label={t.maturity(tr(MATURITY_LABELS[c.maturity]))}
                >
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={cn(
                        'size-1.5 rounded-full',
                        n <= MATURITY_DOTS[c.maturity]
                          ? 'bg-primary'
                          : 'bg-input',
                      )}
                    />
                  ))}
                </span>
              </div>
              <h4 className="mt-4 font-display font-semibold">{tr(c.title)}</h4>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tr(c.description)}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.objectives.map((o) => (
                  <span
                    key={o}
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium',
                      OBJECTIVE_COLORS[o],
                      filter === o && 'ring-1 ring-current',
                    )}
                  >
                    {tr(OBJECTIVE_LABELS[o])}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {tr(MATURITY_LABELS[c.maturity])}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
