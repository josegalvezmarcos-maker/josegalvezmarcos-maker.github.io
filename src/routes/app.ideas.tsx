import { createFileRoute } from '@tanstack/react-router'
import { IdeaPrioritizer } from '@/components/tools/idea-prioritizer'
import { ToolHeader } from '@/components/app/primitives'
import { useLanguage } from '@/lib/i18n'

export const Route = createFileRoute('/app/ideas')({
  component: Page,
})

function Page() {
  const { tr } = useLanguage()
  return (
    <>
      <ToolHeader
        title={tr({
          es: 'Priorizador de mejoras',
          en: 'Improvement prioritizer',
        })}
        description={tr({
          es: 'Puntúa cada idea por impacto y esfuerzo. Los cambios se guardan en este navegador.',
          en: 'Score each idea by impact and effort. Changes are saved in this browser.',
        })}
      />
      <IdeaPrioritizer />
    </>
  )
}
