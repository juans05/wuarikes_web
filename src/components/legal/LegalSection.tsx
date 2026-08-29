export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-white">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-neutral-500">{children}</div>
    </section>
  );
}
