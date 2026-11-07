import { createFileRoute } from '@tanstack/react-router'
import { ShiftGame } from '@/components/app/tools/shift-game'

export const Route = createFileRoute('/app/simulador')({
  component: ShiftGame,
})
