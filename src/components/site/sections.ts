import type { Localized } from '@/lib/i18n'

export interface Section {
  id: string
  code: string
  label: Localized
}

export const SECTIONS: Section[] = [
  { id: 'inicio', code: 'A00', label: { es: 'Inicio', en: 'Home' } },
  { id: 'quien', code: 'A01', label: { es: 'Quién soy', en: 'About me' } },
  { id: 'por-que', code: 'A02', label: { es: 'Por qué', en: 'Why' } },
  {
    id: 'norte',
    code: 'A03',
    label: { es: 'Casos del norte', en: 'Northern cases' },
  },
  {
    id: 'herramientas',
    code: 'A04',
    label: { es: 'Herramientas', en: 'Tools' },
  },
  {
    id: 'aporto',
    code: 'A05',
    label: { es: 'Lo que aporto', en: 'What I bring' },
  },
  { id: 'blog', code: 'A06', label: { es: 'Blog', en: 'Blog' } },
]
