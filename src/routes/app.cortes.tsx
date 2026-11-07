import { createFileRoute } from '@tanstack/react-router'
import { Cutoffs } from '@/components/app/tools/cutoffs'

export const Route = createFileRoute('/app/cortes')({
  component: Cutoffs,
})
