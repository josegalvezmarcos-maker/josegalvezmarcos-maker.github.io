import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, GripVertical, RotateCcw } from 'lucide-react'
import { INITIAL_IDEAS, type Idea } from '@/data/content'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'

type QuadrantId = 'quick' | 'big' | 'fill' | 'avoid'

const QUADRANT_STYLES: Record<QuadrantId, { tone: string; dot: string }> = {
  quick: {
    tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  big: {
    tone: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  fill: {
    tone: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  avoid: {
    tone: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    dot: 'bg-rose-400',
  },
}

// Values 1–2 are "low", 3–5 are "high".
const isHigh = (v: number) => v >= 3

function quadrantOf(idea: Idea): QuadrantId {
  const hi = isHigh(idea.impact)
  const he = isHigh(idea.effort)
  if (hi && !he) return 'quick'
  if (hi && he) return 'big'
  if (!hi && !he) return 'fill'
  return 'avoid'
}

// Map a 1–5 score to a % position so that points never sit on the midline.
function axisPos(v: number) {
  return isHigh(v) ? 50 + ((v - 3 + 0.5) / 3) * 50 : ((v - 1 + 0.5) / 2) * 50
}

const ratio = (i: Idea) => i.impact / i.effort

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        <span className="font-data font-bold text-foreground">{value}</span>
      </span>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-2 w-full"
        style={
          { '--fill': `${((value - 1) / 4) * 100}%` } as React.CSSProperties
        }
      />
    </label>
  )
}

export function IdeaPrioritizer() {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS)
  const [autoSort, setAutoSort] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  // Only the card header arms dragging, so the sliders stay usable.
  const [grabId, setGrabId] = useState<string | null>(null)
  const { tr } = useLanguage()
  const t = useStrings().ideas
  const QUADRANTS = Object.fromEntries(
    (Object.keys(QUADRANT_STYLES) as QuadrantId[]).map((id) => [
      id,
      { ...QUADRANT_STYLES[id], ...t.quadrants[id] },
    ]),
  ) as Record<
    QuadrantId,
    { label: string; hint: string; tone: string; dot: string }
  >

  const ordered = useMemo(
    () =>
      autoSort
        ? [...ideas].sort((a, b) => ratio(b) - ratio(a) || b.impact - a.impact)
        : ideas,
    [ideas, autoSort],
  )

  const setScore = (id: string, key: 'impact' | 'effort', v: number) =>
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: v } : i)))

  // Any manual reorder freezes the current order and disables auto-sort.
  const move = (fromId: string, toIndex: number) => {
    const list = [...ordered]
    const from = list.findIndex((i) => i.id === fromId)
    if (from < 0 || toIndex < 0 || toIndex >= list.length) return
    const [item] = list.splice(from, 1)
    list.splice(toIndex, 0, item)
    setIdeas(list)
    setAutoSort(false)
  }

  const rankOf = (id: string) => ordered.findIndex((i) => i.id === id) + 1

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={autoSort}
              onChange={(e) => setAutoSort(e.target.checked)}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring motion-reduce:transition-none">
              <span
                className={cn(
                  'absolute top-1 left-1 size-4 rounded-full bg-white transition-transform motion-reduce:transition-none',
                  autoSort && 'translate-x-5',
                )}
              />
            </span>
            {t.autoSort}
          </label>
          <button
            type="button"
            onClick={() => {
              setIdeas(INITIAL_IDEAS)
              setAutoSort(true)
            }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
          >
            <RotateCcw className="size-4" />
            {t.reset}
          </button>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">{t.dragHint}</p>

        <ol className="grid gap-3 sm:grid-cols-2">
          {ordered.map((idea, index) => {
            const q = QUADRANTS[quadrantOf(idea)]
            return (
              <li
                key={idea.id}
                draggable={grabId === idea.id}
                onPointerUp={() => setGrabId(null)}
                onDragStart={(e) => {
                  setDragId(idea.id)
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', idea.id)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (overId !== idea.id) setOverId(idea.id)
                }}
                onDragLeave={() => setOverId(null)}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = dragId ?? e.dataTransfer.getData('text/plain')
                  if (id && id !== idea.id) move(id, index)
                  setDragId(null)
                  setOverId(null)
                }}
                onDragEnd={() => {
                  setGrabId(null)
                  setDragId(null)
                  setOverId(null)
                }}
                className={cn(
                  'rounded-2xl border bg-background/40 p-4 transition-all duration-200 motion-reduce:transition-none',
                  dragId === idea.id && 'scale-[0.98] opacity-40',
                  overId === idea.id && dragId !== idea.id
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border',
                )}
              >
                <div
                  className="flex cursor-grab items-start gap-2 active:cursor-grabbing"
                  onPointerDown={(e) => {
                    if (!(e.target as HTMLElement).closest('button'))
                      setGrabId(idea.id)
                  }}
                >
                  <GripVertical
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary font-data text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm leading-snug font-semibold">
                      {tr(idea.title)}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {tr(idea.description)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      aria-label={t.moveUp(tr(idea.title))}
                      disabled={index === 0}
                      onClick={() => move(idea.id, index - 1)}
                      className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={t.moveDown(tr(idea.title))}
                      disabled={index === ordered.length - 1}
                      onClick={() => move(idea.id, index + 1)}
                      className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Slider
                    label={t.impact}
                    value={idea.impact}
                    onChange={(v) => setScore(idea.id, 'impact', v)}
                  />
                  <Slider
                    label={t.effort}
                    value={idea.effort}
                    onChange={(v) => setScore(idea.id, 'effort', v)}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      'rounded-md border px-2 py-0.5 font-medium',
                      q.tone,
                    )}
                  >
                    {q.label}
                  </span>
                  <span className="text-muted-foreground">
                    {t.ratio}{' '}
                    <span className="font-data font-bold text-foreground">
                      {ratio(idea).toFixed(2)}
                    </span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Priority matrix */}
      <div className="xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
          <h4 className="font-display text-sm font-semibold">{t.matrix}</h4>
          <div className="mt-4 flex gap-2">
            <div className="flex w-4 items-center justify-center">
              <span className="-rotate-90 text-[11px] whitespace-nowrap text-muted-foreground">
                {t.impact} →
              </span>
            </div>
            <div className="flex-1">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5">
                  {(['quick', 'big', 'fill', 'avoid'] as QuadrantId[]).map(
                    (qid) => {
                      const q = QUADRANTS[qid]
                      return (
                        <div
                          key={qid}
                          className={cn('rounded-lg border p-2 sm:p-3', q.tone)}
                        >
                          <p className="text-xs font-semibold sm:text-sm">
                            {q.label}
                          </p>
                          <p className="text-[10px] opacity-70 sm:text-[11px]">
                            {q.hint}
                          </p>
                        </div>
                      )
                    },
                  )}
                </div>
                {ordered.map((idea) => {
                  // Nudge points that share a position so they stay readable.
                  const twins = ordered.filter(
                    (o) => o.impact === idea.impact && o.effort === idea.effort,
                  )
                  const k = twins.findIndex((t) => t.id === idea.id)
                  const offset = (k - (twins.length - 1) / 2) * 7
                  const q = QUADRANTS[quadrantOf(idea)]
                  return (
                    <span
                      key={idea.id}
                      title={tr(idea.title)}
                      className={cn(
                        'absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-data text-xs font-bold text-slate-900 shadow-lg ring-2 ring-background transition-all duration-500 motion-reduce:transition-none',
                        q.dot,
                      )}
                      style={{
                        left: `calc(${axisPos(idea.effort)}% + ${offset}px)`,
                        top: `calc(${100 - axisPos(idea.impact)}% + ${offset}px)`,
                      }}
                    >
                      {rankOf(idea.id)}
                    </span>
                  )
                })}
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                {t.effort} →
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs">
            {ordered.map((idea, i) => (
              <li key={idea.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    QUADRANTS[quadrantOf(idea)].dot,
                  )}
                />
                <span className="font-data text-muted-foreground">
                  {i + 1}.
                </span>
                <span className="truncate">{tr(idea.title)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
