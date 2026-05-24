export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  description,
  center = false,
}: {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      {label && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          {label}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
