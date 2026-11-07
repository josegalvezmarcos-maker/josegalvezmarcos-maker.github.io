import { BLOG_POSTS, type ToolId } from '@/data/content'
import { ShiftChecklist } from '@/components/tools/shift-checklist'
import { AiUseCases } from '@/components/tools/ai-use-cases'
import { IdeaPrioritizer } from '@/components/tools/idea-prioritizer'
import { CapacityCalculator } from '@/components/tools/capacity-calculator'
import { SectorMap } from '@/components/tools/sector-map'
import { ToolShell } from '@/components/tools/tool-shell'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'
import { SectionHeading } from './section-heading'

const TOOLS: Record<ToolId, () => React.ReactNode> = {
  checklist: ShiftChecklist,
  'ia-casos': AiUseCases,
  priorizador: IdeaPrioritizer,
  capacidad: CapacityCalculator,
  'mapa-sectores': SectorMap,
}

export function ToolsSection() {
  const { tr } = useLanguage()
  const t = useStrings().tools
  return (
    <section id="herramientas" className="border-t border-border/60 py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <nav
          aria-label={t.navLabel}
          className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {BLOG_POSTS.map((post) => (
            <a
              key={post.toolId}
              href={`#${post.toolId}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground motion-reduce:transition-none"
            >
              <span className="font-data text-xs text-primary">
                {post.number}
              </span>
              {tr(post.toolName)}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-8">
          {BLOG_POSTS.map((post) => {
            const Tool = TOOLS[post.toolId]
            const copy = t.items[post.toolId]
            return (
              <ToolShell
                key={post.toolId}
                post={post}
                title={copy.title}
                description={copy.description}
              >
                <Tool />
              </ToolShell>
            )
          })}
        </div>
      </div>
    </section>
  )
}
