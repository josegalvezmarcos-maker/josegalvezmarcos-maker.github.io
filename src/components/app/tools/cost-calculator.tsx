import { useMemo, useState } from 'react'
import { optimiseRoute, parseLocations, tourLength } from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { useWorkspace } from '@/lib/workspace'
import {
  NumberField,
  Panel,
  SliderField,
  Stat,
  ToolHeader,
  numberFormat,
} from '../primitives'

export function CostCalculator() {
  const { tr, lang } = useLanguage()
  const { workspace } = useWorkspace()
  const fmt = numberFormat(lang)

  const avoidable = useMemo(() => {
    const r = workspace.route
    const layout = {
      aisles: r.aisles,
      bays: r.bays,
      aisleGap: r.aisleGap,
      bayLength: r.bayLength,
    }
    const { picks } = parseLocations(r.list, layout)
    return Math.round(
      tourLength(picks, layout) -
        tourLength(optimiseRoute(picks, layout), layout),
    )
  }, [workspace.route])

  const [hourCost, setHourCost] = useState(20)
  const [days, setDays] = useState(250)
  const [metres, setMetres] = useState(avoidable > 0 ? avoidable : 150)
  const [orders, setOrders] = useState(600)
  const [speed, setSpeed] = useState(1.2)
  const [lines, setLines] = useState(8000)
  const [errorsPerThousand, setErrorsPerThousand] = useState(3)
  const [errorCost, setErrorCost] = useState(25)
  const [wasteUnits, setWasteUnits] = useState(300)
  const [unitCost, setUnitCost] = useState(2.5)
  const [recover, setRecover] = useState(50)

  const rows = [
    {
      key: 'walk',
      label: tr({ es: 'Recorridos de más', en: 'Extra walking' }),
      note: tr({
        es: `${fmt((metres * orders) / 1000)} km al día`,
        en: `${fmt((metres * orders) / 1000)} km a day`,
      }),
      value: ((metres * orders) / speed / 3600) * hourCost * days,
    },
    {
      key: 'errors',
      label: tr({ es: 'Errores de preparación', en: 'Picking errors' }),
      note: tr({
        es: `${fmt((lines * errorsPerThousand) / 1000)} errores al día`,
        en: `${fmt((lines * errorsPerThousand) / 1000)} errors a day`,
      }),
      value: ((lines * errorsPerThousand) / 1000) * errorCost * days,
    },
    {
      key: 'waste',
      label: tr({ es: 'Merma por caducidad', en: 'Expiry write-off' }),
      note: tr({
        es: `${fmt(wasteUnits)} uds. a la semana`,
        en: `${fmt(wasteUnits)} units a week`,
      }),
      value: wasteUnits * unitCost * 52,
    },
  ]
  const total = rows.reduce((t, r) => t + r.value, 0)
  const max = Math.max(...rows.map((r) => r.value), 1)

  return (
    <>
      <ToolHeader
        title={tr({
          es: 'Lo que cuesta la ineficiencia',
          en: 'The cost of inefficiency',
        })}
        description={tr({
          es: 'Traduce metros, errores y mermas a euros al año. Todos los valores son tuyos: los de partida son ejemplos. Los metros evitables se toman del pedido guardado en Rutas de picking.',
          en: 'Turns metres, errors and write-offs into euros a year. All values are yours: the starting ones are examples. Avoidable metres come from the order saved in Pick routes.',
        })}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={tr({ es: 'Coste anual', en: 'Annual cost' })}
          value={`${fmt(total)} €`}
          tone={total > 0 ? 'bad' : 'good'}
        />
        <Stat
          label={tr({
            es: `Si recuperas el ${recover} %`,
            en: `If you recover ${recover}%`,
          })}
          value={`${fmt((total * recover) / 100)} €`}
          tone="good"
          note={tr({ es: 'Al año', en: 'A year' })}
        />
        <Stat
          label={tr({ es: 'Equivale a', en: 'Equivalent to' })}
          value={`${fmt(total / hourCost / 1700)}`}
          note={tr({
            es: 'personas a jornada completa (1.700 h/año)',
            en: 'full-time people (1,700 h/year)',
          })}
        />
        <Stat
          label={tr({ es: 'Por día trabajado', en: 'Per working day' })}
          value={`${fmt(total / days)} €`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Panel
          title={tr({
            es: 'Dónde se va el dinero',
            en: 'Where the money goes',
          })}
        >
          <ul className="space-y-4">
            {rows.map((r) => (
              <li key={r.key}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{r.label}</span>
                  <span className="font-data font-bold">{fmt(r.value)} €</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-input">
                  <div
                    className="h-full rounded-full bg-[var(--chart-actual)]"
                    style={{ width: `${(r.value / max) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <SliderField
              label={tr({
                es: 'Parte que te propones recuperar',
                en: 'Share you aim to recover',
              })}
              value={recover}
              min={10}
              max={100}
              step={5}
              format={(v) => `${v} %`}
              onChange={setRecover}
            />
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title={tr({ es: 'General', en: 'General' })}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={tr({
                  es: 'Coste por hora de una persona',
                  en: 'Cost per person-hour',
                })}
                value={hourCost}
                min={1}
                max={200}
                step={0.5}
                suffix="€"
                onChange={setHourCost}
              />
              <NumberField
                label={tr({
                  es: 'Días trabajados al año',
                  en: 'Working days a year',
                })}
                value={days}
                min={1}
                max={365}
                onChange={setDays}
              />
            </div>
          </Panel>
          <Panel title={tr({ es: 'Recorridos', en: 'Walking' })}>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label={tr({
                  es: 'Metros evitables por pedido',
                  en: 'Avoidable metres per order',
                })}
                value={metres}
                min={0}
                max={10000}
                onChange={setMetres}
              />
              <NumberField
                label={tr({ es: 'Pedidos al día', en: 'Orders a day' })}
                value={orders}
                min={0}
                max={1000000}
                onChange={setOrders}
              />
              <NumberField
                label={tr({ es: 'Velocidad', en: 'Speed' })}
                value={speed}
                min={0.1}
                max={3}
                step={0.1}
                suffix="m/s"
                onChange={setSpeed}
              />
            </div>
          </Panel>
          <Panel title={tr({ es: 'Errores', en: 'Errors' })}>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label={tr({ es: 'Líneas al día', en: 'Lines a day' })}
                value={lines}
                min={0}
                max={10000000}
                onChange={setLines}
              />
              <NumberField
                label={tr({
                  es: 'Errores por mil líneas',
                  en: 'Errors per thousand lines',
                })}
                value={errorsPerThousand}
                min={0}
                max={1000}
                step={0.1}
                onChange={setErrorsPerThousand}
              />
              <NumberField
                label={tr({
                  es: 'Coste de cada error',
                  en: 'Cost of each error',
                })}
                value={errorCost}
                min={0}
                max={10000}
                suffix="€"
                onChange={setErrorCost}
              />
            </div>
          </Panel>
          <Panel title={tr({ es: 'Merma', en: 'Write-off' })}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={tr({
                  es: 'Unidades caducadas por semana',
                  en: 'Expired units a week',
                })}
                value={wasteUnits}
                min={0}
                max={10000000}
                onChange={setWasteUnits}
              />
              <NumberField
                label={tr({ es: 'Coste por unidad', en: 'Cost per unit' })}
                value={unitCost}
                min={0}
                max={10000}
                step={0.1}
                suffix="€"
                onChange={setUnitCost}
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
