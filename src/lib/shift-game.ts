// "Your shift": eight hourly events, three choices each. Pure and tested in
// shift-game.test.ts so the scoring never depends on the UI.

import type { Localized } from '@/lib/i18n'

export interface GameState {
  units: number
  accuracy: number
  otif: number
  safety: number
  morale: number
  overtime: number
}

export type Effect = Partial<GameState>

export interface Choice {
  id: string
  label: Localized
  effect: Effect
  why: Localized
}

export interface GameEvent {
  hour: number
  title: Localized
  situation: Localized
  choices: Choice[]
  mine: string
}

export const PLAN_UNITS = 16000

export const START: GameState = {
  units: 0,
  accuracy: 99.5,
  otif: 97,
  safety: 100,
  morale: 70,
  overtime: 0,
}

const BASE_HOURLY = PLAN_UNITS / 8

export const EVENTS: GameEvent[] = [
  {
    hour: 1,
    title: { es: 'Faltan cuatro personas', en: 'Four people missing' },
    situation: {
      es: 'Arrancas con 26 de 30. Hay pedidos con corte a las 10:00 y a las 14:00.',
      en: 'You start with 26 of 30. Orders are due at 10:00 and 14:00.',
    },
    mine: 'prioritise',
    choices: [
      {
        id: 'move',
        label: {
          es: 'Mover a dos de expediciones a preparación',
          en: 'Move two people from shipping to picking',
        },
        effect: { units: -150, otif: -2, morale: -3 },
        why: {
          es: 'Ganas ritmo ahora pero dejas expediciones corta justo cuando lleguen los cortes.',
          en: 'You gain pace now but leave shipping short exactly when cutoffs hit.',
        },
      },
      {
        id: 'agency',
        label: { es: 'Pedir refuerzos a la ETT', en: 'Call the temp agency' },
        effect: { units: -300, overtime: 2, accuracy: -0.2 },
        why: {
          es: 'Llegan en un par de horas y sin conocer la nave: cuesta dinero y algún error.',
          en: 'They arrive in a couple of hours without knowing the site: it costs money and some errors.',
        },
      },
      {
        id: 'prioritise',
        label: {
          es: 'Ordenar el trabajo por corte y avisar a planificación',
          en: 'Sequence by cutoff and warn planning',
        },
        effect: { units: -200, otif: 1, morale: 2 },
        why: {
          es: 'Con menos gente, lo primero es que salga lo que vence antes. Avisar pronto da margen para decidir arriba.',
          en: 'With fewer people, what is due first must leave first. Warning early gives management room to decide.',
        },
      },
    ],
  },
  {
    hour: 2,
    title: {
      es: 'Caen los terminales de la zona B',
      en: 'Zone B scanners go down',
    },
    situation: {
      es: 'Sistemas calcula 45 minutos de reparación. Seis personas trabajan en esa zona.',
      en: 'IT estimates 45 minutes to fix. Six people work in that zone.',
    },
    mine: 'reassign',
    choices: [
      {
        id: 'paper',
        label: { es: 'Seguir en papel', en: 'Carry on with paper' },
        effect: { units: -50, accuracy: -0.8, otif: -1 },
        why: {
          es: 'Sin escaneo los errores se disparan y se descubren en el cliente.',
          en: 'Without scanning, errors jump and show up at the customer.',
        },
      },
      {
        id: 'reassign',
        label: {
          es: 'Pasarlos a la zona A hasta que vuelva el sistema',
          en: 'Move them to zone A until it is back',
        },
        effect: { units: -120 },
        why: {
          es: 'Pierdes algo de ritmo, pero no comprometes la calidad.',
          en: 'You lose some pace but keep quality intact.',
        },
      },
      {
        id: 'stop',
        label: { es: 'Parar la zona y esperar', en: 'Stop the zone and wait' },
        effect: { units: -380, morale: -2 },
        why: {
          es: 'Seguro, pero son 45 minutos de seis personas sin aportar.',
          en: 'Safe, but that is 45 minutes of six people adding nothing.',
        },
      },
    ],
  },
  {
    hour: 3,
    title: {
      es: 'Rotura de stock en una referencia A',
      en: 'Stockout on an A item',
    },
    situation: {
      es: 'La referencia que más sale no tiene stock en ubicación. Reposición tarda una hora.',
      en: 'The best-selling item is empty at its location. Replenishment takes an hour.',
    },
    mine: 'partial',
    choices: [
      {
        id: 'partial',
        label: {
          es: 'Servir parcial, avisar y relanzar al reponer',
          en: 'Ship partial, warn and relaunch when refilled',
        },
        effect: { units: -60, otif: -1 },
        why: {
          es: 'El cliente lo sabe a tiempo y el resto del pedido no se para.',
          en: 'The customer knows in time and the rest of the order keeps moving.',
        },
      },
      {
        id: 'hold',
        label: {
          es: 'Retener los pedidos hasta reponer',
          en: 'Hold the orders until refilled',
        },
        effect: { units: -250, otif: -2 },
        why: {
          es: 'Pedidos enteros esperando por una línea: se acumulan contra el corte.',
          en: 'Whole orders waiting on one line pile up against the cutoff.',
        },
      },
      {
        id: 'substitute',
        label: {
          es: 'Sustituir por otra referencia parecida',
          en: 'Substitute a similar item',
        },
        effect: { accuracy: -1.2, otif: -2 },
        why: {
          es: 'Sin acuerdo con el cliente es un error de pedido, aunque salga a tiempo.',
          en: 'Without the customer’s agreement it is an order error, even if it ships on time.',
        },
      },
    ],
  },
  {
    hour: 4,
    title: {
      es: 'Llega tarde un camión de frío',
      en: 'A chilled truck arrives late',
    },
    situation: {
      es: 'Proveedor con dos horas de retraso. Mercancía refrigerada esperando en muelle.',
      en: 'Supplier two hours late. Chilled goods waiting at the dock.',
    },
    mine: 'priority',
    choices: [
      {
        id: 'priority',
        label: {
          es: 'Descargarlo ya aunque rompa el plan de muelles',
          en: 'Unload now, even if it breaks the dock plan',
        },
        effect: { units: -100 },
        why: {
          es: 'El frío no espera: cada minuto en muelle es merma y riesgo de rechazo.',
          en: 'Cold chain cannot wait: every minute at the dock is write-off and rejection risk.',
        },
      },
      {
        id: 'queue',
        label: {
          es: 'Descargarlo cuando le toque',
          en: 'Unload it in its slot',
        },
        effect: { accuracy: -0.3, otif: -2 },
        why: {
          es: 'Respetas el plan, pero rompes la cadena de frío.',
          en: 'You respect the plan but break the cold chain.',
        },
      },
      {
        id: 'reject',
        label: { es: 'Rechazar la entrega', en: 'Reject the delivery' },
        effect: { otif: -4, morale: -1 },
        why: {
          es: 'Te quedas sin la mercancía que necesitabas para servir mañana.',
          en: 'You lose stock you needed for tomorrow’s orders.',
        },
      },
    ],
  },
  {
    hour: 5,
    title: { es: 'Pico de pedidos exprés', en: 'Express order spike' },
    situation: {
      es: 'Entran un 20 % más de pedidos con corte a las 14:00.',
      en: '20% more orders arrive, due at 14:00.',
    },
    mine: 'waves',
    choices: [
      {
        id: 'waves',
        label: {
          es: 'Reordenar olas por corte (primero lo que vence antes)',
          en: 'Resequence waves by cutoff (earliest first)',
        },
        effect: { units: 250, otif: 1 },
        why: {
          es: 'Sin gente extra, ordenar bien es lo que más rinde.',
          en: 'Without extra people, good sequencing pays off most.',
        },
      },
      {
        id: 'overtime',
        label: {
          es: 'Pedir horas extra a todo el turno',
          en: 'Ask the whole shift for overtime',
        },
        effect: { units: 400, overtime: 6, morale: -6 },
        why: {
          es: 'Funciona hoy, pero agota al equipo y encarece el turno.',
          en: 'It works today but wears the team down and makes the shift expensive.',
        },
      },
      {
        id: 'ignore',
        label: {
          es: 'Seguir igual y que salga lo que salga',
          en: 'Carry on and see what ships',
        },
        effect: { otif: -5 },
        why: {
          es: 'Los exprés se quedan detrás de pedidos que no tenían prisa.',
          en: 'Express orders wait behind orders that were not urgent.',
        },
      },
    ],
  },
  {
    hour: 6,
    title: {
      es: 'Casi accidente con una transpaleta',
      en: 'Near miss with a pallet truck',
    },
    situation: {
      es: 'Nadie herido, pero un palet ha rozado a un compañero en un cruce.',
      en: 'Nobody hurt, but a pallet brushed a colleague at a crossing.',
    },
    mine: 'brief',
    choices: [
      {
        id: 'brief',
        label: {
          es: 'Parar 10 minutos, explicar qué pasó y corregir el cruce',
          en: 'Stop 10 minutes, explain it and fix the crossing',
        },
        effect: { units: -170, safety: 2, morale: 5 },
        why: {
          es: 'El próximo puede no quedarse en susto. El equipo ve que la seguridad va primero.',
          en: 'Next time it may not be a near miss. The team sees safety comes first.',
        },
      },
      {
        id: 'log',
        label: { es: 'Registrarlo y seguir', en: 'Log it and carry on' },
        effect: { safety: -10, morale: -2 },
        why: {
          es: 'El riesgo sigue ahí y el equipo entiende que no importa tanto.',
          en: 'The risk is still there and the team learns it does not matter much.',
        },
      },
      {
        id: 'blame',
        label: { es: 'Amonestar al conductor', en: 'Reprimand the driver' },
        effect: { safety: -5, morale: -10 },
        why: {
          es: 'Nadie vuelve a avisar de un casi accidente si eso trae castigo.',
          en: 'Nobody reports a near miss again if it brings punishment.',
        },
      },
    ],
  },
  {
    hour: 7,
    title: {
      es: 'Una incorporación va al 40 %',
      en: 'A new starter is at 40%',
    },
    situation: {
      es: 'Segunda semana en la nave y muy por debajo del ritmo.',
      en: 'Second week on site and far below pace.',
    },
    mine: 'pair',
    choices: [
      {
        id: 'pair',
        label: {
          es: 'Emparejarla una hora con alguien veterano',
          en: 'Pair them for an hour with a veteran',
        },
        effect: { units: -60, morale: 4, accuracy: 0.1 },
        why: {
          es: 'Hoy cuesta un poco; en dos semanas tienes a otra persona a pleno ritmo.',
          en: 'It costs a little today; in two weeks you have another person at full pace.',
        },
      },
      {
        id: 'simple',
        label: {
          es: 'Pasarla a una tarea más sencilla',
          en: 'Move them to a simpler task',
        },
        effect: { units: 20 },
        why: {
          es: 'Resuelve el turno pero no el problema.',
          en: 'It fixes the shift but not the problem.',
        },
      },
      {
        id: 'push',
        label: {
          es: 'Exigirle el ritmo del resto',
          en: 'Demand the same pace as everyone',
        },
        effect: { accuracy: -0.4, morale: -6 },
        why: {
          es: 'Más prisa sin método trae errores y bajas tempranas.',
          en: 'More haste without method brings errors and early leavers.',
        },
      },
    ],
  },
  {
    hour: 8,
    title: {
      es: 'Cierre: faltan unidades',
      en: 'Closing: units still pending',
    },
    situation: {
      es: 'Queda la última hora y no se llega al plan.',
      en: 'One hour left and the plan will not be met.',
    },
    mine: 'handover',
    choices: [
      {
        id: 'voluntary',
        label: {
          es: 'Horas extra voluntarias para lo urgente',
          en: 'Voluntary overtime for the urgent part',
        },
        effect: { units: 450, overtime: 3, morale: -1 },
        why: {
          es: 'Bien si es voluntario y solo para lo que vence hoy.',
          en: 'Fine if voluntary and only for what is due today.',
        },
      },
      {
        id: 'handover',
        label: {
          es: 'Pasar lo pendiente al siguiente turno con un relevo claro',
          en: 'Hand pending work to the next shift with a clear note',
        },
        effect: { otif: -1, morale: 2 },
        why: {
          es: 'Si el relevo es claro, el siguiente turno arranca sabiendo qué priorizar.',
          en: 'With a clear handover, the next shift starts knowing what to prioritise.',
        },
      },
      {
        id: 'skip',
        label: {
          es: 'Acelerar saltándose la verificación',
          en: 'Speed up by skipping verification',
        },
        effect: { units: 500, accuracy: -1.5 },
        why: {
          es: 'Las unidades salen, pero los errores vuelven en forma de reclamaciones.',
          en: 'Units ship, but errors come back as complaints.',
        },
      },
    ],
  },
]

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

export function applyChoices(choiceIds: string[]): GameState {
  let s = { ...START }
  choiceIds.forEach((id, i) => {
    const event = EVENTS[i]
    const choice = event?.choices.find((c) => c.id === id)
    const e = choice?.effect ?? {}
    s = {
      units: s.units + BASE_HOURLY + (e.units ?? 0),
      accuracy: clamp(s.accuracy + (e.accuracy ?? 0), 0, 100),
      otif: clamp(s.otif + (e.otif ?? 0), 0, 100),
      safety: clamp(s.safety + (e.safety ?? 0), 0, 100),
      morale: clamp(s.morale + (e.morale ?? 0), 0, 100),
      overtime: s.overtime + (e.overtime ?? 0),
    }
  })
  return s
}

export function myRoute(): string[] {
  return EVENTS.map((e) => e.mine)
}
