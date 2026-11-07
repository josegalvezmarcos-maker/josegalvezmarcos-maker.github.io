import { createFileRoute } from '@tanstack/react-router'
import { Templates } from '@/components/app/tools/templates'

export const Route = createFileRoute('/app/plantillas')({
  component: Templates,
})
