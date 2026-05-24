export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 ${
        hover
          ? "transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-sm"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
