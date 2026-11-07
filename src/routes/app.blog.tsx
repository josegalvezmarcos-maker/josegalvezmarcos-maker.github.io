import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS, BLOG_URL } from '@/data/content'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/blog')({
  component: BlogReader,
})

function BlogReader() {
  const { tr } = useLanguage()
  const [url, setUrl] = useState(BLOG_URL)
  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-3 lg:flex-row">
      <nav
        aria-label={tr({ es: 'Artículos', en: 'Articles' })}
        className="flex shrink-0 gap-2 overflow-x-auto lg:w-64 lg:flex-col lg:overflow-visible"
      >
        {BLOG_POSTS.map((post) => (
          <button
            key={post.url}
            type="button"
            aria-pressed={url === post.url}
            onClick={() => setUrl(post.url)}
            className={cn(
              'w-56 shrink-0 rounded-lg border p-3 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full motion-reduce:transition-none',
              url === post.url
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/60',
            )}
          >
            <span className="font-data text-primary">{post.number}</span>
            <span className="mt-1 block font-medium">{tr(post.title)}</span>
          </button>
        ))}
        <Button variant="ghost" size="sm" asChild className="shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {tr({ es: 'Abrir en pestaña nueva', en: 'Open in a new tab' })}
            <ArrowUpRight />
          </a>
        </Button>
      </nav>
      <iframe
        key={url}
        src={url}
        title={tr({ es: 'Blog', en: 'Blog' })}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="min-h-0 w-full flex-1 rounded-xl border border-border bg-white"
      />
    </div>
  )
}
