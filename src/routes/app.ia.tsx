import { createFileRoute } from '@tanstack/react-router'
import { AiUseCases } from '@/components/tools/ai-use-cases'
import { ToolHeader } from '@/components/app/primitives'
import { useLanguage } from '@/lib/i18n'

export const Route = createFileRoute('/app/ia')({
  component: Page,
})

function Page() {
  const { tr } = useLanguage()
  return (
    <>
      <ToolHeader
        title={tr({
          es: 'Casos de IA en logística',
          en: 'AI cases in logistics',
        })}
        description={tr({
          es: 'Una guía orientativa de dónde se aplica la IA en almacén, filtrada por objetivo.',
          en: 'An indicative guide to where AI applies in the warehouse, filtered by goal.',
        })}
      />
      <AiUseCases />
    </>
  )
}
