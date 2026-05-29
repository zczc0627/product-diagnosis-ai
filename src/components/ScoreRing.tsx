"use client";

import { useEffect, useState } from "react";

export function ScoreRing({
  score,
  size = "lg",
  animate = false,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}) {
  const dims = { sm: 72, md: 100, lg: 140 };
  const fonts = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  const strokes = { sm: 6, md: 8, lg: 10 };

  const d = dims[size];
  const r = (d - strokes[size]) / 2;
  const circumference = 2 * Math.PI * r;

  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [dashOffset, setDashOffset] = useState(animate ? circumference : circumference - (score / 100) * circumference);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setDashOffset(circumference - (score / 100) * circumference);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * score);
      setDisplayScore(current);
      setDashOffset(circumference - (current / 100) * circumference);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [score, animate, circumference]);

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
          strokeDashoffset={dashOffset}
          style={{ transition: animate ? "none" : "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className={`absolute font-bold tracking-tight tabular-nums ${fonts[size]}`}>
        {displayScore}
      </span>
    </div>
  );
}
