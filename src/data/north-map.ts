import type { Localized } from '@/lib/i18n'
import type { SectorId } from './sectors'

export interface MapPoint {
  id: string
  name: Localized
  kind: 'port' | 'zone' | 'site'
  lat: number
  lng: number
  text: Localized
  sector?: SectorId
  source?: string
}

// Approximate public locations. Company sites are described by activity only.
export const MAP_POINTS: MapPoint[] = [
  {
    id: 'musel',
    kind: 'port',
    lat: 43.562,
    lng: -5.697,
    name: { es: 'Puerto de El Musel (Gijón)', en: 'El Musel port (Gijón)' },
    text: {
      es: 'Principal puerto de Asturias, con mucho peso de los graneles sólidos.',
      en: 'Asturias’ main port, with a large share of dry bulk.',
    },
    sector: 'tpl',
  },
  {
    id: 'aviles',
    kind: 'port',
    lat: 43.585,
    lng: -5.926,
    name: { es: 'Puerto de Avilés', en: 'Avilés port' },
    text: {
      es: 'Puerto industrial ligado a la metalurgia y a la química de la comarca.',
      en: 'Industrial port tied to the area’s metal and chemical industry.',
    },
    sector: 'tpl',
  },
  {
    id: 'zalia',
    kind: 'zone',
    lat: 43.521,
    lng: -5.79,
    name: {
      es: 'Zalia (zona logística de Asturias)',
      en: 'Zalia (Asturias logistics zone)',
    },
    text: {
      es: 'Primera fase de 700.000 m² netos junto a la A-8, la A-66 y la AS-2.',
      en: 'First phase of 700,000 m² net next to the A-8, A-66 and AS-2.',
    },
    sector: 'tpl',
    source: 'zalia',
  },
  {
    id: 'bobes',
    kind: 'site',
    lat: 43.384,
    lng: -5.748,
    name: { es: 'Bobes (Siero)', en: 'Bobes (Siero)' },
    text: {
      es: 'Centro robotizado de e-commerce con más de 1.000 empleos directos y operación 24 h.',
      en: 'Robotic e-commerce site with over 1,000 direct jobs and 24-hour operation.',
    },
    sector: 'ecom',
    source: 'amazon-ovd1',
  },
  {
    id: 'granda',
    kind: 'site',
    lat: 43.398,
    lng: -5.773,
    name: { es: 'Granda (Siero)', en: 'Granda (Siero)' },
    text: {
      es: 'Fábrica láctea con almacén frigorífico propio. Asturias produjo 518.774 t de leche de vaca en 2024.',
      en: 'Dairy plant with its own cold store. Asturias produced 518,774 t of cow’s milk in 2024.',
    },
    sector: 'frio',
    source: 'upa-anuario-2025',
  },
  {
    id: 'llanera',
    kind: 'site',
    lat: 43.433,
    lng: -5.835,
    name: { es: 'Lugo de Llanera', en: 'Lugo de Llanera' },
    text: {
      es: 'Plataforma de supermercados que sirve a 173 tiendas del noroeste, con más de 120 t de frescos al día.',
      en: 'Supermarket platform serving 173 north-west stores, with over 120 t of fresh produce a day.',
    },
    sector: 'retail',
    source: 'alimerka-cimcorp',
  },
  {
    id: 'vigo',
    kind: 'site',
    lat: 42.212,
    lng: -8.738,
    name: { es: 'Balaídos (Vigo)', en: 'Balaídos (Vigo)' },
    text: {
      es: 'Planta de automoción con más de 500.000 vehículos en 2024 y una red de proveedores en secuencia.',
      en: 'Car plant with over 500,000 vehicles in 2024 and a just-in-sequence supplier network.',
    },
    sector: 'jis',
    source: 'stellantis-vigo-prod',
  },
  {
    id: 'santander',
    kind: 'port',
    lat: 43.441,
    lng: -3.812,
    name: { es: 'Puerto de Santander', en: 'Santander port' },
    text: {
      es: 'Puerta de Cantabria para la carga rodada y los graneles.',
      en: 'Cantabria’s gateway for ro-ro cargo and bulk.',
    },
    sector: 'tpl',
  },
  {
    id: 'leon',
    kind: 'zone',
    lat: 42.598,
    lng: -5.567,
    name: { es: 'León', en: 'León' },
    text: {
      es: 'Nudo entre la Meseta y la cornisa: muchas rutas de distribución del norte pasan por aquí.',
      en: 'Hub between the plateau and the coast: many northern distribution routes pass through here.',
    },
    sector: 'retail',
  },
]
