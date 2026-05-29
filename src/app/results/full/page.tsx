"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";
import { loadFormData, saveHistoryItem } from "@/lib/store";
import type { AIDiagnoseResponse } from "@/lib/aiTypes";

const DIMENSION_LABELS: Record<string, string> = {
  titleAttraction: "标题吸引力",
  sellingPointClarity: "卖点清晰度",
  mainImageClickPower: "主图点击力",
  purchaseDesire: "购买欲望",
  differentiation: "差异化程度",
  trustAndObjectionHandling: "信任与顾虑",
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <span className="relative">
      <button
        ref={btnRef}
        onClick={handleCopy}
        className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[10px] font-medium transition-all hover:bg-[var(--bg-alt)] hover:border-[var(--accent)]/30"
      >
        {copied ? "已复制 ✓" : label}
      </button>
      {copied && (
        <span className="toast-in absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-medium text-white shadow-lg">
          已复制到剪贴板
        </span>
      )}
    </span>
  );
}

function SectionNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">
      {n}
    </span>
  );
}

export default function FullResultsPage() {
  const [data, setData] = useState<AIDiagnoseResponse | null>(null);
  const [formData, setFormData] = useState<ReturnType<typeof loadFormData>>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [feedbackHelpful, setFeedbackHelpful] = useState<string | null>(null);
  const [priceAccept, setPriceAccept] = useState<string | null>(null);
  const [contact, setContact] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        const parsed = JSON.parse(raw);
        setData(parsed);

        saveHistoryItem({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          productName: fd.productName || fd.currentTitle.slice(0, 20),
          platform: fd.platform,
          score: parsed.overallScore,
          date: new Date().toISOString().slice(0, 10),
          isCompleted: true,
          summary: parsed.summary,
          resultJson: JSON.stringify(parsed),
        });
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!feedbackHelpful || !priceAccept) {
      alert("请先选择反馈选项（方案评价和价格接受度）");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData?.productName || "",
          category: formData?.category || "",
          platform: formData?.platform || "",
          score: data?.overallScore ?? 0,
          helpfulness: feedbackHelpful,
          pricingAcceptance: priceAccept,
          contact,
          unlocked: true,
          hasCompetitorInfo: !!(formData?.competitorTitle || formData?.competitorSellingPoints),
        }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem("diagnosis_price_survey_final", priceAccept);
        setFeedbackSent(true);
      } else {
        alert(json.error || "反馈提交失败，请稍后重试。");
      }
    } catch {
      alert("反馈提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
          <p className="text-sm text-[var(--text-muted)]">加载优化方案...</p>
        </div>
      </Section>
    );
  }

  if (notFound || !formData) {
    return (
      <Section>
        <SectionHeader label="未找到数据" title="请先填写商品信息" />
        <div className="mx-auto max-w-md text-center space-y-3">
          <Link href="/diagnose" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
            去填写商品信息
          </Link>
        </div>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section>
        <SectionHeader label="数据未找到" title="请先完成免费诊断" />
        <div className="mx-auto max-w-md text-center space-y-3">
          <Link href="/diagnose" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
            重新诊断
          </Link>
        </div>
      </Section>
    );
  }

  const { overallScore, conversionLevel, summary, scores, paidSolution } = data;
  const productName = formData.productName || formData.currentTitle.slice(0, 20);
  const hasCompetitor = !!(formData.competitorTitle || formData.competitorSellingPoints);

  return (
    <Section>
      <SectionHeader
        label="完整优化方案"
        title={`${productName} · ${formData.platform || ""}`}
        description="以下是 AI 为你生成的完整商品页优化方案，可直接用于商品发布和修改。"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Score Recap */}
        <motion.div {...stagger} transition={{ duration: 0.5 }}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <ScoreRing score={overallScore} size="md" animate />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1">{summary}</p>
                <p className="text-xs text-[var(--text-muted)]">转化风险等级：{conversionLevel}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(scores).map(([key, value]) => (
                <ScoreBar key={key} label={DIMENSION_LABELS[key] || key} score={value as number} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 1. Optimized Titles */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.08 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={1} />
              <h3 className="text-base font-semibold">优化标题 · 3个版本</h3>
            </div>
            <div className="space-y-4">
              {paidSolution.optimizedTitles.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                  className="rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-medium text-[var(--text-muted)]">版本 {i + 1}</span>
                      <p className="mt-1 text-base font-semibold leading-snug">{t.title}</p>
                      <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{t.reason}</p>
                    </div>
                    <CopyButton text={t.title} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 2. Core Selling Points */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.12 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={2} />
              <h3 className="text-base font-semibold">核心卖点 · {paidSolution.coreSellingPoints.length}条</h3>
            </div>
            <div className="space-y-3">
              {paidSolution.coreSellingPoints.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.18 + i * 0.06 }}
                  className="rounded-lg border border-[var(--border)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{sp.point}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        买家语言：{sp.customerLanguage}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        转化理由：{sp.conversionReason}
                      </p>
                    </div>
                    <CopyButton text={`${sp.point}\n${sp.customerLanguage}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 3. Main Image Copywriting */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.16 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={3} />
              <h3 className="text-base font-semibold">主图文案 · {paidSolution.mainImageCopywriting.length}张</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paidSolution.mainImageCopywriting.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  className="rounded-lg border border-[var(--border)] p-4"
                >
                  <p className="text-sm font-semibold">{img.copy}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">画面：{img.visualSuggestion}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{img.reason}</p>
                  <div className="mt-2">
                    <CopyButton text={img.copy} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 4. Detail Page Structure */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={4} />
              <h3 className="text-base font-semibold">详情页结构建议</h3>
            </div>
            <div className="space-y-3">
              {paidSolution.detailPageStructure.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.24 + i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg bg-[var(--bg-alt)] px-4 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[11px] font-medium text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{sec.section}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{sec.content}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">目的：{sec.purpose}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 5. Buyer Concerns */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.24 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={5} />
              <h3 className="text-base font-semibold">买家顾虑与FAQ</h3>
            </div>
            <div className="space-y-3">
              {paidSolution.buyerConcerns.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.28 + i * 0.05 }}
                >
                  <details className="group rounded-lg border border-[var(--border)]">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium select-none">
                      Q: {faq.concern}
                    </summary>
                    <p className="px-4 pb-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 6. Differentiation Strategy */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.28 }}>
          <Card className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <SectionNumber n={6} />
              <h3 className="text-base font-semibold">差异化策略</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {paidSolution.differentiationStrategy}
            </p>
          </Card>
        </motion.div>

        {/* 7. Competitor Comparison */}
        {hasCompetitor ? (
          <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.32 }}>
            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <SectionNumber n={7} />
                <h3 className="text-base font-semibold">竞品对比</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs font-semibold text-[var(--accent)] mb-2">你的商品</p>
                  <p className="text-sm text-[var(--text-secondary)]">{formData.currentTitle}</p>
                  {formData.currentSellingPoints && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">{formData.currentSellingPoints}</p>
                  )}
                </div>
                <div className="rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/5 p-4">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">竞品</p>
                  {formData.competitorTitle && (
                    <p className="text-sm text-[var(--text-secondary)]">{formData.competitorTitle}</p>
                  )}
                  {formData.competitorSellingPoints && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">{formData.competitorSellingPoints}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}

        {/* 8. Final Copy Block */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.36 }}>
          <Card className="p-6 sm:p-8 border-emerald-200 dark:border-emerald-900/30 ring-1 ring-emerald-500/10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                <h3 className="text-base font-semibold">可直接复制的成交文案</h3>
              </div>
              <CopyButton text={paidSolution.finalCopyBlock} label="复制全文" />
            </div>
            <div className="rounded-lg bg-[var(--bg-alt)] p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{paidSolution.finalCopyBlock}</p>
            </div>
          </Card>
        </motion.div>

        {/* Feedback */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="p-6 sm:p-8">
            <h3 className="text-base font-semibold mb-4">这个方案对你有帮助吗？</h3>
            {feedbackSent ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M3 8l3 3 7-7"/></svg>
                </div>
                <p className="text-sm font-medium">反馈已提交，感谢你的参与。</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">后续 V1 内测优惠会优先通知你。</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    { value: "helpful", label: "有帮助", desc: "方案很实用" },
                    { value: "ok", label: "一般", desc: "还可以更好" },
                    { value: "inaccurate", label: "不准确", desc: "不太符合预期" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFeedbackHelpful(opt.value)}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                        feedbackHelpful === opt.value
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 font-medium"
                          : "border-[var(--border)] hover:bg-[var(--bg-alt)]"
                      }`}
                    >
                      {opt.label}
                      <span className="ml-1 text-[11px] text-[var(--text-muted)]">{opt.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="mb-5 rounded-lg bg-[var(--bg-alt)] p-4">
                  <p className="text-xs font-medium mb-2">你能接受这个工具正式版 9.9 元/次吗？</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "yes", label: "可以" },
                      { value: "high", label: "价格偏高" },
                      { value: "no", label: "不会付费" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPriceAccept(opt.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          priceAccept === opt.value
                            ? "border-[var(--accent)] bg-[var(--accent)]/10 font-medium"
                            : "border-[var(--border)] hover:bg-[var(--bg-alt)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--bg-alt)] p-4">
                  <p className="text-xs font-medium mb-2">留下微信/邮箱，获得 V1 内测优惠和后续版本通知（选填）</p>
                  <div className="flex gap-2">
                    <input
                      className="input flex-1"
                      placeholder="微信/邮箱（选填）"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={submitting}
                      className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-dark)] disabled:opacity-50"
                    >
                      {submitting ? "提交中..." : "提交反馈"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Bottom CTAs */}
        <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.44 }} className="text-center py-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/diagnose"
              className="btn-glow inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent-glow)]"
            >
              诊断另一个商品
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
            >
              查看历史记录
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
