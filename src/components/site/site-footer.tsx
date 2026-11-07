import { BookOpen } from 'lucide-react'
import { BLOG_URL, LINKEDIN_URL } from '@/data/content'
import { useStrings } from '@/data/ui-strings'
import { LinkedInIcon } from './linkedin-icon'

export function SiteFooter() {
  const t = useStrings().footer
  return (
    <footer className="border-t border-border/60 bg-[#0b1222]">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold">
            José Antonio Gálvez Marcos
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t.disclaimer}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground motion-reduce:transition-none"
          >
            <BookOpen className="size-4" />
            jagalvezmarcos.blogspot.com
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.linkedin}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none"
          >
            <LinkedInIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
