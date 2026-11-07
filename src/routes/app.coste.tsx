import { createFileRoute } from '@tanstack/react-router'
import { CostCalculator } from '@/components/app/tools/cost-calculator'

export const Route = createFileRoute('/app/coste')({
  component: CostCalculator,
})
