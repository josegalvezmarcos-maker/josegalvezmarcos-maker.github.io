import { Fragment, useState } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHECKLIST_ITEMS } from '@/data/content'
import type { Localized } from '@/lib/i18n'
import { useLanguage } from '@/lib/i18n'
import { Segmented, ToolHeader } from '../primitives'

type TemplateId = 'arranque' | '5s' | 'gemba' | 'incidencias'

function Field({ label }: { label: string }) {
  return (
    <div className="flex items-end gap-2 text-[11px]">
      <span className="shrink-0 font-semibold">{label}</span>
      <span className="mb-0.5 h-px flex-1 bg-neutral-400" />
    </div>
  )
}

function SheetHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { tr } = useLanguage()
  return (
    <header className="mb-5 border-b-4 border-neutral-900 pb-3">
      <div
        className="mb-3 h-2 w-full"
        style={{
          background:
            'repeating-linear-gradient(-45deg,#ffd400 0 8px,#0a0b0d 8px 16px)',
        }}
      />
      <h2
        className="text-2xl font-black tracking-tight uppercase"
        style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '125%' }}
      >
        {title}
      </h2>
      <p className="text-xs text-neutral-600">{subtitle}</p>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <Field label={tr({ es: 'Fecha', en: 'Date' })} />
        <Field label={tr({ es: 'Turno', en: 'Shift' })} />
        <Field label={tr({ es: 'Responsable', en: 'Lead' })} />
      </div>
    </header>
  )
}

const FIVE_S: { s: Localized; items: Localized[] }[] = [
  {
    s: { es: '1 · Clasificar', en: '1 · Sort' },
    items: [
      {
        es: 'No hay material ni herramientas que no se usen en el puesto',
        en: 'No unused material or tools at the station',
      },
      {
        es: 'Palets vacíos y embalajes retirados',
        en: 'Empty pallets and packaging removed',
      },
      {
        es: 'Mercancía bloqueada identificada y apartada',
        en: 'Blocked stock labelled and set apart',
      },
    ],
  },
  {
    s: { es: '2 · Ordenar', en: '2 · Set in order' },
    items: [
      {
        es: 'Cada cosa tiene sitio marcado y está en él',
        en: 'Everything has a marked place and is in it',
      },
      {
        es: 'Pasillos y zonas de paso libres y señalizados',
        en: 'Aisles and walkways clear and marked',
      },
      {
        es: 'Ubicaciones etiquetadas y legibles',
        en: 'Locations labelled and readable',
      },
    ],
  },
  {
    s: { es: '3 · Limpiar', en: '3 · Shine' },
    items: [
      {
        es: 'Suelo sin film, flejes ni derrames',
        en: 'Floor free of film, straps and spills',
      },
      {
        es: 'Terminales, carros y transpaletas limpios y operativos',
        en: 'Scanners, carts and pallet trucks clean and working',
      },
      {
        es: 'Puntos de limpieza con material disponible',
        en: 'Cleaning points stocked',
      },
    ],
  },
  {
    s: { es: '4 · Estandarizar', en: '4 · Standardise' },
    items: [
      {
        es: 'Estándares visibles en el puesto',
        en: 'Standards visible at the station',
      },
      {
        es: 'Todos los turnos trabajan igual',
        en: 'All shifts work the same way',
      },
      {
        es: 'Las anomalías se ven a simple vista',
        en: 'Anomalies are visible at a glance',
      },
    ],
  },
  {
    s: { es: '5 · Mantener', en: '5 · Sustain' },
    items: [
      {
        es: 'La última auditoría tiene acciones cerradas',
        en: 'Last audit actions are closed',
      },
      {
        es: 'El equipo conoce y aplica las 5S',
        en: 'The team knows and applies 5S',
      },
      {
        es: 'Hay responsable y fecha para la próxima',
        en: 'Next audit has an owner and date',
      },
    ],
  },
]

function Arranque() {
  const { tr } = useLanguage()
  return (
    <>
      <SheetHeader
        title={tr({ es: 'Arranque de turno', en: 'Shift start' })}
        subtitle={tr({
          es: 'Rellenar antes de la reunión de inicio. 5 minutos.',
          en: 'Fill in before the start meeting. 5 minutes.',
        })}
      />
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Field label={tr({ es: 'Plantilla prevista', en: 'Planned staff' })} />
        <Field label={tr({ es: 'Presente', en: 'Present' })} />
        <Field label={tr({ es: 'Volumen previsto', en: 'Planned volume' })} />
        <Field label={tr({ es: 'Primer corte', en: 'First cutoff' })} />
        <Field label={tr({ es: 'Segundo corte', en: 'Second cutoff' })} />
        <Field label={tr({ es: 'Objetivo por hora', en: 'Hourly target' })} />
      </div>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-neutral-900 text-white">
            <th className="p-1.5 text-left">
              {tr({ es: 'Punto', en: 'Item' })}
            </th>
            <th className="w-10 p-1.5">OK</th>
            <th className="w-2/5 p-1.5 text-left">
              {tr({ es: 'Observaciones', en: 'Notes' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {CHECKLIST_ITEMS.map((i) => (
            <tr key={i.id} className="border-b border-neutral-300">
              <td className="p-1.5">
                <b>{tr(i.label)}</b>
                <br />
                <span className="text-neutral-600">{tr(i.detail)}</span>
              </td>
              <td className="p-1.5 text-center">☐</td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 space-y-3">
        <Field
          label={tr({
            es: 'Mensaje de seguridad del día',
            en: 'Safety message of the day',
          })}
        />
        <Field
          label={tr({ es: 'Reconocimiento al equipo', en: 'Team recognition' })}
        />
      </div>
    </>
  )
}

function FiveS() {
  const { tr } = useLanguage()
  return (
    <>
      <SheetHeader
        title={tr({ es: 'Auditoría 5S', en: '5S audit' })}
        subtitle={tr({
          es: 'Puntúa de 0 (nada) a 4 (ejemplar). Máximo 60.',
          en: 'Score from 0 (none) to 4 (exemplary). Maximum 60.',
        })}
      />
      <Field label={tr({ es: 'Zona auditada', en: 'Audited area' })} />
      <table className="mt-4 w-full border-collapse text-[11px]">
        <tbody>
          {FIVE_S.map((block) => (
            <Fragment key={block.s.es}>
              <tr className="bg-neutral-900 text-white">
                <th className="p-1.5 text-left" colSpan={6}>
                  {tr(block.s)}
                </th>
              </tr>
              {block.items.map((item) => (
                <tr key={item.es} className="border-b border-neutral-300">
                  <td className="p-1.5">{tr(item)}</td>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <td
                      key={n}
                      className="w-7 p-1.5 text-center text-neutral-500"
                    >
                      {n}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Field label={tr({ es: 'Total', en: 'Total' })} />
        <Field label={tr({ es: 'Próxima auditoría', en: 'Next audit' })} />
      </div>
    </>
  )
}

function Gemba() {
  const { tr } = useLanguage()
  const questions: Localized[] = [
    {
      es: '¿Qué te ha impedido hoy trabajar mejor?',
      en: 'What stopped you working better today?',
    },
    {
      es: '¿Dónde se espera, se busca o se camina de más?',
      en: 'Where do people wait, search or walk too much?',
    },
    {
      es: '¿Qué error se repite y en qué paso nace?',
      en: 'Which error repeats and at which step does it start?',
    },
    {
      es: '¿Hay algún riesgo que nadie ha reportado?',
      en: 'Is there any risk nobody has reported?',
    },
    {
      es: '¿Qué cambiarías tú si fuera tu nave?',
      en: 'What would you change if it were your warehouse?',
    },
  ]
  return (
    <>
      <SheetHeader
        title={tr({
          es: 'Recorrido por planta (gemba walk)',
          en: 'Gemba walk',
        })}
        subtitle={tr({
          es: 'Ir, ver, preguntar y escuchar. Sin juzgar ni resolver en el momento.',
          en: 'Go, see, ask and listen. No judging or fixing on the spot.',
        })}
      />
      <Field label={tr({ es: 'Zonas recorridas', en: 'Areas walked' })} />
      <ol className="mt-4 space-y-3 text-[11px]">
        {questions.map((q, i) => (
          <li key={q.es}>
            <b>
              {i + 1}. {tr(q)}
            </b>
            <div className="mt-4 h-px bg-neutral-300" />
            <div className="mt-4 h-px bg-neutral-300" />
          </li>
        ))}
      </ol>
      <table className="mt-5 w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-neutral-900 text-white">
            <th className="p-1.5 text-left">
              {tr({ es: 'Acción', en: 'Action' })}
            </th>
            <th className="w-1/5 p-1.5 text-left">
              {tr({ es: 'Quién', en: 'Who' })}
            </th>
            <th className="w-1/6 p-1.5 text-left">
              {tr({ es: 'Cuándo', en: 'When' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((n) => (
            <tr key={n} className="h-8 border-b border-neutral-300">
              <td />
              <td />
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function Incidencias() {
  const { tr } = useLanguage()
  const cols = [
    tr({ es: 'Hora', en: 'Time' }),
    tr({ es: 'Zona', en: 'Area' }),
    tr({ es: 'Qué ha pasado', en: 'What happened' }),
    tr({ es: 'Gravedad', en: 'Severity' }),
    tr({ es: 'Acción', en: 'Action' }),
    tr({ es: 'Responsable', en: 'Owner' }),
    tr({ es: 'Cerrada', en: 'Closed' }),
  ]
  return (
    <>
      <SheetHeader
        title={tr({ es: 'Parte de incidencias', en: 'Incident log' })}
        subtitle={tr({
          es: 'Sin datos personales. Gravedad: B baja, M media, A alta.',
          en: 'No personal data. Severity: L low, M medium, H high.',
        })}
      />
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-neutral-900 text-white">
            {cols.map((c) => (
              <th key={c} className="p-1.5 text-left">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 14 }, (_, n) => (
            <tr key={n} className="h-8 border-b border-neutral-300">
              {cols.map((c) => (
                <td key={c} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const SHEETS: Record<TemplateId, () => React.ReactNode> = {
  arranque: Arranque,
  '5s': FiveS,
  gemba: Gemba,
  incidencias: Incidencias,
}

export function Templates() {
  const { tr } = useLanguage()
  const [id, setId] = useState<TemplateId>('arranque')
  const Sheet = SHEETS[id]
  return (
    <>
      <div className="print:hidden">
        <ToolHeader
          title={tr({ es: 'Plantillas', en: 'Templates' })}
          description={tr({
            es: 'Hojas listas para imprimir o guardar en PDF desde el navegador. Úsalas tal cual o como punto de partida.',
            en: 'Sheets ready to print or save as PDF from the browser. Use them as they are or as a starting point.',
          })}
          actions={
            <Button size="sm" onClick={() => window.print()}>
              <Printer />
              {tr({ es: 'Imprimir o guardar PDF', en: 'Print or save PDF' })}
            </Button>
          }
        />
        <div className="mb-5">
          <Segmented
            label={tr({ es: 'Plantilla', en: 'Template' })}
            value={id}
            options={[
              {
                value: 'arranque',
                label: tr({ es: 'Arranque de turno', en: 'Shift start' }),
              },
              {
                value: '5s',
                label: tr({ es: 'Auditoría 5S', en: '5S audit' }),
              },
              {
                value: 'gemba',
                label: tr({ es: 'Gemba walk', en: 'Gemba walk' }),
              },
              {
                value: 'incidencias',
                label: tr({ es: 'Incidencias', en: 'Incidents' }),
              },
            ]}
            onChange={setId}
          />
        </div>
      </div>
      <article className="print-sheet mx-auto max-w-[794px] bg-white p-10 text-neutral-900 shadow-2xl">
        <Sheet />
        <footer className="mt-8 border-t border-neutral-300 pt-2 text-[9px] text-neutral-500">
          Pie de campo · josegalvezmarcos-maker.github.io
        </footer>
      </article>
    </>
  )
}
