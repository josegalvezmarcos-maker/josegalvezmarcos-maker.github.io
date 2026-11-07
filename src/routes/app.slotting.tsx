import { createFileRoute } from '@tanstack/react-router'
import { Slotting } from '@/components/app/tools/slotting'

export const Route = createFileRoute('/app/slotting')({
  component: Slotting,
})
