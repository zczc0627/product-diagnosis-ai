"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { loadHistory } from "@/lib/store";
import type { HistoryEntry } from "@/lib/store";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(loadHistory());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        label="历史记录"
        title="诊断记录"
        description="查看你过往的 AI 诊断结果，点击可重新查看报告。"
      />

      <div className="mx-auto max-w-3xl">
        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              还没有诊断记录
            </p>
            <Link
              href="/diagnose"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              开始第一次诊断
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                hover
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-sm font-bold text-[var(--accent)]">
                    {item.platform ? item.platform.slice(0, 2) : "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {item.productName}
                    </p>
                    {item.summary ? (
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {item.summary}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)]">
                        {item.platform} · {item.date}
                      </p>
                    )}
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {item.platform} · {item.date}
                      {!item.isCompleted && (
                        <span className="ml-2 text-amber-500">未解锁</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums">{item.score}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">综合分</p>
                  </div>
                  <Link
                    href={item.isCompleted ? "/results/full" : "/results/free"}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-alt)]"
                  >
                    查看
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            新的诊断
          </Link>
        </div>
      </div>
    </Section>
  );
}
