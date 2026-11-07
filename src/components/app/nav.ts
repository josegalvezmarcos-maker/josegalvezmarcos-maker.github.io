import {
  BookOpen,
  ChartColumn,
  Euro,
  FileText,
  Gamepad2,
  Map as MapIcon,
  MapPinned,
  ClipboardList,
  Compass,
  Gauge,
  Grid3x3,
  LayoutDashboard,
  Library,
  Lightbulb,
  Route as RouteIcon,
  Sparkles,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import type { Localized } from '@/lib/i18n'

export interface NavItem {
  to:
    | '/app'
    | '/app/casos'
    | '/app/kpis'
    | '/app/simulador'
    | '/app/mapa'
    | '/app/coste'
    | '/app/plantillas'
    | '/app/turno'
    | '/app/rutas'
    | '/app/slotting'
    | '/app/cortes'
    | '/app/relevo'
    | '/app/ideas'
    | '/app/ia'
    | '/app/sectores'
    | '/app/blog'
    | '/fuentes'
  icon: LucideIcon
  label: Localized
  blurb: Localized
  group: 'north' | 'plan' | 'improve' | 'learn'
}

export const NAV: NavItem[] = [
  {
    to: '/app/casos',
    icon: MapPinned,
    group: 'north',
    label: { es: 'Casos del norte', en: 'Northern cases' },
    blurb: {
      es: 'Frío, e-commerce, supermercados, automoción y multicliente: escenarios jugables.',
      en: 'Cold chain, e-commerce, supermarkets, automotive and multi-client: playable scenarios.',
    },
  },
  {
    to: '/app/simulador',
    icon: Gamepad2,
    group: 'north',
    label: { es: 'Tu turno (simulador)', en: 'Your shift (simulator)' },
    blurb: {
      es: 'Ocho horas, ocho decisiones reales de planta y su efecto en los KPIs.',
      en: 'Eight hours, eight real floor decisions and their effect on KPIs.',
    },
  },
  {
    to: '/app/mapa',
    icon: MapIcon,
    group: 'north',
    label: { es: 'Mapa del norte', en: 'Northern map' },
    blurb: {
      es: 'Puertos, zonas logísticas y operaciones de referencia, con su fuente.',
      en: 'Ports, logistics zones and reference operations, with sources.',
    },
  },
  {
    to: '/app/kpis',
    icon: ChartColumn,
    group: 'north',
    label: { es: 'Tablero de KPIs', en: 'KPI board' },
    blurb: {
      es: 'Los indicadores de cada tipo de operación, con fórmula, objetivo y tendencia.',
      en: 'Each operation type’s indicators, with formula, target and trend.',
    },
  },
  {
    to: '/app/turno',
    icon: Gauge,
    group: 'plan',
    label: { es: 'Plan de turno', en: 'Shift plan' },
    blurb: {
      es: 'Carga por zona, reparto de personas y ritmo real frente al plan.',
      en: 'Load by zone, staff allocation and actual pace against plan.',
    },
  },
  {
    to: '/app/rutas',
    icon: RouteIcon,
    group: 'plan',
    label: { es: 'Rutas de picking', en: 'Pick routes' },
    blurb: {
      es: 'Pega una lista y compara el recorrido por orden, S-shape u optimizado.',
      en: 'Paste a list and compare list order, S-shape and optimised walks.',
    },
  },
  {
    to: '/app/cortes',
    icon: Timer,
    group: 'plan',
    label: { es: 'Cortes de salida', en: 'Cutoffs' },
    blurb: {
      es: 'Secuencia las olas, detecta retrasos y calcula el ritmo mínimo.',
      en: 'Sequence waves, spot late ones and find the minimum rate.',
    },
  },
  {
    to: '/app/relevo',
    icon: ClipboardList,
    group: 'plan',
    label: { es: 'Arranque y relevo', en: 'Start & handover' },
    blurb: {
      es: 'Checklist, incidencias y parte de relevo listo para enviar.',
      en: 'Checklist, incidents and a handover note ready to send.',
    },
  },
  {
    to: '/app/slotting',
    icon: Grid3x3,
    group: 'improve',
    label: { es: 'Slotting ABC', en: 'ABC slotting' },
    blurb: {
      es: 'Analiza la rotación y propone qué referencias acercar primero.',
      en: 'Analyses turnover and proposes which SKUs to move closer first.',
    },
  },
  {
    to: '/app/coste',
    icon: Euro,
    group: 'improve',
    label: { es: 'Coste de la ineficiencia', en: 'Cost of inefficiency' },
    blurb: {
      es: 'Metros, errores y mermas convertidos en euros al año.',
      en: 'Metres, errors and write-offs turned into euros a year.',
    },
  },
  {
    to: '/app/plantillas',
    icon: FileText,
    group: 'improve',
    label: { es: 'Plantillas', en: 'Templates' },
    blurb: {
      es: 'Arranque de turno, auditoría 5S, gemba walk e incidencias, listas para imprimir.',
      en: 'Shift start, 5S audit, gemba walk and incidents, ready to print.',
    },
  },
  {
    to: '/app/ideas',
    icon: Lightbulb,
    group: 'improve',
    label: { es: 'Priorizador', en: 'Prioritizer' },
    blurb: {
      es: 'Puntúa mejoras por impacto y esfuerzo en una matriz.',
      en: 'Score improvements by impact and effort on a matrix.',
    },
  },
  {
    to: '/app/ia',
    icon: Sparkles,
    group: 'learn',
    label: { es: 'Casos de IA', en: 'AI cases' },
    blurb: {
      es: 'Dónde aplica la IA en el almacén, filtrado por objetivo.',
      en: 'Where AI applies in the warehouse, filtered by goal.',
    },
  },
  {
    to: '/app/sectores',
    icon: Compass,
    group: 'learn',
    label: { es: 'Otros sectores', en: 'Other sectors' },
    blurb: {
      es: 'Principios del pick trasladados a otros sectores.',
      en: 'Pick principles carried over to other sectors.',
    },
  },
  {
    to: '/app/blog',
    icon: BookOpen,
    group: 'learn',
    label: { es: 'Blog', en: 'Blog' },
    blurb: {
      es: 'Los artículos, sin salir del espacio de trabajo.',
      en: 'The articles, without leaving the workspace.',
    },
  },
]

NAV.push({
  to: '/fuentes',
  icon: Library,
  group: 'learn',
  label: { es: 'Fuentes', en: 'Sources' },
  blurb: {
    es: 'De dónde sale cada dato público y con qué licencia.',
    en: 'Where each public figure comes from and under which licence.',
  },
})

export const HOME_ITEM = {
  to: '/app' as const,
  icon: LayoutDashboard,
  label: { es: 'Hoy', en: 'Today' },
}

export const GROUP_LABELS: Record<NavItem['group'], Localized> = {
  north: { es: 'Norte de España', en: 'Northern Spain' },
  plan: { es: 'Operar el turno', en: 'Run the shift' },
  improve: { es: 'Mejorar', en: 'Improve' },
  learn: { es: 'Aprender', en: 'Learn' },
}
