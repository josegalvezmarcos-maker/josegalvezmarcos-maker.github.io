import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/site/site-header'
import { Hero } from '@/components/site/hero'
import { BlogSection } from '@/components/site/blog-section'
import { ToolsSection } from '@/components/site/tools-section'
import { SiteFooter } from '@/components/site/site-footer'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <ToolsSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </div>
  )
}
