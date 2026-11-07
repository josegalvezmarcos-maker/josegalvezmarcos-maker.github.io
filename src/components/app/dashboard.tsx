import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHECKLIST_ITEMS } from '@/data/content'
import {
  parseLocations,
  optimiseRoute,
  planCutoffs,
  planShift,
  tourLength,
  trackPace,
} from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { useWorkspace } from '@/lib/workspace'
import { FeedbackDialog } from './feedback-dialog'
import { NAV, GROUP_LABELS, type NavItem } from './nav'
import { Stat, loadTone, numberFormat } from './primitives'

export function Dashboard() {
  const { tr, lang } = useLanguage()
  const { workspace } = useWorkspace()
  const fmt = numberFormat(lang)

  const summary = useMemo(() => {
    const s = workspace.shift
    const plan = planShift(s.zones, s)
    const pace = trackPace(plan.totalDemand, s.hours, s.logged)
    const cut = planCutoffs(
      workspace.cutoffs.waves,
      workspace.cutoffs.start,
      workspace.cutoffs.rate,
    )
    const r = workspace.route
    const layout = {
      aisles: r.aisles,
      bays: r.bays,
      aisleGap: r.aisleGap,
      bayLength: r.bayLength,
    }
    const { picks } = parseLocations(r.list, layout)
    const list = tourLength(picks, layout)
    const best = tourLength(optimiseRoute(picks, layout), layout)
    return { plan, pace, cut, list, best }
  }, [workspace])

  const openIncidents = workspace.handover.incidents.filter(
    (i) => !i.done,
  ).length
  const checks = workspace.handover.checks.length
  const groups: NavItem['group'][] = ['north', 'plan', 'improve', 'learn']

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="signage text-3xl leading-[0.95] sm:text-4xl">
            {tr({ es: 'Hoy en planta', en: 'Today on the floor' })}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            {tr({
              es: 'Tu resumen se calcula con lo que guardes en cada herramienta. Empieza con los datos de ejemplo y sustitúyelos por los tuyos.',
              en: 'Your summary is calculated from what you save in each tool. Start with the example data and replace it with your own.',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Link
          to="/app/turno"
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Stat
            label={tr({ es: 'Carga del turno', en: 'Shift load' })}
            value={
              Number.isFinite(summary.plan.load)
                ? `${fmt(summary.plan.load * 100)} %`
                : '∞'
            }
            tone={loadTone(summary.plan.load)}
            note={tr({
              es: `${fmt(summary.pace.done)} de ${fmt(summary.plan.totalDemand)} uds.`,
              en: `${fmt(summary.pace.done)} of ${fmt(summary.plan.totalDemand)} units`,
            })}
          />
        </Link>
        <Link
          to="/app/cortes"
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Stat
            label={tr({ es: 'Cortes en riesgo', en: 'Cutoffs at risk' })}
            value={fmt(summary.cut.lateEdd)}
            tone={summary.cut.lateEdd ? 'bad' : 'good'}
            note={tr({
              es: `de ${workspace.cutoffs.waves.length}, con la mejor secuencia`,
              en: `of ${workspace.cutoffs.waves.length}, with the best sequence`,
            })}
          />
        </Link>
        <Link
          to="/app/rutas"
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Stat
            label={tr({ es: 'Metros evitables', en: 'Avoidable metres' })}
            value={`${fmt(summary.list - summary.best)} m`}
            note={tr({ es: 'En el pedido guardado', en: 'In the saved order' })}
          />
        </Link>
        <Link
          to="/app/relevo"
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Stat
            label={tr({ es: 'Incidencias abiertas', en: 'Open incidents' })}
            value={fmt(openIncidents)}
            tone={openIncidents ? 'warn' : 'good'}
            note={tr({
              es: `Checklist ${checks}/${CHECKLIST_ITEMS.length}`,
              en: `Checklist ${checks}/${CHECKLIST_ITEMS.length}`,
            })}
          />
        </Link>
      </div>

      <div className="mt-8 space-y-7">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 font-data text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              {tr(GROUP_LABELS[group])}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {NAV.filter((n) => n.group === group).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <item.icon className="size-5 text-primary" />
                    <span className="mt-3 flex items-center justify-between gap-2 font-display text-sm font-semibold">
                      {tr(item.label)}
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {tr(item.blurb)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold">
            {tr({
              es: '¿Lo usarías en tu almacén?',
              en: 'Would you use this in your warehouse?',
            })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tr({
              es: 'Cuéntame qué falta o qué no encaja con tu operativa.',
              en: 'Tell me what is missing or does not fit your operation.',
            })}
          </p>
        </div>
        <FeedbackDialog
          context="Page: /app"
          trigger={
            <Button>
              <MessageSquarePlus />
              {tr({ es: 'Dar feedback', en: 'Give feedback' })}
            </Button>
          }
        />
      </div>
    </>
  )
}
