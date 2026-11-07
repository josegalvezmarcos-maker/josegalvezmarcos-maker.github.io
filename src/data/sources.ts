import type { Localized } from '@/lib/i18n'

export type SourceKind = 'open-data' | 'official' | 'press-release' | 'press'

export interface Source {
  id: string
  title: string
  publisher: string
  date: string
  url: string
  kind: SourceKind
  usedFor: Localized
}

export const SOURCE_KIND_LABEL: Record<SourceKind, Localized> = {
  'open-data': {
    es: 'Dato abierto (CC BY 4.0)',
    en: 'Open data (CC BY 4.0)',
  },
  official: {
    es: 'Estadística oficial publicada',
    en: 'Published official statistics',
  },
  'press-release': { es: 'Nota de prensa', en: 'Press release' },
  press: { es: 'Prensa especializada', en: 'Trade press' },
}

// Only facts are taken from these sources, never their text, and every figure
// on the site links back here.
export const SOURCES: Source[] = [
  {
    id: 'dirce-asturias',
    title: 'Resultados Directorio Central de Empresas (DIRCE) – Asturias',
    publisher: 'INE, nota de FADE',
    date: '2025-12-11',
    url: 'https://fade.es/wp-content/uploads/2025/12/Nota-DIRCE.pdf',
    kind: 'open-data',
    usedFor: {
      es: '64.608 empresas activas en Asturias a 1 de enero de 2025.',
      en: '64,608 active companies in Asturias on 1 January 2025.',
    },
  },
  {
    id: 'upa-anuario-2025',
    title: 'Anuario 2025 · Informe socioeconómico por comunidades autónomas',
    publisher: 'Fundación de Estudios Rurales (UPA), con datos del MAPA',
    date: '2025',
    url: 'https://www.upa.es/Anuario2025/informe-socieconomico-ccaa-4.pdf',
    kind: 'official',
    usedFor: {
      es: 'Leche de vaca en Asturias 2024: 518.774 t, 92 % entregada a la industria regional, 1.175 ganaderos.',
      en: 'Cow’s milk in Asturias 2024: 518,774 t, 92% delivered to regional industry, 1,175 farmers.',
    },
  },
  {
    id: 'mapa-coyuntura-lacteo',
    title: 'Informes de coyuntura del sector vacuno de leche',
    publisher: 'Ministerio de Agricultura, Pesca y Alimentación',
    date: '2025',
    url: 'https://www.mapa.gob.es/es/ganaderia/estadisticas/',
    kind: 'official',
    usedFor: {
      es: 'Serie mensual de entregas de leche por comunidad, para seguir la estacionalidad.',
      en: 'Monthly milk deliveries by region, to follow seasonality.',
    },
  },
  {
    id: 'amazon-ovd1',
    title: 'El centro logístico de Amazon en Asturias celebra su primer año',
    publisher: 'Amazon (sala de prensa)',
    date: '2025-09-02',
    url: 'https://press.aboutamazon.com/es/noticias/noticias-de-la-compania/2025/9/centro-logistico-amazon-asturias-celebra-primer-ano',
    kind: 'press-release',
    usedFor: {
      es: 'Más de 1.000 empleos directos, más de 60 perfiles distintos y operación 24 horas en un centro de Siero.',
      en: 'Over 1,000 direct jobs, over 60 distinct roles and 24-hour operation at a site in Siero.',
    },
  },
  {
    id: 'amazon-anuncio',
    title:
      'Amazon creará más de 1.500 nuevos empleos con un centro logístico robotizado en Siero',
    publisher: 'Amazon (sala de prensa)',
    date: '2024-03',
    url: 'https://press.aboutamazon.com/es/noticias/noticias-de-la-compania/2024/3/amazon-creara-mas-de-1500-nuevos-empleos-con-la-apertura-de-un-nuevo-centro-logistico-robotizado-en-siero-asturias',
    kind: 'press-release',
    usedFor: {
      es: 'Centro robotizado con objetivo de 1.500 empleos.',
      en: 'Robotic site targeting 1,500 jobs.',
    },
  },
  {
    id: 'alimerka-cimcorp',
    title: 'Alimerka automates produce distribution with Cimcorp',
    publisher: 'Fruitnet · Eurofruit',
    date: '2020-08-25',
    url: 'https://www.fruitnet.com/eurofruit/alimerka-automates-produce-distribution-with-cimcorp/182730.article',
    kind: 'press',
    usedFor: {
      es: 'Plataforma de Lugo de Llanera: 173 tiendas del noroeste y más de 120 t de frescos al día, seis días por semana.',
      en: 'Lugo de Llanera platform: 173 north-west stores and over 120 t of fresh produce a day, six days a week.',
    },
  },
  {
    id: 'alimerka-frio',
    title: 'Alimerka amplía su capacidad logística para frío negativo',
    publisher: 'Alimarket',
    date: '2022',
    url: 'https://www.alimarket.es/logistica/noticia_amp/349334/alimerka-amplia-su-capacidad-logistica-para-frio-negativo',
    kind: 'press',
    usedFor: {
      es: 'Inversión en frío y flota eléctrica con puntos de carga en la plataforma.',
      en: 'Investment in frozen storage and an electric fleet with charging at the platform.',
    },
  },
  {
    id: 'clas-frio-granda',
    title: 'Central Lechera Asturiana estrena un almacén de frío en Granda',
    publisher: 'Alimarket',
    date: '—',
    url: 'https://www.alimarket.es/logistica/noticia_amp/366763/central-lechera-asturiana-estrena-un-almacen-de-frio-en-granda',
    kind: 'press',
    usedFor: {
      es: 'Almacén frigorífico propio junto a la fábrica láctea de Granda (Siero).',
      en: 'Own cold store next to the Granda (Siero) dairy plant.',
    },
  },
  {
    id: 'stellantis-vigo-prod',
    title: 'Stellantis Vigo busca 300 nuevos trabajadores',
    publisher: 'Autofácil',
    date: '2025',
    url: 'https://www.autofacil.es/oferta-de-empleo-stellantis-vigo-busca-300-nuevos-trabajadores/',
    kind: 'press',
    usedFor: {
      es: 'Más de 500.000 vehículos fabricados en Vigo en 2024 (516.000 según esta fuente).',
      en: 'Over 500,000 vehicles built in Vigo in 2024 (516,000 according to this source).',
    },
  },
  {
    id: 'stellantis-xunta',
    title:
      'Stellantis Spain collaborates with Galicia government for 2025–2027 plan',
    publisher: 'MarkLines',
    date: '2025',
    url: 'https://www.marklines.com/en/news/326218',
    kind: 'press',
    usedFor: {
      es: 'Plan 2025–2027 con la Xunta centrado en la red de proveedores locales.',
      en: '2025–2027 plan with the Galician government focused on the local supplier network.',
    },
  },
  {
    id: 'zalia',
    title: 'Arranca la urbanización de la primera fase de la Zalia',
    publisher: 'Interempresas',
    date: '—',
    url: 'https://www.interempresas.net/Naves/45616-Arranca-la-urbanizacion-de-la-primera-fase-de-la-Zalia.html',
    kind: 'press',
    usedFor: {
      es: 'Primera fase de la zona logística de Asturias: 700.000 m² netos junto a la A-8, la A-66 y la AS-2.',
      en: 'First phase of the Asturias logistics zone: 700,000 m² net next to the A-8, A-66 and AS-2.',
    },
  },
  {
    id: 'kpis-3pl',
    title: 'Los 10 KPIs 3PL que todo gerente de operaciones debe medir',
    publisher: 'Cleverence',
    date: '—',
    url: 'https://www.cleverence.com/articles/business-blogs-es/top-10-kpis-3pl-para-operations-managers-38416295/',
    kind: 'press',
    usedFor: {
      es: 'Definiciones de OTIF, fill rate, exactitud de inventario y líneas por hora. Los objetivos del tablero son orientativos.',
      en: 'Definitions of OTIF, fill rate, inventory accuracy and lines per hour. Board targets are indicative.',
    },
  },
  {
    id: 'ine-licencia',
    title: 'Aviso legal y condiciones de reutilización',
    publisher: 'INE',
    date: '—',
    url: 'https://www.ine.es/aviso_legal',
    kind: 'official',
    usedFor: {
      es: 'Licencia CC BY 4.0 para la información estadística del INE, citando la fuente.',
      en: 'CC BY 4.0 licence for INE statistics, crediting the source.',
    },
  },
]

export const sourceById = (id: string) => SOURCES.find((s) => s.id === id)
