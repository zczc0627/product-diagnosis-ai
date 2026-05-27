"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";
import { PaywallModal } from "@/components/PaywallModal";
import { loadFormData } from "@/lib/store";
import type { AIDiagnoseResponse } from "@/lib/aiTypes";

const DIMENSION_LABELS: Record<string, string> = {
  titleAttraction: "标题吸引力",
  sellingPointClarity: "卖点清晰度",
  mainImageClickPower: "主图点击力",
  purchaseDesire: "购买欲望",
  differentiation: "差异化程度",
  trustAndObjectionHandling: "信任与顾虑",
};

const CONVERSION_LEVEL_COLORS: Record<string, string> = {
  "高": "text-emerald-500",
  "中": "text-amber-500",
  "低": "text-red-500",
};

export default function FreeResultsPage() {
  const [data, setData] = useState<AIDiagnoseResponse | null>(null);
  const [formData, setFormData] = useState<ReturnType<typeof loadFormData>>(null);
  const [notFound, setNotFound] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fd = loadFormData();
    if (!fd) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setFormData(fd);
    try {
      const raw = localStorage.getItem("diagnosis_ai_result");
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch { /* use fallback */ }
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

  if (notFound || !formData) {
    return (
      <Section>
        <SectionHeader
          label="未找到数据"
          title="请先填写商品信息"
          description="需要先提交商品信息才能查看诊断结果。"
        />
        <div className="mx-auto max-w-md text-center">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            去填写商品信息
          </Link>
        </div>
      </Section>
    );
  }

  // Fallback: if no AI result, show error with link back
  if (!data) {
    return (
      <Section>
        <SectionHeader
          label="诊断结果未生成"
          title="请重新提交商品信息"
          description="诊断数据可能已过期，请重新诊断。"
        />
        <div className="mx-auto max-w-md text-center">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            重新诊断
          </Link>
        </div>
      </Section>
    );
  }

  const { overallScore, conversionLevel, summary, scores, freeProblems, freeSuggestion, paidPreview } = data;
  const productName = formData.productName || formData.currentTitle.slice(0, 20);

  return (
    <Section>
      <SectionHeader
        label="免费诊断结果"
        title={`${productName} · ${formData.platform || ""}`}
        description="以下是 AI 对你商品页的免费诊断摘要。解锁付费方案获取完整优化。"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Score Overview */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center shrink-0">
              <ScoreRing score={overallScore} size="lg" />
              <p className={`mt-2 text-xs font-semibold ${CONVERSION_LEVEL_COLORS[conversionLevel] || "text-[var(--text-muted)]"}`}>
                转化风险：{conversionLevel}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-3">AI 诊断总结</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{summary}</p>
            </div>
          </div>
        </Card>

        {/* 6 Dimension Scores */}
        <Card className="p-6 sm:p-8">
          <h3 className="text-sm font-semibold mb-4">六维度转化力评分</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(scores).map(([key, value]) => (
              <ScoreBar
                key={key}
                label={DIMENSION_LABELS[key] || key}
                score={value as number}
              />
            ))}
          </div>
        </Card>

        {/* Free Problems (3 items) */}
        <Card className="p-6 sm:p-8">
          <h3 className="text-sm font-semibold mb-4">
            发现 {freeProblems.length} 个核心问题
          </h3>
          <div className="space-y-3">
            {freeProblems.map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/20 p-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-[11px] font-bold text-red-600 dark:text-red-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{problem.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {problem.description}
                  </p>
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
                    影响：{problem.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Free Suggestion */}
        <Card className="p-6 sm:p-8 border-emerald-200 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              ✓
            </span>
            <h3 className="text-sm font-semibold">免费优化建议</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{freeSuggestion}</p>
        </Card>

        {/* Paid Preview — Unlock CTA */}
        <Card className="p-6 sm:p-8 border-[var(--accent)] ring-1 ring-[var(--accent)]/20"
        >
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-medium text-[var(--accent)]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 6a3 3 0 116 0v1h1a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h1V6z" />
              </svg>
              付费解锁
            </span>
          </div>

          <h3 className="text-lg font-semibold text-center mb-2">
            免费诊断告诉你问题在哪
            <br />
            <span className="text-[var(--accent)]">完整方案直接告诉你怎么改</span>
          </h3>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-5">
            {paidPreview.unlockReason}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            {paidPreview.includedItems.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-emerald-500">
                  <path d="M3 8l3 3 7-7" />
                </svg>
                <span className="text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setPaywallOpen(true)}
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/20"
            >
              9.9 元解锁完整方案
            </button>
            <Link
              href="/diagnose"
              className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-center transition-colors hover:bg-[var(--bg-alt)]"
            >
              诊断另一个商品
            </Link>
          </div>
          <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">
            不满意全额退款 · V0 验证版限时特惠
          </p>
        </Card>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </Section>
  );
}
