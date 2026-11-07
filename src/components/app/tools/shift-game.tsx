import { useMemo, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import {
  EVENTS,
  PLAN_UNITS,
  START,
  applyChoices,
  type GameState,
} from '@/lib/shift-game'
import { cn } from '@/lib/utils'
import { Panel, Stat, ToolHeader, numberFormat, type Tone } from '../primitives'

function tone(key: keyof GameState, s: GameState): Tone {
  if (key === 'overtime')
    return s.overtime === 0 ? 'good' : s.overtime <= 4 ? 'warn' : 'bad'
  if (key === 'units') {
    const done = s.units / PLAN_UNITS
    return done >= 0.97 ? 'good' : done >= 0.9 ? 'warn' : 'bad'
  }
  const v = s[key]
  const [good, warn] =
    key === 'accuracy'
      ? [99.3, 98.5]
      : key === 'otif'
        ? [96, 92]
        : key === 'safety'
          ? [100, 95]
          : [70, 55]
  return v >= good ? 'good' : v >= warn ? 'warn' : 'bad'
}

export function ShiftGame() {
  const { tr, lang } = useLanguage()
  const fmt = numberFormat(lang)
  const fmt1 = numberFormat(lang, 1)
  const [picks, setPicks] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  const state = useMemo(() => applyChoices(picks), [picks])
  const step = picks.length
  const done = step >= EVENTS.length
  const event = EVENTS[step]
  const lastEvent = step > 0 ? EVENTS[step - 1] : null
  const lastChoice = lastEvent?.choices.find((c) => c.id === picks[step - 1])

  const choose = (id: string) => {
    setPicks([...picks, id])
    setRevealed(true)
  }
  const matches = picks.filter((p, i) => EVENTS[i].mine === p).length

  const report = () => {
    const lines = [
      tr({
        es: '*Mi turno en el simulador*',
        en: '*My shift in the simulator*',
      }),
      `${tr({ es: 'Unidades', en: 'Units' })}: ${fmt(state.units)} / ${fmt(PLAN_UNITS)}`,
      `${tr({ es: 'Exactitud', en: 'Accuracy' })}: ${fmt1(state.accuracy)} % · OTIF ${fmt1(state.otif)} %`,
      `${tr({ es: 'Seguridad', en: 'Safety' })}: ${fmt(state.safety)} · ${tr({ es: 'Clima', en: 'Morale' })}: ${fmt(state.morale)} · ${tr({ es: 'Horas extra', en: 'Overtime' })}: ${state.overtime} h`,
      '',
      ...EVENTS.map((e, i) => {
        const c = e.choices.find((x) => x.id === picks[i])
        return `${e.hour}. ${tr(e.title)} → ${c ? tr(c.label) : '—'}`
      }),
    ]
    return lines.join('\n')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report())
      toast.success(tr({ es: 'Resultado copiado', en: 'Result copied' }))
    } catch {
      toast.error(tr({ es: 'No se pudo copiar', en: 'Could not copy' }))
    }
  }

  const stats: { key: keyof GameState; label: string; value: string }[] = [
    {
      key: 'units',
      label: tr({ es: 'Unidades', en: 'Units' }),
      value: `${fmt(state.units)} / ${fmt((PLAN_UNITS * Math.max(step, 1)) / EVENTS.length)}`,
    },
    {
      key: 'accuracy',
      label: tr({ es: 'Exactitud', en: 'Accuracy' }),
      value: `${fmt1(state.accuracy)} %`,
    },
    { key: 'otif', label: 'OTIF', value: `${fmt1(state.otif)} %` },
    {
      key: 'safety',
      label: tr({ es: 'Seguridad', en: 'Safety' }),
      value: fmt(state.safety),
    },
    {
      key: 'morale',
      label: tr({ es: 'Clima del equipo', en: 'Team morale' }),
      value: fmt(state.morale),
    },
    {
      key: 'overtime',
      label: tr({ es: 'Horas extra', en: 'Overtime' }),
      value: `${state.overtime} h`,
    },
  ]

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Tu turno', en: 'Your shift' })}
        description={tr({
          es: 'Ocho horas, ocho situaciones reales de planta y tres opciones en cada una. No hay respuesta perfecta: cada decisión mueve unidades, calidad, servicio, seguridad, clima y coste. Al elegir verás qué haría yo y por qué.',
          en: 'Eight hours, eight real floor situations and three options each. There is no perfect answer: every decision moves units, quality, service, safety, morale and cost. After each choice you will see what I would do and why.',
        })}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPicks([])
              setRevealed(false)
            }}
          >
            <RotateCcw />
            {tr({ es: 'Empezar de nuevo', en: 'Start again' })}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Stat
            key={s.key}
            label={s.label}
            value={s.value}
            tone={
              step === 0 && s.key !== 'overtime'
                ? 'neutral'
                : tone(s.key, state)
            }
          />
        ))}
      </div>

      <ol
        className="my-5 flex gap-1.5"
        aria-label={tr({ es: 'Progreso del turno', en: 'Shift progress' })}
      >
        {EVENTS.map((e, i) => (
          <li
            key={e.hour}
            className={cn(
              'h-2 flex-1 rounded-full',
              i < step
                ? 'bg-primary'
                : i === step
                  ? 'bg-primary/40'
                  : 'bg-input',
            )}
          />
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {!done && event ? (
          <Panel>
            <p className="font-data text-xs tracking-widest text-primary uppercase">
              {tr({
                es: `Hora ${event.hour} de 8`,
                en: `Hour ${event.hour} of 8`,
              })}
            </p>
            <h2 className="signage mt-2 text-2xl sm:text-3xl">
              {tr(event.title)}
            </h2>
            <p className="mt-3 text-muted-foreground">{tr(event.situation)}</p>
            <ul className="mt-6 space-y-2">
              {event.choices.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => choose(c.id)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-border bg-background/60 p-4 text-left transition-colors outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border font-data text-sm font-bold group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium">{tr(c.label)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ) : (
          <Panel>
            <p className="font-data text-xs tracking-widest text-primary uppercase">
              {tr({ es: 'Fin del turno', en: 'End of shift' })}
            </p>
            <h2 className="signage mt-2 text-3xl">
              {tr({ es: 'Tu parte de turno', en: 'Your shift report' })}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {tr({
                es: `Coincides conmigo en ${matches} de ${EVENTS.length} decisiones. Mira dónde has ganado ritmo y qué te ha costado.`,
                en: `You matched me on ${matches} of ${EVENTS.length} decisions. See where you gained pace and what it cost.`,
              })}
            </p>
            <ol className="mt-5 space-y-2 text-sm">
              {EVENTS.map((e, i) => {
                const c = e.choices.find((x) => x.id === picks[i])
                const same = picks[i] === e.mine
                return (
                  <li
                    key={e.hour}
                    className="flex gap-3 rounded-lg bg-background/60 p-3"
                  >
                    <span
                      className={cn(
                        'font-data font-bold',
                        same ? 'text-success' : 'text-warning',
                      )}
                    >
                      {e.hour}
                    </span>
                    <span>
                      <span className="block font-medium">{tr(e.title)}</span>
                      <span className="text-muted-foreground">
                        {c ? tr(c.label) : '—'}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
            <Button className="mt-5" onClick={() => void copy()}>
              <Copy />
              {tr({ es: 'Copiar resultado', en: 'Copy result' })}
            </Button>
          </Panel>
        )}

        <Panel
          title={tr({ es: 'Lo que haría yo', en: 'What I would do' })}
          hint={
            revealed && lastEvent
              ? tr({
                  es: `Hora ${lastEvent.hour}: ${tr(lastEvent.title)}`,
                  en: `Hour ${lastEvent.hour}: ${tr(lastEvent.title)}`,
                })
              : tr({
                  es: 'Elige una opción para ver la explicación.',
                  en: 'Pick an option to see the explanation.',
                })
          }
        >
          {revealed && lastEvent && lastChoice ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">
                  {tr({ es: 'Tu elección', en: 'Your choice' })}
                </p>
                <p className="mt-1 font-medium">{tr(lastChoice.label)}</p>
                <p className="mt-1.5 text-muted-foreground">
                  {tr(lastChoice.why)}
                </p>
              </div>
              {lastChoice.id !== lastEvent.mine && (
                <div className="rounded-lg border border-primary/50 bg-primary/[0.07] p-3">
                  <p className="text-xs text-primary">
                    {tr({ es: 'Yo haría', en: 'I would' })}
                  </p>
                  {(() => {
                    const mine = lastEvent.choices.find(
                      (c) => c.id === lastEvent.mine,
                    )
                    return mine ? (
                      <>
                        <p className="mt-1 font-medium">{tr(mine.label)}</p>
                        <p className="mt-1.5 text-muted-foreground">
                          {tr(mine.why)}
                        </p>
                      </>
                    ) : null
                  })()}
                </div>
              )}
              {lastChoice.id === lastEvent.mine && (
                <p className="text-success">
                  {tr({
                    es: 'Es lo mismo que haría yo.',
                    en: 'That is what I would do too.',
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {tr({
                es: `El turno empieza con ${START.morale} de clima y un plan de ${fmt(PLAN_UNITS)} unidades.`,
                en: `The shift starts with morale at ${START.morale} and a plan of ${fmt(PLAN_UNITS)} units.`,
              })}
            </p>
          )}
        </Panel>
      </div>
    </>
  )
}
