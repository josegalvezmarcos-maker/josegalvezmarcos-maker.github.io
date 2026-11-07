import { createFileRoute } from '@tanstack/react-router'
import { PickRoute } from '@/components/app/tools/pick-route'

export const Route = createFileRoute('/app/rutas')({
  component: PickRoute,
})
