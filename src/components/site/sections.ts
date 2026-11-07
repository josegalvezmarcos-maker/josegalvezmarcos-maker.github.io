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
    id: 'herramientas',
    code: 'A03',
    label: { es: 'Herramientas', en: 'Tools' },
  },
  { id: 'blog', code: 'A04', label: { es: 'Blog', en: 'Blog' } },
]
