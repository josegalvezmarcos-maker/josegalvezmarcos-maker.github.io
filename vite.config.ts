import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      pages: [
        { path: '/' },
        { path: '/fuentes' },
        ...[
          'casos',
          'kpis',
          'turno',
          'rutas',
          'slotting',
          'cortes',
          'relevo',
          'ideas',
          'ia',
          'sectores',
          'blog',
        ].map((tool) => ({ path: `/app/${tool}` })),
        { path: '/app' },
      ],
    }),
    viteReact(),
  ],
})

export default config
