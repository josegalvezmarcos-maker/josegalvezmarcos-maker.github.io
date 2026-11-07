import { createFileRoute } from '@tanstack/react-router'
import { ShiftPlanner } from '@/components/app/tools/shift-planner'

export const Route = createFileRoute('/app/turno')({
  component: ShiftPlanner,
})
