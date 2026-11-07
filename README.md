# Operaciones a pie de campo

Web personal de **José Antonio Gálvez Marcos** — Team Leader de Pick | Logística, Operaciones y Calidad | Máster en Gestión de la Calidad (Oviedo, Asturias).

Una sola página, en español y con tema oscuro, que reúne:

- **Hero** con enlaces al [blog](https://jagalvezmarcos.blogspot.com) y a LinkedIn.
- **Entradas del blog**: cinco tarjetas que enlazan a los artículos en Blogspot.
- **Cinco herramientas interactivas**, una por artículo:
  1. Checklist de inicio de turno (con % de avance y semáforo).
  2. Explorador de 8 casos de uso de IA en almacén, filtrable por objetivo.
  3. Priorizador de ideas con sliders de impacto/esfuerzo, orden automático, arrastrar y soltar, y matriz 2×2.
  4. Calculadora de capacidad del turno con objetivo recomendado y alerta de sobrecarga.
  5. Mapa de conceptos de la logística de pick aplicados a seis sectores.
- **Pie** con aviso de opiniones personales.

## Tecnología

TanStack Start (React 19), Vite, Tailwind CSS 4, componentes shadcn/ui, iconos lucide-react. Desplegado en Netlify. Todo funciona en el navegador; no hay backend.

## Ejecutar en local

```bash
pnpm install
pnpm dev          # http://localhost:3000
# o, con emulación de Netlify:
netlify dev
```

## Editar contenido

Todos los textos, enlaces y datos de las herramientas están en `src/data/content.ts`.
