import { HardDrive, HeartHandshake, Warehouse } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function Why() {
  const { tr } = useLanguage()
  const reasons = [
    {
      icon: Warehouse,
      title: tr({ es: 'Desde la planta', en: 'From the floor' }),
      text: tr({
        es: 'Casi todo lo que se escribe sobre logística se escribe desde un despacho. Esto sale de turnos reales: de lo que funciona a las seis de la mañana y de lo que no.',
        en: 'Most of what is written about logistics is written from an office. This comes from real shifts: what works at six in the morning and what does not.',
      }),
    },
    {
      icon: HeartHandshake,
      title: tr({ es: 'Medir sin quemar', en: 'Measure without burning out' }),
      text: tr({
        es: 'Las herramientas buscan repartir mejor la carga y quitar metros, no apretar más el ritmo. Cuando no llega, lo dicen: hace falta gente u horario, no presión.',
        en: 'The tools aim to balance load and remove metres, not to push pace harder. When it does not add up, they say so: it needs people or hours, not pressure.',
      }),
    },
    {
      icon: HardDrive,
      title: tr({ es: 'Gratis y sin registro', en: 'Free, no sign-up' }),
      text: tr({
        es: 'Abres, usas y te vas. Tus datos se quedan en tu navegador; nada viaja a un servidor. Si te sirve, cuéntame qué le falta.',
        en: 'Open it, use it, leave. Your data stays in your browser; nothing goes to a server. If it helps, tell me what is missing.',
      }),
    },
  ]

  return (
    <section
      id="por-que"
      className="relative scroll-mt-20 overflow-hidden border-b border-border/60 bg-card/40 py-24"
    >
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <p className="font-data text-xs tracking-widest text-primary uppercase">
          A02 · {tr({ es: 'Por qué existe esto', en: 'Why this exists' })}
        </p>
        <h2 className="signage mt-5 max-w-4xl text-4xl sm:text-6xl">
          {tr({
            es: 'Un turno no se gana con una hoja de cálculo.',
            en: 'A shift is not won with a spreadsheet.',
          })}
        </h2>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {reasons.map((r, i) => (
            <li
              key={r.title}
              className="group relative bg-background p-7 sm:p-8"
            >
              <span className="signage pointer-events-none absolute top-5 right-6 text-6xl text-foreground/[0.06] transition-colors group-hover:text-primary/20 motion-reduce:transition-none">
                0{i + 1}
              </span>
              <r.icon className="size-7 text-primary" />
              <h3 className="mt-6 font-display text-xl font-bold">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
