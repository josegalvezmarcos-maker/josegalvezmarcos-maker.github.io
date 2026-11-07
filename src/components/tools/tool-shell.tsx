import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@/data/content'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'

export function ToolShell({
  post,
  title,
  description,
  children,
}: {
  post: BlogPost
  title: string
  description: string
  children: React.ReactNode
}) {
  const { tr } = useLanguage()
  const t = useStrings().tools
  return (
    <section
      id={post.toolId}
      aria-labelledby={`${post.toolId}-title`}
      className="rounded-3xl border border-border bg-card/70 p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:p-8"
    >
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-data text-xs font-medium tracking-widest text-primary uppercase">
            {t.toolNumber(post.number)}
          </p>
          <h3
            id={`${post.toolId}-title`}
            className="mt-2 font-display text-2xl font-bold sm:text-3xl"
          >
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground sm:self-auto motion-reduce:transition-none"
        >
          {t.article}: {tr(post.title)}
          <ArrowUpRight className="size-3.5" />
        </a>
      </header>
      <div className="pt-6">{children}</div>
    </section>
  )
}
