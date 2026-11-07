// Interface copy (labels, buttons, messages) for every component, per language.
// Data-driven content (posts, checklist items, ideas…) lives in content.ts.

import { useLanguage, type Lang } from '@/lib/i18n'

const es = {
  langToggle: {
    label: 'Idioma',
    es: 'Cambiar a español',
    en: 'Cambiar a inglés',
  },
  header: {
    brand: 'Operaciones a pie de campo',
    nav: { blog: 'Blog', tools: 'Herramientas' },
    openBlog: 'Abrir el blog',
    linkedin: 'Perfil de LinkedIn',
  },
  hero: {
    eyebrow: 'Operaciones a pie de campo',
    roles: [
      'Team Leader de Pick',
      'Logística, Operaciones y Calidad',
      'Máster en Gestión de la Calidad',
    ],
    location: 'Oviedo, Asturias, España',
    description:
      'Reflexiones y herramientas prácticas sobre liderazgo de equipos, productividad sostenible, calidad e inteligencia artificial aplicada a la logística, escritas desde la planta y no desde el despacho.',
    viewBlog: 'Ver Blog',
    stats: [
      { value: '5', label: 'artículos de campo' },
      { value: '5', label: 'herramientas interactivas' },
      { value: '100%', label: 'experiencia en planta' },
    ],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Entradas del blog',
    description:
      'Cinco artículos sobre lo que se aprende en la operación diaria. Cada uno tiene su herramienta interactiva más abajo.',
    readArticle: 'Leer artículo',
    tool: 'Herramienta',
  },
  tools: {
    eyebrow: 'Herramientas',
    title: 'Cinco herramientas para el día a día',
    description:
      'Una herramienta práctica por cada entrada del blog, pensada para usarla en planta o para llevar las ideas a tu propio equipo.',
    navLabel: 'Herramientas',
    toolNumber: (n: string) => `Herramienta ${n}`,
    article: 'Artículo',
    items: {
      checklist: {
        title: 'Checklist de inicio de turno',
        description:
          'Los cinco puntos que reviso antes de arrancar un turno de pick. Se guarda en tu navegador.',
      },
      'ia-casos': {
        title: 'Explorador de casos de uso de IA',
        description:
          'Ocho aplicaciones de inteligencia artificial en almacén, filtrables por el objetivo que persiguen.',
      },
      priorizador: {
        title: 'Priorizador de ideas',
        description:
          'Puntúa impacto y esfuerzo de cada idea y mira dónde cae en la matriz de prioridad.',
      },
      capacidad: {
        title: 'Calculadora de capacidad del turno',
        description:
          'De la capacidad teórica a un objetivo realista, descontando absentismo, descansos y margen.',
      },
      'mapa-sectores': {
        title: 'Mapa de conceptos entre sectores',
        description:
          'Elige un sector y descubre tres principios de la logística de pick que se pueden aplicar en él.',
      },
    },
  },
  checklist: {
    ready: 'Listo para arrancar',
    almost: 'Casi listo',
    notReady: 'No iniciar turno',
    status: 'Estado del turno',
    progress: (done: number, total: number) =>
      `${done} de ${total} puntos completados`,
    reset: 'Reiniciar checklist',
  },
  ai: {
    all: 'Todos',
    filterLabel: 'Filtrar por objetivo',
    shown: (n: number) => `${n} casos de uso mostrados`,
    maturity: (m: string) => `Madurez: ${m}`,
  },
  ideas: {
    quadrants: {
      quick: { label: 'Quick wins', hint: 'Alto impacto · poco esfuerzo' },
      big: { label: 'Big bets', hint: 'Alto impacto · mucho esfuerzo' },
      fill: { label: 'Fill-ins', hint: 'Bajo impacto · poco esfuerzo' },
      avoid: { label: 'Avoid', hint: 'Bajo impacto · mucho esfuerzo' },
    },
    autoSort: 'Ordenar automáticamente por ratio impacto/esfuerzo',
    reset: 'Restablecer',
    dragHint:
      'Arrastra las tarjetas (o usa las flechas) para ordenarlas a mano. Al hacerlo se desactiva el orden automático.',
    moveUp: (t: string) => `Subir ${t}`,
    moveDown: (t: string) => `Bajar ${t}`,
    impact: 'Impacto',
    effort: 'Esfuerzo',
    ratio: 'Ratio',
    matrix: 'Matriz de prioridad',
  },
  capacity: {
    locale: 'es-ES',
    fields: {
      workers: { label: 'Número de trabajadores', unit: 'personas' },
      hours: { label: 'Horas de turno', unit: 'h' },
      rate: { label: 'Ritmo medio de pick', unit: 'uds/h' },
      absenteeism: { label: 'Absentismo', unit: '%' },
      breakMin: { label: 'Tiempo de descanso', unit: 'min' },
      margin: {
        label: 'Margen de seguridad',
        unit: '%',
        help: 'Colchón para incidencias, formación y variabilidad.',
      },
      volume: {
        label: 'Volumen previsto',
        unit: 'uds',
        help: 'Se compara con la capacidad efectiva para detectar sobrecarga.',
      },
    } as Record<string, { label: string; unit: string; help?: string }>,
    formLabel: 'Parámetros del turno',
    resetValues: 'Restablecer valores',
    units: 'uds',
    unitsPerHour: 'uds/h',
    gross: 'Capacidad total teórica',
    effective: 'Capacidad efectiva con margen',
    target: 'Objetivo diario recomendado',
    perPerson: 'Ritmo objetivo por persona',
    breakdown: 'Del teórico a lo realista',
    segments: {
      effective: 'Capacidad efectiva',
      margin: 'Margen',
      breaks: 'Descansos',
      absenteeism: 'Absentismo',
    },
    presence: (people: string, hours: string) =>
      `${people} personas presentes · ${hours} h productivas por persona`,
    over: 'Turno sobrecargado',
    limit: 'Turno al límite',
    ok: 'Carga asumible',
    overText: (excess: string, workers: number) =>
      `El volumen previsto supera la capacidad efectiva en ${excess} uds. Necesitarías unas ${workers} personas en plantilla, o redistribuir volumen.`,
    limitText:
      'Hay muy poco colchón para imprevistos. Vigila el ritmo por hora y prepara apoyos.',
    okText: (spare: string) =>
      `Queda margen de ${spare} uds sobre la capacidad efectiva.`,
    note: 'El objetivo recomendado se basa en la capacidad efectiva, no en la teórica, para exigir sin quemar al equipo.',
  },
  sectors: {
    tabsLabel: 'Sectores',
    origin: 'Logística de pick',
  },
  footer: {
    disclaimer: 'Opiniones personales. No representan a ninguna empresa.',
    linkedin: 'Perfil de LinkedIn',
  },
}

type Strings = typeof es

const en: Strings = {
  langToggle: {
    label: 'Language',
    es: 'Switch to Spanish',
    en: 'Switch to English',
  },
  header: {
    brand: 'Operations on the Floor',
    nav: { blog: 'Blog', tools: 'Use Cases' },
    openBlog: 'Open the blog',
    linkedin: 'LinkedIn profile',
  },
  hero: {
    eyebrow: 'Operations on the Floor',
    roles: [
      'Pick Team Leader',
      'Logistics, Operations & Quality',
      'Master in Quality Management',
    ],
    location: 'Oviedo, Asturias, Spain',
    description:
      'Reflections and practical tools on team leadership, sustainable productivity, quality and artificial intelligence applied to logistics, written from the warehouse floor rather than the office.',
    viewBlog: 'View Blog',
    stats: [
      { value: '5', label: 'field articles' },
      { value: '5', label: 'interactive tools' },
      { value: '100%', label: 'hands-on floor experience' },
    ],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Blog posts',
    description:
      'Five articles on what day-to-day operations teach you. Each one has its own interactive tool further down.',
    readArticle: 'Read article (ES)',
    tool: 'Tool',
  },
  tools: {
    eyebrow: 'Use Cases',
    title: 'Five tools for everyday operations',
    description:
      'One practical tool for each blog post, designed to be used on the floor or to bring the ideas to your own team.',
    navLabel: 'Use cases',
    toolNumber: (n: string) => `Tool ${n}`,
    article: 'Article',
    items: {
      checklist: {
        title: 'Shift Checklist',
        description:
          'The five points I check before starting a pick shift. Saved in your browser.',
      },
      'ia-casos': {
        title: 'AI Use Case Explorer',
        description:
          'Eight artificial intelligence applications in the warehouse, filterable by the objective they pursue.',
      },
      priorizador: {
        title: 'Idea Prioritizer',
        description:
          'Score each idea’s impact and effort and see where it lands on the priority matrix.',
      },
      capacidad: {
        title: 'Shift Capacity Calculator',
        description:
          'From theoretical capacity to a realistic target, accounting for absenteeism, breaks and margin.',
      },
      'mapa-sectores': {
        title: 'Cross-Sector Map',
        description:
          'Pick a sector and discover three pick-logistics principles that can be applied to it.',
      },
    },
  },
  checklist: {
    ready: 'Ready to start',
    almost: 'Almost ready',
    notReady: 'Do not start shift',
    status: 'Shift status',
    progress: (done: number, total: number) =>
      `${done} of ${total} items completed`,
    reset: 'Reset checklist',
  },
  ai: {
    all: 'All',
    filterLabel: 'Filter by objective',
    shown: (n: number) => `${n} use cases shown`,
    maturity: (m: string) => `Maturity: ${m}`,
  },
  ideas: {
    quadrants: {
      quick: { label: 'Quick wins', hint: 'High impact · low effort' },
      big: { label: 'Big bets', hint: 'High impact · high effort' },
      fill: { label: 'Fill-ins', hint: 'Low impact · low effort' },
      avoid: { label: 'Avoid', hint: 'Low impact · high effort' },
    },
    autoSort: 'Sort automatically by impact/effort ratio',
    reset: 'Reset',
    dragHint:
      'Drag the cards (or use the arrows) to order them manually. Doing so turns off automatic sorting.',
    moveUp: (t: string) => `Move ${t} up`,
    moveDown: (t: string) => `Move ${t} down`,
    impact: 'Impact',
    effort: 'Effort',
    ratio: 'Ratio',
    matrix: 'Priority matrix',
  },
  capacity: {
    locale: 'en-US',
    fields: {
      workers: { label: 'Number of workers', unit: 'people' },
      hours: { label: 'Shift hours', unit: 'h' },
      rate: { label: 'Average pick rate', unit: 'units/h' },
      absenteeism: { label: 'Absenteeism', unit: '%' },
      breakMin: { label: 'Break time', unit: 'min' },
      margin: {
        label: 'Safety margin',
        unit: '%',
        help: 'Buffer for incidents, training and variability.',
      },
      volume: {
        label: 'Forecast volume',
        unit: 'units',
        help: 'Compared with effective capacity to detect overload.',
      },
    },
    formLabel: 'Shift parameters',
    resetValues: 'Reset values',
    units: 'units',
    unitsPerHour: 'units/h',
    gross: 'Total theoretical capacity',
    effective: 'Effective capacity with margin',
    target: 'Recommended daily target',
    perPerson: 'Target rate per person',
    breakdown: 'From theoretical to realistic',
    segments: {
      effective: 'Effective capacity',
      margin: 'Margin',
      breaks: 'Breaks',
      absenteeism: 'Absenteeism',
    },
    presence: (people: string, hours: string) =>
      `${people} people present · ${hours} productive h per person`,
    over: 'Shift overloaded',
    limit: 'Shift at its limit',
    ok: 'Manageable load',
    overText: (excess: string, workers: number) =>
      `Forecast volume exceeds effective capacity by ${excess} units. You would need about ${workers} people on the roster, or to redistribute volume.`,
    limitText:
      'There is very little buffer for the unexpected. Watch the hourly pace and line up support.',
    okText: (spare: string) =>
      `There is a margin of ${spare} units over effective capacity.`,
    note: 'The recommended target is based on effective capacity, not theoretical capacity, so you can push the team without burning it out.',
  },
  sectors: {
    tabsLabel: 'Sectors',
    origin: 'Pick logistics',
  },
  footer: {
    disclaimer: 'Personal opinions. Do not represent any company.',
    linkedin: 'LinkedIn profile',
  },
}

export const UI: Record<Lang, Strings> = { es, en }

/** Interface strings for the current language. */
export function useStrings() {
  return UI[useLanguage().lang]
}
