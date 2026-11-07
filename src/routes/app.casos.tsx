import { createFileRoute } from '@tanstack/react-router'
import { SectorCases } from '@/components/app/tools/sector-cases'

import { z } from 'zod'

export const Route = createFileRoute('/app/casos')({
  validateSearch: z.object({
    caso: z.enum(['frio', 'ecom', 'retail', 'jis', 'tpl']).optional(),
  }),
  component: SectorCases,
})
