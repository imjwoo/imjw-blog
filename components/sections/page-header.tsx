export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-16 max-w-3xl">
      <p className="section-label">{eyebrow}</p>
      <h1 className="mt-5 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
      <p className="mt-6 text-base leading-8 text-muted-foreground">{description}</p>
    </header>
  );
}
