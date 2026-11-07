import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Wrench } from 'lucide-react'
import { BLOG_POSTS, BLOG_URL, TOOL_ROUTES } from '@/data/content'
import { useLanguage } from '@/lib/i18n'

export function BlogSection() {
  const { tr } = useLanguage()
  return (
    <section id="blog" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-data text-xs tracking-widest text-primary uppercase">
              A04 · Blog
            </p>
            <h2 className="signage mt-5 text-4xl sm:text-6xl">
              {tr({ es: 'Notas de turno', en: 'Shift notes' })}
            </h2>
          </div>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            jagalvezmarcos.blogspot.com
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <ol className="mt-12 border-t border-border">
          {BLOG_POSTS.map((post) => (
            <li
              key={post.url}
              className="group relative border-b border-border"
            >
              <div className="grid gap-3 py-7 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-8">
                <span className="signage text-4xl text-foreground/15 transition-colors group-hover:text-primary motion-reduce:transition-none">
                  {post.number}
                </span>
                <div>
                  <p className="font-data text-[11px] tracking-widest text-muted-foreground uppercase">
                    {tr(post.tag)}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold sm:text-2xl">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring"
                    >
                      {tr(post.title)}
                    </a>
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                    {tr(post.excerpt)}
                  </p>
                </div>
                <Link
                  to={TOOL_ROUTES[post.toolId]}
                  className="relative z-10 inline-flex items-center gap-1.5 self-start rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:self-center motion-reduce:transition-none"
                >
                  <Wrench className="size-3.5" />
                  {tr(post.toolName)}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
