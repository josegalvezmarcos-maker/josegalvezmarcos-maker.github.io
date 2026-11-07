import { createFileRoute } from '@tanstack/react-router'
import { SectorMap } from '@/components/tools/sector-map'
import { ToolHeader } from '@/components/app/primitives'
import { useLanguage } from '@/lib/i18n'

export const Route = createFileRoute('/app/sectores')({
  component: Page,
})

function Page() {
  const { tr } = useLanguage()
  return (
    <>
      <ToolHeader
        title={tr({
          es: 'Del pick a otros sectores',
          en: 'From pick to other sectors',
        })}
        description={tr({
          es: 'Principios de flujo y estándar trasladados a otros sectores.',
          en: 'Flow and standard-work principles carried over to other sectors.',
        })}
      />
      <SectorMap />
    </>
  )
}
