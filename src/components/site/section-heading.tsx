export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-data text-xs font-medium tracking-widest text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  )
}
