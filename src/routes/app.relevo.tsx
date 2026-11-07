import { createFileRoute } from '@tanstack/react-router'
import { Handover } from '@/components/app/tools/handover'

export const Route = createFileRoute('/app/relevo')({
  component: Handover,
})
