import { useCallback, useSyncExternalStore } from 'react'
import { z } from 'zod'

const STORAGE_KEY = 'apc-workspace'
export const MAX_SHARE_LENGTH = 30000

const text = (max: number) => z.string().max(max)
const num = (min: number, max: number) => z.number().min(min).max(max)

const shiftSchema = z.object({
  hours: num(1, 16),
  breakMin: num(0, 180),
  absenteeism: num(0, 100),
  margin: num(0, 90),
  zones: z
    .array(
      z.object({
        id: text(40),
        name: text(60),
        demand: num(0, 10000000),
        rate: num(0, 100000),
        workers: num(0, 2000),
      }),
    )
    .max(30),
  logged: z.array(z.number().min(0).max(10000000).nullable()).max(16),
})

const routeSchema = z.object({
  aisles: num(2, 30),
  bays: num(4, 40),
  aisleGap: num(1, 20),
  bayLength: num(0.5, 10),
  speed: num(0.1, 3),
  ordersPerShift: num(1, 2000),
  list: text(6000),
  seed: z.number().int(),
})

const slottingSchema = z.object({
  csv: text(60000),
  aisles: num(2, 30),
  bays: num(4, 40),
  thresholdA: num(50, 95),
  thresholdB: num(60, 99),
})

const cutoffsSchema = z.object({
  start: text(5),
  rate: num(1, 1000000),
  waves: z
    .array(
      z.object({
        id: text(40),
        name: text(60),
        units: num(0, 10000000),
        cutoff: text(5),
      }),
    )
    .max(40),
})

const incidentSchema = z.object({
  id: text(40),
  time: text(5),
  severity: z.enum(['low', 'medium', 'high']),
  note: text(500),
  owner: text(60),
  done: z.boolean(),
})

const handoverSchema = z.object({
  checks: z.array(text(40)).max(40),
  incidents: z.array(incidentSchema).max(100),
  notes: text(3000),
  archive: z
    .array(
      z.object({
        id: text(40),
        savedAt: text(40),
        summary: text(6000),
      }),
    )
    .max(60),
})

const ideasSchema = z.object({
  autoSort: z.boolean(),
  items: z
    .array(z.object({ id: text(40), impact: num(1, 5), effort: num(1, 5) }))
    .max(40),
})

const workspaceSchema = z.object({
  version: z.literal(1),
  shift: shiftSchema,
  route: routeSchema,
  slotting: slottingSchema,
  cutoffs: cutoffsSchema,
  handover: handoverSchema,
  ideas: ideasSchema,
})

export type Workspace = z.infer<typeof workspaceSchema>
export type ShareableTool = 'shift' | 'route' | 'slotting' | 'cutoffs'

const shareSchemas = {
  shift: shiftSchema,
  route: routeSchema,
  slotting: slottingSchema,
  cutoffs: cutoffsSchema,
} as const

function demoCsv(): string {
  const names = [
    'Tornillería M6',
    'Bridas 200 mm',
    'Guantes T9',
    'Cinta embalaje',
    'Film 500 mm',
    'Etiquetas 100x150',
    'Cajas S',
    'Cajas M',
    'Cajas L',
    'Pilas AA',
    'Cúter',
    'Rotulador',
    'Palet EUR',
    'Fleje PP',
    'Grapas 15',
    'Bolsa 40x60',
    'Sobre burbuja',
    'Spray marcaje',
    'Mascarilla',
    'Gafas EPI',
    'Tapón oído',
    'Chaleco HV',
    'Precinto',
    'Etiqueta frágil',
    'Papel kraft',
    'Espuma 2 mm',
    'Bobina térmica',
    'Lector correa',
    'Pinza palet',
    'Rodillo',
  ]
  const lines = names.map((name, i) => {
    const zipf = Math.round(9000 / (((i * 7) % names.length) + 1))
    return `${name},${zipf}`
  })
  return lines.join('\n')
}

export const DEFAULT_WORKSPACE: Workspace = {
  version: 1,
  shift: {
    hours: 8,
    breakMin: 30,
    absenteeism: 6,
    margin: 10,
    zones: [
      {
        id: 'z1',
        name: 'Pick alta rotación',
        demand: 14000,
        rate: 110,
        workers: 18,
      },
      {
        id: 'z2',
        name: 'Pick media rotación',
        demand: 6200,
        rate: 80,
        workers: 14,
      },
      { id: 'z3', name: 'Voluminoso', demand: 1400, rate: 45, workers: 6 },
    ],
    logged: [2300, 2500, 2450],
  },
  route: {
    aisles: 12,
    bays: 24,
    aisleGap: 3.5,
    bayLength: 1.4,
    speed: 1.2,
    ordersPerShift: 60,
    list: 'A02-05, A11-20, A03-18, A07-02, A09-14, A01-22, A05-09, A12-03, A04-16, A08-21, A06-07, A10-11, A02-19, A07-23',
    seed: 4,
  },
  slotting: {
    csv: demoCsv(),
    aisles: 12,
    bays: 24,
    thresholdA: 80,
    thresholdB: 95,
  },
  cutoffs: {
    start: '06:00',
    rate: 2600,
    waves: [
      { id: 'w1', name: 'Regional norte', units: 5200, cutoff: '13:00' },
      { id: 'w2', name: 'Exprés mañana', units: 3800, cutoff: '09:00' },
      { id: 'w3', name: 'Nacional', units: 7400, cutoff: '14:00' },
      { id: 'w4', name: 'Tienda', units: 2100, cutoff: '11:00' },
    ],
  },
  handover: { checks: [], incidents: [], notes: '', archive: [] },
  ideas: { autoSort: true, items: [] },
}

const listeners = new Set<() => void>()
let cache: Workspace | null = null
let persisted = true

function read(): Workspace {
  if (cache) return cache
  let loaded = DEFAULT_WORKSPACE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = workspaceSchema.safeParse(JSON.parse(raw))
      if (parsed.success) loaded = parsed.data
      else localStorage.setItem(`${STORAGE_KEY}-unreadable`, raw)
    }
  } catch {
    persisted = false
  }
  cache = loaded
  return loaded
}

function write(next: Workspace) {
  cache = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    persisted = true
  } catch {
    persisted = false
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useWorkspace() {
  const workspace = useSyncExternalStore(
    subscribe,
    read,
    () => DEFAULT_WORKSPACE,
  )
  const isPersisted = useSyncExternalStore(
    subscribe,
    () => persisted,
    () => true,
  )
  const update = useCallback((patch: (w: Workspace) => Workspace) => {
    write(patch(read()))
  }, [])
  return { workspace, update, isPersisted }
}

export function resetWorkspace() {
  write(DEFAULT_WORKSPACE)
}

export function exportWorkspace(): string {
  return JSON.stringify(read(), null, 2)
}

export function importWorkspace(json: string): boolean {
  try {
    const parsed = workspaceSchema.safeParse(JSON.parse(json))
    if (!parsed.success) return false
    write(parsed.data)
    return true
  } catch {
    return false
  }
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const bin = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

export function buildShareHash(tool: ShareableTool): string | null {
  const hash = `#d=${tool}.${toBase64Url(JSON.stringify(read()[tool]))}`
  return hash.length > MAX_SHARE_LENGTH ? null : hash
}

export interface SharedPayload {
  tool: ShareableTool
  apply: () => void
}

export function readShareHash(hash: string): SharedPayload | 'invalid' | null {
  const m = /^#d=(shift|route|slotting|cutoffs)\.([\w-]+)$/.exec(hash)
  if (!m) return hash.startsWith('#d=') ? 'invalid' : null
  if (hash.length > MAX_SHARE_LENGTH) return 'invalid'
  const tool = m[1] as ShareableTool
  try {
    const parsed = shareSchemas[tool].safeParse(JSON.parse(fromBase64Url(m[2])))
    if (!parsed.success) return 'invalid'
    return {
      tool,
      apply: () => write({ ...read(), [tool]: parsed.data }),
    }
  } catch {
    return 'invalid'
  }
}
