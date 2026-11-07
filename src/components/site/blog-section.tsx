import { ArrowUpRight, Wrench } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { BLOG_POSTS, TOOL_ROUTES } from '@/data/content'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'
import { SectionHeading } from './section-heading'

export function BlogSection() {
  const { tr } = useLanguage()
  const t = useStrings().blog
  return (
    <section id="blog" className="border-t border-border/60 py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <li
              key={post.url}
              className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : undefined}
            >
              <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_20px_50px_-20px_rgb(59_130_246/0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="flex items-center justify-between">
                  <span className="font-data text-3xl font-bold text-primary/30 transition-colors group-hover:text-primary motion-reduce:transition-none">
                    {post.number}
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {tr(post.tag)}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg leading-snug font-semibold">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  >
                    {tr(post.title)}
                  </a>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tr(post.excerpt)}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                    {t.readArticle}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                  </span>
                  <Link
                    to={TOOL_ROUTES[post.toolId]}
                    className="relative z-10 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground motion-reduce:transition-none"
                  >
                    <Wrench className="size-3.5" />
                    {t.tool}
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
