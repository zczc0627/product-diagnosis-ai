export function ScoreRing({
  score,
  size = "lg",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: 72, md: 100, lg: 140 };
  const fonts = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  const strokes = { sm: 6, md: 8, lg: 10 };

  const d = dims[size];
  const r = (d - strokes[size]) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-amber-500"
        : "stroke-red-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={d} height={d} className="-rotate-90">
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="stroke-[var(--border)]"
          strokeWidth={strokes[size]}
        />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          className={color}
          strokeWidth={strokes[size]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span
        className={`absolute font-bold tracking-tight ${fonts[size]}`}
      >
        {score}
      </span>
    </div>
  );
}
