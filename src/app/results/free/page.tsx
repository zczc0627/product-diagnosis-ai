"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";
import { PaywallModal } from "@/components/PaywallModal";
import { loadFormData } from "@/lib/store";
import { generateDiagnosis } from "@/lib/generate";
import type { DiagnosticResult } from "@/lib/types";

const pricingPlans = [
  {
    name: "免费诊断",
    price: "0",
    description: "了解你的商品页问题在哪",
    features: ["综合评分", "5维度评分", "3个核心问题", "1条优化建议"],
    current: true,
  },
  {
    name: "单商品完整优化",
    price: "9.9",
    description: "一个商品的全套优化方案",
    features: ["3版优化标题", "5条核心卖点", "5张主图方案", "详情页结构", "用户顾虑FAQ", "差异化方向"],
    highlighted: true,
    current: false,
  },
  {
    name: "早鸟5次包",
    price: "39",
    description: "适合多商品商家",
    features: ["5个商品完整优化", "包含单商品全套内容", "优先体验新功能", "早鸟专属优惠"],
    current: false,
  },
];

export default function FreeResultsPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    const formData = loadFormData();
    if (!formData) {
      setNotFound(true);
      return;
    }
    const diag = generateDiagnosis(formData);
    setResult(diag);
  }, []);

  if (notFound) {
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

  if (!result) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      </Section>
    );
  }

  const { productName, platform, score, issues, originalTitle, freeOptimizations, fullResult } = result;

  return (
    <Section>
      <SectionHeader
        label="免费诊断结果"
        title={`${productName} · ${platform}`}
        description="以下是 AI 对你商品页的免费诊断摘要。解锁付费方案获取完整优化。"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Score Overview */}
        <Card className="p-8">
          <h3 className="text-sm font-semibold mb-6">综合评分</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ScoreRing score={score.overall} size="lg" />
            <div className="flex-1 space-y-3 w-full">
              <ScoreBar label="标题吸引力" score={score.titleAttractiveness} />
              <ScoreBar label="卖点清晰度" score={score.clarityOfSellingPoints} />
              <ScoreBar label="主图点击力" score={score.mainImageClickability} />
              <ScoreBar label="用户购买欲" score={score.purchaseDesire} />
              <ScoreBar label="差异化程度" score={score.differentiation} />
            </div>
          </div>
        </Card>

        {/* Issues — only show top 3 */}
        <Card className="p-8">
          <h3 className="text-sm font-semibold mb-4">
            发现 {issues.length} 个问题（展示前3个）
          </h3>
          <div className="space-y-3">
            {issues.slice(0, 3).map((issue) => (
              <div
                key={issue.id}
                className={`flex items-start gap-3 rounded-lg p-4 ${
                  issue.severity === "critical"
                    ? "bg-red-50 dark:bg-red-950/20"
                    : issue.severity === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/20"
                      : "bg-blue-50 dark:bg-blue-950/20"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    issue.severity === "critical"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : issue.severity === "warning"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {issue.severity === "critical" ? "!" : issue.severity === "warning" ? "~" : "i"}
                </span>
                <div>
                  <p className="text-sm font-semibold">{issue.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {issues.length > 3 && (
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              还有 {issues.length - 3} 个问题待解锁后查看
            </p>
          )}
        </Card>

        {/* Partial Optimization — only 1 tip */}
        <Card className="p-8">
          <h3 className="text-sm font-semibold mb-2">优化建议预览（仅展示1条）</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            完整版包含 3 个标题版本 + 5 条卖点 + 5 张主图方案 + 详情页结构。
          </p>

          <div className="rounded-lg border border-[var(--border)] p-4 mb-3">
            <p className="text-[11px] text-[var(--text-muted)] mb-1">原始标题</p>
            <p className="text-sm text-[var(--text-secondary)] line-through">
              {originalTitle}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10 p-4">
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mb-1">
              优化建议 #1
            </p>
            <p className="text-sm font-semibold">
              {freeOptimizations[0].title}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {freeOptimizations[0].reasoning}
            </p>
          </div>

          {/* Locked content block */}
          <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-alt)] p-5">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-medium text-[var(--accent)]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5 6a3 3 0 116 0v1h1a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h1V6z"/></svg>
                付费解锁
              </span>
            </div>
            <p className="text-sm font-semibold text-center mb-3">
              解锁完整优化方案
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)]">
              {[
                `3版优化标题（含${productName}专属版本）`,
                `5条核心卖点`,
                "5张主图文案概念",
                "详情页结构建议",
                "用户顾虑FAQ解答",
                "差异化卖点方向",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0"><path d="M3 8l3 3 7-7"/></svg>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => setPaywallOpen(true)}
                className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
              >
                9.9 元解锁完整方案
              </button>
              <button
                onClick={() => setPaywallOpen(true)}
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
              >
                先免费体验一次
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
              解锁后可在完整方案页查看所有内容
            </p>
          </div>
        </Card>

        {/* Pricing comparison */}
        <Card className="p-8">
          <h3 className="text-sm font-semibold mb-4">选择适合你的方案</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-4 ${
                  plan.highlighted
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : plan.current
                      ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-950/5"
                      : "border-[var(--border)]"
                }`}
              >
                {plan.highlighted && (
                  <p className="mb-2 text-[10px] font-semibold text-[var(--accent)]">推荐</p>
                )}
                <p className="text-sm font-semibold">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold">
                  ¥{plan.price}
                  {plan.price !== "0" && (
                    <span className="text-xs font-normal text-[var(--text-muted)]">/次</span>
                  )}
                </p>
                <p className="mt-1 text-[11px] text-[var(--text-muted)]">{plan.description}</p>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-[var(--text-secondary)]">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0"><path d="M3 8l3 3 7-7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setPaywallOpen(true)}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)]"
                      : plan.current
                        ? "bg-emerald-500 text-white"
                        : "border border-[var(--border)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  {plan.price === "0" ? "当前方案" : "获取方案"}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            已有 1,200+ 商家通过完整优化方案提升了商品转化
          </p>
          <button
            onClick={() => setPaywallOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            9.9 元解锁完整优化方案
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            不满意全额退款 · V0 验证版限时特惠
          </p>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </Section>
  );
}
