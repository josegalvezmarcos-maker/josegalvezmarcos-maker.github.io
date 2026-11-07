// All editorial content for the page lives here so it can be updated without
// touching the components. Every visible string is stored as `{ es, en }`.

import type { Localized } from '@/lib/i18n'

export const BLOG_URL = 'https://jagalvezmarcos.blogspot.com'
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/jose-antonio-galvez-marcos-10a566431/'

export type ToolId =
  'checklist' | 'ia-casos' | 'priorizador' | 'capacidad' | 'mapa-sectores'

export interface BlogPost {
  number: string
  title: Localized
  url: string
  excerpt: Localized
  tag: Localized
  toolId: ToolId
  toolName: Localized
}

export const BLOG_POSTS: BlogPost[] = [
  {
    number: '01',
    title: {
      es: 'Lo que aprendes dirigiendo un equipo de pick',
      en: 'What you learn leading a pick team',
    },
    url: 'https://jagalvezmarcos.blogspot.com/2026/11/lo-que-aprendes-dirigiendo-un-equipo-de.html',
    excerpt: {
      es: 'Rutinas, conversaciones y pequeños detalles que marcan la diferencia al arrancar cada turno.',
      en: 'Routines, conversations and small details that make the difference when starting every shift.',
    },
    tag: {
      es: 'Liderazgo',
      en: 'Leadership',
    },
    toolId: 'checklist',
    toolName: {
      es: 'Checklist de inicio de turno',
      en: 'Shift Checklist',
    },
  },
  {
    number: '02',
    title: {
      es: 'Casos de uso de IA que veo hoy en la logística',
      en: 'AI use cases I see in logistics today',
    },
    url: 'https://jagalvezmarcos.blogspot.com/2026/11/casos-de-uso-que-veo-hoy-en-la-logistica.html',
    excerpt: {
      es: 'Dónde la inteligencia artificial ya está aportando valor real en almacenes y centros de distribución.',
      en: 'Where artificial intelligence is already delivering real value in warehouses and distribution centres.',
    },
    tag: {
      es: 'IA aplicada',
      en: 'Applied AI',
    },
    toolId: 'ia-casos',
    toolName: {
      es: 'Explorador de casos de IA',
      en: 'AI Use Case Explorer',
    },
  },
  {
    number: '03',
    title: {
      es: 'Casos de uso que me gustaría probar',
      en: 'Use cases I would like to try',
    },
    url: 'https://jagalvezmarcos.blogspot.com/2026/11/casos-de-uso-que-me-gustaria-probar.html',
    excerpt: {
      es: 'Ideas de innovación pendientes y cómo decidir por cuál empezar sin perder el foco operativo.',
      en: 'Pending innovation ideas and how to decide where to start without losing operational focus.',
    },
    tag: {
      es: 'Innovación',
      en: 'Innovation',
    },
    toolId: 'priorizador',
    toolName: {
      es: 'Priorizador de ideas',
      en: 'Idea Prioritizer',
    },
  },
  {
    number: '04',
    title: {
      es: 'Medir sin quemar al equipo',
      en: 'Measuring without burning out the team',
    },
    url: 'https://jagalvezmarcos.blogspot.com/2026/11/medir-sin-quemar-al-equipo.html',
    excerpt: {
      es: 'Objetivos exigentes pero realistas: cómo usar los datos de productividad sin perder a las personas.',
      en: 'Demanding but realistic targets: how to use productivity data without losing your people.',
    },
    tag: {
      es: 'Métricas',
      en: 'Metrics',
    },
    toolId: 'capacidad',
    toolName: {
      es: 'Calculadora de capacidad',
      en: 'Shift Capacity Calculator',
    },
  },
  {
    number: '05',
    title: {
      es: 'Lo que el pick puede enseñar a otros sectores',
      en: 'What pick can teach other sectors',
    },
    url: 'https://jagalvezmarcos.blogspot.com/2026/11/lo-que-el-pick-puede-ensenar-otros.html',
    excerpt: {
      es: 'Principios de flujo, estándar y mejora continua que funcionan mucho más allá del almacén.',
      en: 'Principles of flow, standard work and continuous improvement that work far beyond the warehouse.',
    },
    tag: {
      es: 'Transferencia',
      en: 'Transfer',
    },
    toolId: 'mapa-sectores',
    toolName: {
      es: 'Mapa de conceptos entre sectores',
      en: 'Cross-Sector Map',
    },
  },
]

// ---------- Tool 1: shift checklist ----------

export interface ChecklistItem {
  id: string
  label: Localized
  detail: Localized
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'asistencia',
    label: {
      es: 'Asistencia confirmada',
      en: 'Attendance confirmed',
    },
    detail: {
      es: 'Plantilla presente, ausencias registradas y refuerzos asignados.',
      en: 'Team present, absences logged and backup staff assigned.',
    },
  },
  {
    id: 'equipos',
    label: {
      es: 'Equipos operativos',
      en: 'Equipment ready',
    },
    detail: {
      es: 'Escáneres cargados, carros y contenedores disponibles en zona.',
      en: 'Scanners charged, carts and totes available in the area.',
    },
  },
  {
    id: 'seguridad',
    label: {
      es: 'Seguridad revisada',
      en: 'Safety checked',
    },
    detail: {
      es: 'EPIs correctos, pasillos despejados e incidencias abiertas revisadas.',
      en: 'Correct PPE, clear aisles and open incidents reviewed.',
    },
  },
  {
    id: 'briefing',
    label: {
      es: 'Briefing realizado',
      en: 'Briefing done',
    },
    detail: {
      es: 'Prioridades del día, cambios de proceso y reconocimientos comunicados.',
      en: 'Daily priorities, process changes and recognitions communicated.',
    },
  },
  {
    id: 'objetivos',
    label: {
      es: 'Objetivos comunicados',
      en: 'Targets communicated',
    },
    detail: {
      es: 'Volumen previsto, ritmo por hora y puntos de control acordados.',
      en: 'Forecast volume, hourly rate and checkpoints agreed.',
    },
  },
]

// ---------- Tool 2: AI use cases ----------

export type Objective = 'Eficiencia' | 'Seguridad' | 'Calidad' | 'Coste'
export const OBJECTIVES: Objective[] = [
  'Eficiencia',
  'Seguridad',
  'Calidad',
  'Coste',
]

export const OBJECTIVE_LABELS: Record<Objective, Localized> = {
  Eficiencia: { es: 'Eficiencia', en: 'Efficiency' },
  Seguridad: { es: 'Seguridad', en: 'Safety' },
  Calidad: { es: 'Calidad', en: 'Quality' },
  Coste: { es: 'Coste', en: 'Cost' },
}

export type Maturity = 'Consolidado' | 'En expansión' | 'Emergente'

export const MATURITY_LABELS: Record<Maturity, Localized> = {
  Consolidado: { es: 'Consolidado', en: 'Established' },
  'En expansión': { es: 'En expansión', en: 'Expanding' },
  Emergente: { es: 'Emergente', en: 'Emerging' },
}

export interface AiUseCase {
  id: string
  title: Localized
  description: Localized
  objectives: Objective[]
  icon:
    | 'trending'
    | 'route'
    | 'wrench'
    | 'eye'
    | 'mic'
    | 'bot'
    | 'activity'
    | 'search'
  maturity: Maturity
}

export const AI_USE_CASES: AiUseCase[] = [
  {
    id: 'demanda',
    title: {
      es: 'Previsión de demanda',
      en: 'Demand forecasting',
    },
    description: {
      es: 'Modelos que anticipan volúmenes por día y franja horaria para dimensionar plantilla y reposición.',
      en: 'Models that anticipate volumes by day and time slot to size staffing and replenishment.',
    },
    objectives: ['Eficiencia', 'Coste'],
    icon: 'trending',
    maturity: 'Consolidado',
  },
  {
    id: 'rutas',
    title: {
      es: 'Optimización de rutas de pick',
      en: 'Pick route optimization',
    },
    description: {
      es: 'Secuencias de recogida que reducen metros recorridos y tiempos muertos entre ubicaciones.',
      en: 'Picking sequences that cut walking distance and idle time between locations.',
    },
    objectives: ['Eficiencia', 'Coste'],
    icon: 'route',
    maturity: 'Consolidado',
  },
  {
    id: 'mantenimiento',
    title: {
      es: 'Mantenimiento predictivo',
      en: 'Predictive maintenance',
    },
    description: {
      es: 'Sensores y modelos que detectan desgaste en cintas y equipos antes de que provoquen paradas.',
      en: 'Sensors and models that detect wear on conveyors and equipment before it causes downtime.',
    },
    objectives: ['Coste', 'Seguridad'],
    icon: 'wrench',
    maturity: 'En expansión',
  },
  {
    id: 'vision',
    title: {
      es: 'Visión artificial para calidad',
      en: 'Computer vision for quality',
    },
    description: {
      es: 'Cámaras que verifican producto, etiquetado y embalaje para detectar errores antes del envío.',
      en: 'Cameras that check product, labelling and packaging to catch errors before shipping.',
    },
    objectives: ['Calidad'],
    icon: 'eye',
    maturity: 'En expansión',
  },
  {
    id: 'voz',
    title: {
      es: 'Pick por voz',
      en: 'Voice picking',
    },
    description: {
      es: 'Instrucciones por voz que liberan manos y vista, reduciendo errores y mejorando el ritmo.',
      en: 'Voice instructions that free hands and eyes, reducing errors and improving pace.',
    },
    objectives: ['Eficiencia', 'Calidad', 'Seguridad'],
    icon: 'mic',
    maturity: 'Consolidado',
  },
  {
    id: 'robots',
    title: {
      es: 'Coordinación de robots',
      en: 'Robot coordination',
    },
    description: {
      es: 'Orquestación de flotas móviles para llevar la estantería a la persona y evitar congestiones.',
      en: 'Orchestrating mobile fleets to bring shelves to the picker and avoid congestion.',
    },
    objectives: ['Eficiencia', 'Seguridad'],
    icon: 'bot',
    maturity: 'En expansión',
  },
  {
    id: 'fatiga',
    title: {
      es: 'Detección de fatiga',
      en: 'Fatigue detection',
    },
    description: {
      es: 'Señales de ritmo y pausas que ayudan a rotar tareas y prevenir sobrecargas y lesiones.',
      en: 'Pace and break signals that help rotate tasks and prevent overload and injuries.',
    },
    objectives: ['Seguridad'],
    icon: 'activity',
    maturity: 'Emergente',
  },
  {
    id: 'inventario',
    title: {
      es: 'Anomalías de inventario',
      en: 'Inventory anomalies',
    },
    description: {
      es: 'Detección automática de descuadres, ubicaciones erróneas y patrones de merma.',
      en: 'Automatic detection of stock discrepancies, wrong locations and shrinkage patterns.',
    },
    objectives: ['Calidad', 'Coste'],
    icon: 'search',
    maturity: 'Emergente',
  },
]

// ---------- Tool 3: idea prioritizer ----------

export interface Idea {
  id: string
  title: Localized
  description: Localized
  impact: number
  effort: number
}

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'tablero',
    title: {
      es: 'Tablero visual de ritmo por hora',
      en: 'Visual hourly pace board',
    },
    description: {
      es: 'Pantalla en zona con progreso real frente al plan.',
      en: 'On-floor screen showing actual progress against plan.',
    },
    impact: 4,
    effort: 2,
  },
  {
    id: 'asistente',
    title: {
      es: 'Asistente IA para el briefing',
      en: 'AI assistant for the briefing',
    },
    description: {
      es: 'Resumen automático de prioridades y novedades del turno.',
      en: 'Automatic summary of shift priorities and updates.',
    },
    impact: 3,
    effort: 2,
  },
  {
    id: 'slotting',
    title: {
      es: 'Re-slotting por rotación',
      en: 'Velocity-based re-slotting',
    },
    description: {
      es: 'Reubicar referencias de alta rotación cerca de las salidas.',
      en: 'Move fast-moving SKUs closer to the exits.',
    },
    impact: 5,
    effort: 4,
  },
  {
    id: 'formacion',
    title: {
      es: 'Micro-formación en el puesto',
      en: 'On-the-job micro-training',
    },
    description: {
      es: 'Vídeos de 60 segundos accesibles desde el escáner.',
      en: '60-second videos available from the scanner.',
    },
    impact: 3,
    effort: 3,
  },
  {
    id: 'gamificacion',
    title: {
      es: 'Gamificación de productividad',
      en: 'Productivity gamification',
    },
    description: {
      es: 'Rankings y retos individuales por turno.',
      en: 'Leaderboards and individual challenges per shift.',
    },
    impact: 2,
    effort: 4,
  },
  {
    id: 'sugerencias',
    title: {
      es: 'Buzón digital de mejoras',
      en: 'Digital suggestion box',
    },
    description: {
      es: 'Ideas del equipo con seguimiento visible de su estado.',
      en: 'Team ideas with visible status tracking.',
    },
    impact: 2,
    effort: 1,
  },
]

// ---------- Tool 5: cross-sector concept map ----------

export interface Principle {
  title: Localized
  explanation: Localized
}

export interface Sector {
  id: string
  name: Localized
  icon: 'hotel' | 'hospital' | 'store' | 'hardhat' | 'school' | 'headset'
  summary: Localized
  principles: Principle[]
}

export const SECTORS: Sector[] = [
  {
    id: 'hosteleria',
    name: {
      es: 'Hostelería',
      en: 'Hospitality',
    },
    icon: 'hotel',
    summary: {
      es: 'Servicio rápido con picos de demanda muy marcados.',
      en: 'Fast service with very sharp demand peaks.',
    },
    principles: [
      {
        title: {
          es: 'Slotting por rotación',
          en: 'Velocity-based slotting',
        },
        explanation: {
          es: 'Colocar los ingredientes y utensilios más usados al alcance de la mano en cada estación, igual que las referencias de alta rotación.',
          en: 'Keep the most-used ingredients and utensils within arm’s reach at each station, just like fast-moving SKUs.',
        },
      },
      {
        title: {
          es: 'Planificación por franjas',
          en: 'Time-slot planning',
        },
        explanation: {
          es: 'Dimensionar personal por hora según la previsión de comandas, no por turno completo.',
          en: 'Size staffing by the hour based on forecast orders, not by the full shift.',
        },
      },
      {
        title: {
          es: 'Briefing de inicio',
          en: 'Start-of-service briefing',
        },
        explanation: {
          es: 'Cinco minutos antes del servicio para alinear platos fuera de carta, reservas y roles.',
          en: 'Five minutes before service to align specials, bookings and roles.',
        },
      },
    ],
  },
  {
    id: 'sanidad',
    name: {
      es: 'Sanidad',
      en: 'Healthcare',
    },
    icon: 'hospital',
    summary: {
      es: 'Procesos críticos donde el error tiene un coste muy alto.',
      en: 'Critical processes where errors are very costly.',
    },
    principles: [
      {
        title: {
          es: 'Verificación en origen',
          en: 'Verification at source',
        },
        explanation: {
          es: 'Confirmar medicación y material en el momento de preparar, como el escaneo de cada unidad en el pick.',
          en: 'Confirm medication and supplies at preparation time, like scanning every unit in pick.',
        },
      },
      {
        title: {
          es: 'Trabajo estandarizado',
          en: 'Standardized work',
        },
        explanation: {
          es: 'Checklists y secuencias fijas que reducen la variabilidad entre profesionales y turnos.',
          en: 'Checklists and fixed sequences that reduce variability across staff and shifts.',
        },
      },
      {
        title: {
          es: 'Gestión visual',
          en: 'Visual management',
        },
        explanation: {
          es: 'Tableros de estado de camas y quirófanos para ver cuellos de botella de un vistazo.',
          en: 'Bed and operating-room status boards to spot bottlenecks at a glance.',
        },
      },
    ],
  },
  {
    id: 'retail',
    name: {
      es: 'Retail',
      en: 'Retail',
    },
    icon: 'store',
    summary: {
      es: 'Tienda física como pequeño almacén de cara al cliente.',
      en: 'The physical store as a small customer-facing warehouse.',
    },
    principles: [
      {
        title: {
          es: 'Reposición por demanda',
          en: 'Demand-driven replenishment',
        },
        explanation: {
          es: 'Reponer lineal según ventas reales en lugar de rutinas fijas, evitando roturas de stock.',
          en: 'Restock shelves based on actual sales instead of fixed routines, avoiding stockouts.',
        },
      },
      {
        title: {
          es: 'Exactitud de inventario',
          en: 'Inventory accuracy',
        },
        explanation: {
          es: 'Conteos cíclicos frecuentes y pequeños en vez de un gran inventario anual.',
          en: 'Frequent, small cycle counts instead of one big annual stocktake.',
        },
      },
      {
        title: {
          es: 'Rutas eficientes',
          en: 'Efficient routes',
        },
        explanation: {
          es: 'Preparar pedidos online con recorridos optimizados por la planta de la tienda.',
          en: 'Pick online orders with optimized paths across the store floor.',
        },
      },
    ],
  },
  {
    id: 'construccion',
    name: {
      es: 'Construcción',
      en: 'Construction',
    },
    icon: 'hardhat',
    summary: {
      es: 'Obra como flujo de materiales y oficios coordinados.',
      en: 'The worksite as a flow of materials and coordinated trades.',
    },
    principles: [
      {
        title: {
          es: 'Just-in-time de materiales',
          en: 'Just-in-time materials',
        },
        explanation: {
          es: 'Recibir material cuando se va a usar para liberar espacio y reducir daños y robos.',
          en: 'Receive materials when they are needed to free up space and reduce damage and theft.',
        },
      },
      {
        title: {
          es: 'Seguridad primero',
          en: 'Safety first',
        },
        explanation: {
          es: 'Revisión diaria de riesgos antes de empezar, igual que la ronda de seguridad del turno.',
          en: 'Daily risk review before starting, just like the shift safety walk.',
        },
      },
      {
        title: {
          es: 'Capacidad realista',
          en: 'Realistic capacity',
        },
        explanation: {
          es: 'Planificar con rendimientos reales por cuadrilla, descontando ausencias y paradas.',
          en: 'Plan with each crew’s real output, accounting for absences and stoppages.',
        },
      },
    ],
  },
  {
    id: 'educacion',
    name: {
      es: 'Educación',
      en: 'Education',
    },
    icon: 'school',
    summary: {
      es: 'Aulas y centros con recursos y tiempos muy limitados.',
      en: 'Classrooms and schools with very limited time and resources.',
    },
    principles: [
      {
        title: {
          es: 'Objetivos visibles',
          en: 'Visible goals',
        },
        explanation: {
          es: 'Metas de sesión claras al inicio de cada clase, como el objetivo por hora en planta.',
          en: 'Clear session goals at the start of each class, like the hourly target on the floor.',
        },
      },
      {
        title: {
          es: 'Feedback en tiempo real',
          en: 'Real-time feedback',
        },
        explanation: {
          es: 'Pequeños puntos de control durante la sesión para corregir antes del examen final.',
          en: 'Small checkpoints during the session to correct course before the final exam.',
        },
      },
      {
        title: {
          es: 'Mejora continua',
          en: 'Continuous improvement',
        },
        explanation: {
          es: 'Revisar qué funcionó cada trimestre con datos sencillos y ajustar la siguiente iteración.',
          en: 'Review what worked each term with simple data and adjust the next iteration.',
        },
      },
    ],
  },
  {
    id: 'callcenter',
    name: {
      es: 'Call Center',
      en: 'Call Center',
    },
    icon: 'headset',
    summary: {
      es: 'Flujo de llamadas que se comporta como un flujo de pedidos.',
      en: 'A flow of calls that behaves like a flow of orders.',
    },
    principles: [
      {
        title: {
          es: 'Previsión de volumen',
          en: 'Volume forecasting',
        },
        explanation: {
          es: 'Modelar llamadas por intervalo para cuadrar agentes con la demanda real.',
          en: 'Model calls per interval to match agents to real demand.',
        },
      },
      {
        title: {
          es: 'Medir sin quemar',
          en: 'Measure without burning out',
        },
        explanation: {
          es: 'Equilibrar tiempo medio de gestión con calidad y pausas para evitar desgaste.',
          en: 'Balance average handling time with quality and breaks to avoid burnout.',
        },
      },
      {
        title: {
          es: 'Rotación de tareas',
          en: 'Task rotation',
        },
        explanation: {
          es: 'Alternar canales y tipos de consulta para reducir fatiga y ampliar polivalencia.',
          en: 'Alternate channels and query types to reduce fatigue and broaden skills.',
        },
      },
    ],
  },
]
