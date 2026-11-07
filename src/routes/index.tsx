import { createFileRoute } from '@tanstack/react-router'
import { About } from '@/components/site/about'
import { BlogSection } from '@/components/site/blog-section'
import { Hero } from '@/components/site/hero'
import { Impact } from '@/components/site/impact'
import { NorthSection } from '@/components/site/north-section'
import { ScrollRail } from '@/components/site/scroll-rail'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { ToolsSection } from '@/components/site/tools-section'
import { Why } from '@/components/site/why'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <ScrollRail />
      <main>
        <Hero />
        <About />
        <Why />
        <NorthSection />
        <ToolsSection />
        <Impact />
        <BlogSection />
      </main>
      <SiteFooter />
    </div>
  )
}
