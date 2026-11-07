import type { Localized } from '@/lib/i18n'

export type SectorId = 'frio' | 'ecom' | 'retail' | 'jis' | 'tpl'

export interface Kpi {
  id: string
  label: Localized
  unit: string
  higherIsBetter: boolean
  formula: Localized
  target: number
  demo: number[]
}

export interface Sector {
  id: SectorId
  code: string
  name: Localized
  where: Localized
  how: Localized
  pressure: Localized
  firstMonth: Localized[]
  kpis: Kpi[]
}

// Archetypes common in Asturias, Galicia, Cantabria and León. No company is
// named; the descriptions only use publicly reported ways of working.
export const SECTORS: Sector[] = [
  {
    id: 'frio',
    code: 'N01',
    name: {
      es: 'Alimentación con frío y caducidad corta',
      en: 'Chilled food with short shelf life',
    },
    where: {
      es: 'Fábricas lácteas y cárnicas con almacén frigorífico propio, que sirven a gran distribución y hostelería.',
      en: 'Dairy and meat plants with their own cold store, serving retail chains and hospitality.',
    },
    how: {
      es: 'Cada lote tiene fecha y el cliente rechaza lo que llega con poca vida útil. Se prepara por FEFO, se controla el tiempo fuera de frío en muelle y la trazabilidad por lote es obligatoria.',
      en: 'Every lot is dated and customers reject stock arriving with little shelf life. Picking follows FEFO, time out of the cold at the dock is controlled and lot traceability is mandatory.',
    },
    pressure: {
      es: 'Mermas por caducidad y reclamaciones por vida útil.',
      en: 'Expiry write-offs and shelf-life complaints.',
    },
    firstMonth: [
      {
        es: 'Medir cuántas líneas salen con el lote correcto según FEFO.',
        en: 'Measure how many lines ship with the right lot under FEFO.',
      },
      {
        es: 'Cronometrar el tiempo real en muelle por expedición.',
        en: 'Time the real dock exposure per shipment.',
      },
      {
        es: 'Atacar las mermas por su causa: previsión, rotación o ubicación.',
        en: 'Tackle write-offs by cause: forecast, rotation or location.',
      },
    ],
    kpis: [
      {
        id: 'fefo',
        label: {
          es: 'Líneas con lote FEFO correcto',
          en: 'Lines with correct FEFO lot',
        },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Líneas con lote correcto / líneas auditadas',
          en: 'Lines with right lot / audited lines',
        },
        target: 99,
        demo: [97.1, 97.6, 98.0, 97.8, 98.4, 98.9, 99.1, 99.0],
      },
      {
        id: 'merma',
        label: { es: 'Merma por caducidad', en: 'Expiry write-off' },
        unit: '%',
        higherIsBetter: false,
        formula: {
          es: 'Unidades caducadas / unidades recibidas',
          en: 'Expired units / received units',
        },
        target: 0.8,
        demo: [1.4, 1.3, 1.25, 1.1, 1.0, 0.95, 0.9, 0.85],
      },
      {
        id: 'muelle',
        label: {
          es: 'Tiempo fuera de frío en muelle',
          en: 'Time out of cold at dock',
        },
        unit: 'min',
        higherIsBetter: false,
        formula: {
          es: 'Media de minutos desde cámara hasta camión cerrado',
          en: 'Average minutes from cold room to closed truck',
        },
        target: 15,
        demo: [24, 22, 21, 19, 18, 17, 16, 15],
      },
      {
        id: 'otif',
        label: { es: 'OTIF a cliente', en: 'Customer OTIF' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Pedidos completos y a tiempo / pedidos comprometidos',
          en: 'Complete, on-time orders / committed orders',
        },
        target: 96,
        demo: [93.5, 94.0, 94.2, 95.1, 95.0, 95.8, 96.2, 96.4],
      },
      {
        id: 'lph',
        label: { es: 'Líneas por hora', en: 'Lines per hour' },
        unit: 'lín/h',
        higherIsBetter: true,
        formula: {
          es: 'Líneas preparadas / horas de preparación',
          en: 'Lines picked / picking hours',
        },
        target: 95,
        demo: [86, 88, 87, 90, 92, 91, 94, 95],
      },
    ],
  },
  {
    id: 'ecom',
    code: 'N02',
    name: {
      es: 'E-commerce de gran volumen',
      en: 'High-volume e-commerce',
    },
    where: {
      es: 'Centros robotizados de varias plantas, con cientos de personas por turno y más de sesenta perfiles distintos.',
      en: 'Multi-floor robotic sites with hundreds of people per shift and over sixty different roles.',
    },
    how: {
      es: 'El trabajo llega por olas con horas de salida fijas. La productividad se mide por hora, el escaneo garantiza la calidad y las campañas obligan a contratar y formar en pocas semanas.',
      en: 'Work arrives in waves with fixed departure times. Productivity is tracked hourly, scanning guarantees quality and peak seasons force hiring and training within weeks.',
    },
    pressure: {
      es: 'Llegar a los cortes en campaña con gente que acaba de entrar.',
      en: 'Making cutoffs during peak with people who just joined.',
    },
    firstMonth: [
      {
        es: 'Separar la productividad de veteranos y de incorporaciones.',
        en: 'Split productivity between veterans and new starters.',
      },
      {
        es: 'Planificar la contratación con la curva de aprendizaje, no con la plantilla final.',
        en: 'Plan hiring with the learning curve, not the final headcount.',
      },
      {
        es: 'Revisar por qué se pierde cada corte: entrada tardía, ritmo o bloqueos.',
        en: 'Review why each cutoff is missed: late input, pace or blockages.',
      },
    ],
    kpis: [
      {
        id: 'uph',
        label: { es: 'Unidades por hora', en: 'Units per hour' },
        unit: 'uds/h',
        higherIsBetter: true,
        formula: {
          es: 'Unidades preparadas / horas trabajadas',
          en: 'Units picked / hours worked',
        },
        target: 120,
        demo: [104, 108, 111, 109, 114, 117, 119, 121],
      },
      {
        id: 'corte',
        label: { es: 'Paquetes antes del corte', en: 'Parcels before cutoff' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Paquetes listos antes del corte / paquetes del corte',
          en: 'Parcels ready before cutoff / parcels due',
        },
        target: 99.5,
        demo: [98.2, 98.6, 99.0, 98.7, 99.2, 99.4, 99.5, 99.6],
      },
      {
        id: 'exactitud',
        label: { es: 'Exactitud de pedido', en: 'Order accuracy' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Pedidos sin error / pedidos enviados',
          en: 'Error-free orders / orders shipped',
        },
        target: 99.8,
        demo: [99.5, 99.6, 99.6, 99.7, 99.7, 99.8, 99.8, 99.85],
      },
      {
        id: 'rampa',
        label: {
          es: 'Incorporaciones a ritmo pleno',
          en: 'New starters at full pace',
        },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Incorporaciones en objetivo a la 3.ª semana / incorporaciones',
          en: 'New starters on target by week 3 / new starters',
        },
        target: 80,
        demo: [55, 61, 64, 70, 72, 75, 78, 81],
      },
      {
        id: 'absentismo',
        label: { es: 'Absentismo', en: 'Absenteeism' },
        unit: '%',
        higherIsBetter: false,
        formula: {
          es: 'Horas de ausencia / horas planificadas',
          en: 'Absence hours / planned hours',
        },
        target: 5,
        demo: [7.2, 6.8, 6.9, 6.4, 6.1, 5.8, 5.5, 5.2],
      },
    ],
  },
  {
    id: 'retail',
    code: 'N03',
    name: {
      es: 'Distribución regional a supermercados',
      en: 'Regional supermarket distribution',
    },
    where: {
      es: 'Plataformas centrales que sirven a más de cien tiendas del noroeste varias veces por semana, con frescos diarios y flota eléctrica en crecimiento.',
      en: 'Central platforms serving over a hundred north-west stores several times a week, with daily fresh produce and a growing electric fleet.',
    },
    how: {
      es: 'Cada tienda pide por la tarde y recibe al día siguiente. El reto es llenar los camiones sin pasarse de la autonomía ni de la ventana horaria de cada tienda.',
      en: 'Each store orders in the afternoon and receives the next day. The challenge is filling trucks without exceeding range or each store’s time window.',
    },
    pressure: {
      es: 'Camiones medio vacíos y kilómetros de más.',
      en: 'Half-empty trucks and extra kilometres.',
    },
    firstMonth: [
      {
        es: 'Medir el llenado real de cada camión, no el teórico.',
        en: 'Measure each truck’s real fill, not the planned one.',
      },
      {
        es: 'Agrupar tiendas por ahorro de kilómetros respetando la autonomía.',
        en: 'Group stores by kilometre savings within range.',
      },
      {
        es: 'Cruzar roturas con la forma de montar el palet.',
        en: 'Link breakages to how pallets are built.',
      },
    ],
    kpis: [
      {
        id: 'otif',
        label: { es: 'OTIF a tienda', en: 'Store OTIF' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Entregas completas en ventana / entregas',
          en: 'Complete deliveries in window / deliveries',
        },
        target: 97,
        demo: [94.0, 94.6, 95.1, 95.5, 96.0, 96.2, 96.9, 97.1],
      },
      {
        id: 'llenado',
        label: { es: 'Llenado de camión', en: 'Truck fill' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Palets cargados / capacidad en palets',
          en: 'Pallets loaded / pallet capacity',
        },
        target: 90,
        demo: [78, 80, 82, 83, 85, 87, 88, 90],
      },
      {
        id: 'kmpalet',
        label: { es: 'Kilómetros por palet', en: 'Kilometres per pallet' },
        unit: 'km',
        higherIsBetter: false,
        formula: {
          es: 'Kilómetros recorridos / palets entregados',
          en: 'Kilometres driven / pallets delivered',
        },
        target: 4,
        demo: [5.2, 5.0, 4.9, 4.7, 4.5, 4.3, 4.2, 4.0],
      },
      {
        id: 'fill',
        label: { es: 'Fill rate', en: 'Fill rate' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Unidades servidas / unidades pedidas',
          en: 'Units served / units ordered',
        },
        target: 98,
        demo: [96.1, 96.5, 96.8, 97.0, 97.3, 97.6, 97.9, 98.1],
      },
      {
        id: 'roturas',
        label: { es: 'Roturas y daños', en: 'Breakage and damage' },
        unit: '%',
        higherIsBetter: false,
        formula: {
          es: 'Unidades dañadas / unidades entregadas',
          en: 'Damaged units / units delivered',
        },
        target: 0.3,
        demo: [0.6, 0.55, 0.5, 0.48, 0.42, 0.38, 0.33, 0.3],
      },
    ],
  },
  {
    id: 'jis',
    code: 'N04',
    name: {
      es: 'Proveedor de automoción en secuencia',
      en: 'Just-in-sequence automotive supplier',
    },
    where: {
      es: 'Proveedores que alimentan una planta de montaje en el orden exacto de los coches, a menudo sin stock intermedio.',
      en: 'Suppliers feeding an assembly plant in the exact order of the cars, often with no buffer stock.',
    },
    how: {
      es: 'La línea manda: cada rack lleva las piezas en la secuencia de fabricación. Un fallo de material puede parar la planta, y se han visto paradas de días por falta de piezas.',
      en: 'The line sets the pace: each rack carries parts in build sequence. A material failure can stop the plant, and multi-day stops for missing parts have happened.',
    },
    pressure: {
      es: 'Cero paradas de línea y cero errores de secuencia.',
      en: 'Zero line stops and zero sequence errors.',
    },
    firstMonth: [
      {
        es: 'Calcular cuántos racks y preparadores exige el ritmo de línea.',
        en: 'Work out how many racks and preparers the line pace requires.',
      },
      {
        es: 'Medir el margen real en minutos entre rack listo y consumo.',
        en: 'Measure the real minutes of slack between rack ready and use.',
      },
      {
        es: 'Poner a prueba de errores la secuencia con verificación por escaneo.',
        en: 'Error-proof the sequence with scan verification.',
      },
    ],
    kpis: [
      {
        id: 'paros',
        label: {
          es: 'Paradas de línea por material',
          en: 'Line stops for material',
        },
        unit: 'nº',
        higherIsBetter: false,
        formula: {
          es: 'Paradas atribuibles al suministro en la semana',
          en: 'Supply-caused stops in the week',
        },
        target: 0,
        demo: [2, 1, 1, 1, 0, 1, 0, 0],
      },
      {
        id: 'secuencia',
        label: { es: 'Exactitud de secuencia', en: 'Sequence accuracy' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Racks en secuencia correcta / racks enviados',
          en: 'Racks in right sequence / racks sent',
        },
        target: 99.9,
        demo: [99.6, 99.7, 99.7, 99.8, 99.85, 99.9, 99.9, 99.95],
      },
      {
        id: 'cobertura',
        label: { es: 'Cobertura en línea', en: 'Line coverage' },
        unit: 'min',
        higherIsBetter: true,
        formula: {
          es: 'Minutos de consumo cubiertos por racks listos',
          en: 'Minutes of use covered by ready racks',
        },
        target: 45,
        demo: [32, 35, 36, 38, 40, 42, 44, 46],
      },
      {
        id: 'otif',
        label: { es: 'OTIF de proveedores', en: 'Supplier OTIF' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Entregas de proveedor completas y a tiempo / entregas',
          en: 'Complete, on-time supplier deliveries / deliveries',
        },
        target: 98,
        demo: [95.0, 95.6, 96.1, 96.8, 97.0, 97.5, 97.9, 98.2],
      },
      {
        id: 'rackh',
        label: {
          es: 'Racks por hora y persona',
          en: 'Racks per hour per person',
        },
        unit: 'r/h',
        higherIsBetter: true,
        formula: {
          es: 'Racks preparados / horas de preparación',
          en: 'Racks prepared / preparation hours',
        },
        target: 4,
        demo: [3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0],
      },
    ],
  },
  {
    id: 'tpl',
    code: 'N05',
    name: {
      es: 'Operador logístico multicliente',
      en: 'Multi-client logistics provider',
    },
    where: {
      es: 'Operadores que comparten nave, flota y personal entre varios clientes, cada uno con su contrato y sus indicadores.',
      en: 'Providers sharing site, fleet and staff across several clients, each with its own contract and indicators.',
    },
    how: {
      es: 'Cada cliente exige su informe de servicio. La rentabilidad depende de mover personas entre clientes según la carga del día sin romper ningún acuerdo de servicio.',
      en: 'Every client expects its own service report. Profit depends on moving people between clients by daily load without breaking any service agreement.',
    },
    pressure: {
      es: 'Cumplir todos los acuerdos de servicio con un coste por línea competitivo.',
      en: 'Meeting every service agreement at a competitive cost per line.',
    },
    firstMonth: [
      {
        es: 'Un tablero por cliente con las mismas definiciones de KPI.',
        en: 'One board per client with identical KPI definitions.',
      },
      {
        es: 'Exactitud de inventario como indicador raíz: arrastra a los demás.',
        en: 'Inventory accuracy as the root indicator: it drives the rest.',
      },
      {
        es: 'Reparto diario de personas por carga, no por costumbre.',
        en: 'Daily staff allocation by load, not by habit.',
      },
    ],
    kpis: [
      {
        id: 'otif',
        label: { es: 'OTIF', en: 'OTIF' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Pedidos completos y a tiempo / pedidos comprometidos',
          en: 'Complete, on-time orders / committed orders',
        },
        target: 95,
        demo: [92.0, 92.8, 93.5, 93.9, 94.4, 94.9, 95.3, 95.6],
      },
      {
        id: 'inventario',
        label: { es: 'Exactitud de inventario', en: 'Inventory accuracy' },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Ubicaciones correctas / ubicaciones auditadas',
          en: 'Correct locations / audited locations',
        },
        target: 99,
        demo: [96.8, 97.2, 97.5, 97.9, 98.3, 98.6, 98.9, 99.1],
      },
      {
        id: 'coste',
        label: { es: 'Coste por línea', en: 'Cost per line' },
        unit: '€',
        higherIsBetter: false,
        formula: {
          es: 'Coste operativo / líneas preparadas',
          en: 'Operating cost / lines picked',
        },
        target: 0.55,
        demo: [0.68, 0.66, 0.65, 0.62, 0.6, 0.58, 0.57, 0.55],
      },
      {
        id: 'dock',
        label: { es: 'De muelle a stock', en: 'Dock to stock' },
        unit: 'h',
        higherIsBetter: false,
        formula: {
          es: 'Horas desde descarga hasta ubicación disponible',
          en: 'Hours from unload to available location',
        },
        target: 8,
        demo: [14, 13, 12, 11, 10, 9.5, 8.5, 8],
      },
      {
        id: 'devol',
        label: {
          es: 'Devoluciones procesadas en 48 h',
          en: 'Returns processed within 48 h',
        },
        unit: '%',
        higherIsBetter: true,
        formula: {
          es: 'Devoluciones cerradas en 48 h / devoluciones recibidas',
          en: 'Returns closed in 48 h / returns received',
        },
        target: 90,
        demo: [72, 75, 78, 80, 83, 86, 88, 91],
      },
    ],
  },
]

export const sectorById = (id: SectorId) =>
  SECTORS.find((s) => s.id === id) ?? SECTORS[0]

export type KpiStatus = 'met' | 'close' | 'off' | 'empty'

export function kpiStatus(
  kpi: Kpi,
  value: number | null | undefined,
  target: number,
): KpiStatus {
  if (value === null || value === undefined) return 'empty'
  const met = kpi.higherIsBetter ? value >= target : value <= target
  if (met) return 'met'
  const gap = Math.abs(value - target) / Math.max(Math.abs(target), 1e-9)
  return gap <= 0.05 ? 'close' : 'off'
}
