import { createFileRoute } from '@tanstack/react-router'
import { NorthMap } from '@/components/app/tools/north-map'

export const Route = createFileRoute('/app/mapa')({
  component: NorthMap,
})
