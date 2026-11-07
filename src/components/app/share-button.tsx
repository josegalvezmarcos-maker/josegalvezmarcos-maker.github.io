import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { buildShareHash, type ShareableTool } from '@/lib/workspace'

export function ShareButton({ tool }: { tool: ShareableTool }) {
  const { tr } = useLanguage()
  const share = async () => {
    const hash = buildShareHash(tool)
    if (!hash) {
      toast.error(
        tr({
          es: 'Hay demasiados datos para un enlace. Usa "Descargar copia".',
          en: 'Too much data for a link. Use "Download backup".',
        }),
      )
      return
    }
    const url = `${window.location.origin}${window.location.pathname}${hash}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(tr({ es: 'Enlace copiado', en: 'Link copied' }), {
        description: tr({
          es: 'Quien lo abra verá una copia de estos datos.',
          en: 'Anyone who opens it sees a copy of this data.',
        }),
      })
    } catch {
      toast.error(
        tr({
          es: 'No se pudo copiar el enlace',
          en: 'Could not copy the link',
        }),
      )
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={() => void share()}>
      <Share2 />
      {tr({ es: 'Compartir', en: 'Share' })}
    </Button>
  )
}
