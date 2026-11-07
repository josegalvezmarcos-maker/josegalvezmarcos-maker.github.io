import { useState } from 'react'
import { ExternalLink, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LINKEDIN_URL, REPO_URL } from '@/data/content'
import { useLanguage } from '@/lib/i18n'
import { Segmented } from './primitives'

type Kind = 'idea' | 'bug' | 'case'

export function FeedbackDialog({
  context,
  trigger,
}: {
  context: string
  trigger?: React.ReactNode
}) {
  const { tr } = useLanguage()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<Kind>('idea')
  const [message, setMessage] = useState('')

  const kinds: { value: Kind; label: string }[] = [
    { value: 'idea', label: tr({ es: 'Mejora', en: 'Improvement' }) },
    { value: 'case', label: tr({ es: 'Mi caso real', en: 'My real case' }) },
    { value: 'bug', label: tr({ es: 'Algo falla', en: 'Something broke' }) },
  ]
  const kindLabel = kinds.find((k) => k.value === kind)?.label ?? ''
  const firstLine = message.trim().split('\n')[0].slice(0, 70)
  const issueUrl = `${REPO_URL}/issues/new?title=${encodeURIComponent(
    `[${kindLabel}] ${firstLine}`,
  )}&body=${encodeURIComponent(`${message.trim()}\n\n---\n${context}`)}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <MessageSquarePlus />
            {tr({ es: 'Feedback', en: 'Feedback' })}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tr({
              es: '¿Qué le falta para tu día a día?',
              en: 'What is missing for your daily work?',
            })}
          </DialogTitle>
          <DialogDescription>
            {tr({
              es: 'Se publica como comentario público en GitHub (hace falta cuenta gratuita). No incluyas datos de tu empresa.',
              en: 'It is posted publicly on GitHub (a free account is required). Do not include company data.',
            })}
          </DialogDescription>
        </DialogHeader>
        <Segmented
          label={tr({ es: 'Tipo', en: 'Type' })}
          value={kind}
          options={kinds}
          onChange={setKind}
        />
        <label className="block">
          <span className="sr-only">
            {tr({ es: 'Tu comentario', en: 'Your comment' })}
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={1500}
            placeholder={tr({
              es: 'Ej.: en mi almacén los pasillos tienen un solo acceso…',
              en: 'E.g. in my warehouse the aisles have a single entrance…',
            })}
            className="w-full resize-y rounded-md border border-input bg-background/60 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" asChild>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              {tr({ es: 'Prefiero LinkedIn', en: 'I prefer LinkedIn' })}
            </a>
          </Button>
          {message.trim() ? (
            <Button asChild>
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {tr({ es: 'Continuar en GitHub', en: 'Continue on GitHub' })}
                <ExternalLink />
              </a>
            </Button>
          ) : (
            <Button disabled>
              {tr({ es: 'Continuar en GitHub', en: 'Continue on GitHub' })}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
