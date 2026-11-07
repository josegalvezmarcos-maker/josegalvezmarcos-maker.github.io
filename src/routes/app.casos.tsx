import { createFileRoute } from '@tanstack/react-router'
import { SectorCases } from '@/components/app/tools/sector-cases'

export const Route = createFileRoute('/app/casos')({
  component: SectorCases,
})
