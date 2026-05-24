export function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="h-2 flex-1 rounded-full bg-[var(--border)]">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium tabular-nums">
        {score}
      </span>
    </div>
  );
}
