import { useMemo, useState } from 'react'
import { Archive, Check, Copy, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CHECKLIST_ITEMS } from '@/data/content'
import { planShift, trackPace } from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useWorkspace, type Workspace } from '@/lib/workspace'
import { Panel, Segmented, ToolHeader, numberFormat } from '../primitives'

type Severity = Workspace['handover']['incidents'][number]['severity']

export function Handover() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const h = workspace.handover
  const fmt = numberFormat(lang)
  const [draft, setDraft] = useState('')
  const [owner, setOwner] = useState('')
  const [severity, setSeverity] = useState<Severity>('medium')

  const patch = (next: Partial<typeof h>) =>
    update((w) => ({ ...w, handover: { ...w.handover, ...next } }))

  const severities: { value: Severity; label: string }[] = [
    { value: 'low', label: tr({ es: 'Baja', en: 'Low' }) },
    { value: 'medium', label: tr({ es: 'Media', en: 'Medium' }) },
    { value: 'high', label: tr({ es: 'Alta', en: 'High' }) },
  ]
  const severityLabel = (s: Severity) =>
    severities.find((x) => x.value === s)?.label ?? s

  const done = CHECKLIST_ITEMS.filter((i) => h.checks.includes(i.id))
  const progress = (done.length / CHECKLIST_ITEMS.length) * 100
  const open = h.incidents.filter((i) => !i.done)

  const report = useMemo(() => {
    const s = workspace.shift
    const plan = planShift(s.zones, s)
    const pace = trackPace(plan.totalDemand, s.hours, s.logged)
    const missing = CHECKLIST_ITEMS.filter((i) => !h.checks.includes(i.id))
    const lines = [
      tr({ es: '*PARTE DE RELEVO*', en: '*SHIFT HANDOVER*' }),
      '',
      tr({
        es: `Volumen: ${fmt(pace.done)} hechas de ${fmt(plan.totalDemand)} (${pace.hoursLogged} h registradas)`,
        en: `Volume: ${fmt(pace.done)} done of ${fmt(plan.totalDemand)} (${pace.hoursLogged} h logged)`,
      }),
      tr({
        es: `Pendiente: ${fmt(Math.max(0, plan.totalDemand - pace.done))} uds.`,
        en: `Pending: ${fmt(Math.max(0, plan.totalDemand - pace.done))} units`,
      }),
      '',
      tr({
        es: `Incidencias abiertas (${open.length}):`,
        en: `Open incidents (${open.length}):`,
      }),
      ...(open.length
        ? open.map(
            (i) =>
              `- [${severityLabel(i.severity)}] ${i.time} ${i.note}${i.owner ? ` → ${i.owner}` : ''}`,
          )
        : [tr({ es: '- Ninguna', en: '- None' })]),
      '',
      tr({ es: 'Sin confirmar al arrancar:', en: 'Not confirmed at start:' }),
      ...(missing.length
        ? missing.map((i) => `- ${tr(i.label)}`)
        : [tr({ es: '- Todo confirmado', en: '- All confirmed' })]),
    ]
    if (h.notes.trim()) {
      lines.push('', tr({ es: 'Notas:', en: 'Notes:' }), h.notes.trim())
    }
    return lines.join('\n')
    // severityLabel only depends on the language, already tracked through tr.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.shift, h.checks, h.notes, open.length, h.incidents, tr, lang])

  const addIncident = () => {
    if (!draft.trim()) return
    const now = new Date()
    patch({
      incidents: [
        {
          id: crypto.randomUUID(),
          time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          severity,
          note: draft.trim(),
          owner: owner.trim(),
          done: false,
        },
        ...h.incidents,
      ].slice(0, 100),
    })
    setDraft('')
    setOwner('')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report)
      toast.success(tr({ es: 'Parte copiado', en: 'Handover copied' }))
    } catch {
      toast.error(tr({ es: 'No se pudo copiar', en: 'Could not copy' }))
    }
  }

  const archiveShift = () => {
    patch({
      archive: [
        {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          summary: report,
        },
        ...h.archive,
      ].slice(0, 60),
      checks: [],
      incidents: open,
      notes: '',
    })
    update((w) => ({
      ...w,
      shift: { ...w.shift, logged: [] },
    }))
    toast.success(
      tr({
        es: 'Turno archivado. Las incidencias abiertas siguen en la lista.',
        en: 'Shift archived. Open incidents stay on the list.',
      }),
    )
  }

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Arranque y relevo', en: 'Start & handover' })}
        description={tr({
          es: 'Empieza con el checklist, registra incidencias durante el turno y deja el parte listo para pegar en el chat del equipo. Toma el volumen del plan de turno. No registres datos personales.',
          en: 'Start with the checklist, log incidents during the shift and leave the note ready to paste in the team chat. Volume comes from the shift plan. Do not log personal data.',
        })}
        actions={
          <Button size="sm" variant="outline" onClick={archiveShift}>
            <Archive />
            {tr({ es: 'Archivar turno', en: 'Archive shift' })}
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title={tr({ es: 'Checklist de arranque', en: 'Start checklist' })}
          hint={tr({
            es: `${done.length} de ${CHECKLIST_ITEMS.length} confirmados`,
            en: `${done.length} of ${CHECKLIST_ITEMS.length} confirmed`,
          })}
        >
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-input">
            <div
              className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ul className="space-y-1.5">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = h.checks.includes(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={checked}
                    onClick={() =>
                      patch({
                        checks: checked
                          ? h.checks.filter((c) => c !== item.id)
                          : [...h.checks, item.id],
                      })
                    }
                    className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid size-5 shrink-0 place-items-center rounded border',
                        checked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input',
                      )}
                    >
                      {checked && <Check className="size-3.5" />}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {tr(item.label)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {tr(item.detail)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel
          title={tr({ es: 'Incidencias', en: 'Incidents' })}
          hint={tr({
            es: `${open.length} abiertas`,
            en: `${open.length} open`,
          })}
        >
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              addIncident()
            }}
          >
            <textarea
              value={draft}
              maxLength={500}
              rows={2}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={tr({
                es: '¿Qué ha pasado?',
                en: 'What happened?',
              })}
              aria-label={tr({ es: 'Incidencia', en: 'Incident' })}
              className="w-full resize-y rounded-md border border-input bg-background/60 p-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Segmented
                label={tr({ es: 'Prioridad', en: 'Priority' })}
                value={severity}
                options={severities}
                onChange={setSeverity}
              />
              <input
                value={owner}
                maxLength={60}
                onChange={(e) => setOwner(e.target.value)}
                placeholder={tr({ es: 'Área o rol', en: 'Area or role' })}
                aria-label={tr({ es: 'Responsable', en: 'Owner' })}
                className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background/60 px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim()}
                aria-label={tr({ es: 'Añadir', en: 'Add' })}
              >
                <Plus />
              </Button>
            </div>
          </form>
          <ul className="mt-4 space-y-2">
            {h.incidents.length === 0 && (
              <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                {tr({ es: 'Sin incidencias.', en: 'No incidents.' })}
              </li>
            )}
            {h.incidents.map((i) => (
              <li
                key={i.id}
                className={cn(
                  'flex items-start gap-2 rounded-lg bg-background/60 p-2.5',
                  i.done && 'opacity-55',
                )}
              >
                <button
                  type="button"
                  aria-pressed={i.done}
                  aria-label={tr({
                    es: 'Marcar resuelta',
                    en: 'Mark resolved',
                  })}
                  onClick={() =>
                    patch({
                      incidents: h.incidents.map((x) =>
                        x.id === i.id ? { ...x, done: !x.done } : x,
                      ),
                    })
                  }
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    i.done
                      ? 'border-success bg-success text-background'
                      : 'border-input',
                  )}
                >
                  {i.done && <Check className="size-3" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm', i.done && 'line-through')}>
                    {i.note}
                  </p>
                  <p className="mt-0.5 font-data text-[11px] text-muted-foreground">
                    {i.time} · {severityLabel(i.severity)}
                    {i.owner && ` · ${i.owner}`}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={tr({ es: 'Eliminar', en: 'Delete' })}
                  onClick={() =>
                    patch({
                      incidents: h.incidents.filter((x) => x.id !== i.id),
                    })
                  }
                  className="rounded p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="min-w-0 space-y-4">
          <Panel
            title={tr({ es: 'Parte de relevo', en: 'Handover note' })}
            action={
              <Button size="sm" onClick={() => void copy()}>
                <Copy />
                {tr({ es: 'Copiar', en: 'Copy' })}
              </Button>
            }
          >
            <textarea
              value={h.notes}
              maxLength={3000}
              rows={2}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder={tr({
                es: 'Notas para el siguiente turno…',
                en: 'Notes for the next shift…',
              })}
              aria-label={tr({ es: 'Notas', en: 'Notes' })}
              className="mb-3 w-full resize-y rounded-md border border-input bg-background/60 p-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <pre className="max-h-80 overflow-y-auto rounded-lg bg-background/60 p-3 font-data text-xs leading-relaxed whitespace-pre-wrap">
              {report}
            </pre>
          </Panel>
          <Panel
            title={tr({ es: 'Turnos archivados', en: 'Archived shifts' })}
            hint={tr({
              es: `${h.archive.length} guardados en este navegador`,
              en: `${h.archive.length} saved in this browser`,
            })}
          >
            {h.archive.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tr({
                  es: 'Al archivar un turno, su parte queda aquí.',
                  en: 'When you archive a shift, its note stays here.',
                })}
              </p>
            ) : (
              <ul className="space-y-1.5">
                {h.archive.slice(0, 8).map((a) => (
                  <li key={a.id}>
                    <details className="rounded-lg bg-background/60 p-2.5 text-sm">
                      <summary className="cursor-pointer font-data text-xs">
                        {new Date(a.savedAt).toLocaleString(
                          lang === 'en' ? 'en-GB' : 'es-ES',
                        )}
                      </summary>
                      <pre className="mt-2 font-data text-xs whitespace-pre-wrap text-muted-foreground">
                        {a.summary}
                      </pre>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
