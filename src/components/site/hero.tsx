import { ArrowUpRight, BookOpen, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BLOG_URL, LINKEDIN_URL } from '@/data/content'
import { useStrings } from '@/data/ui-strings'
import { LinkedInIcon } from './linkedin-icon'

export function Hero() {
  const t = useStrings().hero
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="floor-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto max-w-content px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-data text-[11px] font-medium tracking-widest text-primary uppercase">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {t.eyebrow}
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
          José Antonio
          <br />
          <span className="bg-gradient-to-r from-white via-blue-200 to-primary bg-clip-text text-transparent">
            Gálvez Marcos
          </span>
        </h1>

        <ul className="mt-6 flex flex-wrap gap-2">
          {t.roles.map((tag, i) => (
            <li
              key={tag}
              className={
                i === 0
                  ? 'rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                  : 'rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground/90'
              }
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 text-primary" />
          {t.location}
        </p>

        <p className="mt-6 max-w-reading text-lg leading-relaxed text-muted-foreground">
          {t.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
              <BookOpen />
              {t.viewBlog}
              <ArrowUpRight className="opacity-70" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-6 text-base"
          >
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </Button>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card/60 backdrop-blur">
          {t.stats.map((s) => (
            <div key={s.label} className="px-4 py-4 sm:px-6">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-data text-2xl font-bold text-foreground sm:text-3xl">
                {s.value}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
