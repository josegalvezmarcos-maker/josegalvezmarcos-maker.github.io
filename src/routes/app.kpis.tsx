import { createFileRoute } from '@tanstack/react-router'
import { KpiBoard } from '@/components/app/tools/kpi-board'

export const Route = createFileRoute('/app/kpis')({
  component: KpiBoard,
})
