"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";
import { loadFormData, saveHistoryItem, saveFeedback } from "@/lib/store";
import type { FeedbackEntry } from "@/lib/store";
import { generateDiagnosis } from "@/lib/generate";
import type { DiagnosticResult, ProductInput } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[10px] font-medium transition-colors hover:bg-[var(--bg-alt)]"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

export default function FullResultsPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [formData, setFormData] = useState<ProductInput | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [feedbackHelpful, setFeedbackHelpful] = useState<string | null>(null);
  const [priceAccept, setPriceAccept] = useState<string | null>(null);
  const [contact, setContact] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const data = loadFormData();
    if (!data) {
      setNotFound(true);
      return;
    }
    setFormData(data);
    const diag = generateDiagnosis(data);
    setResult(diag);

    // Mark the incomplete history item as completed
    saveHistoryItem({
      id: diag.id,
      productName: diag.productName,
      platform: diag.platform,
      score: diag.score.overall,
      date: new Date().toISOString().slice(0, 10),
      isCompleted: true,
    });
  }, []);

  const handleFeedbackSubmit = () => {
    if (!result || !formData) return;
    if (!feedbackHelpful || !priceAccept) {
      alert("请先选择反馈选项（方案评价和价格接受度）");
      return;
    }
    const entry: FeedbackEntry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productName: result.productName,
      category: formData.category || "",
      platform: result.platform,
      score: result.score.overall,
      helpfulness: feedbackHelpful,
      pricingAcceptance: priceAccept,
      contact,
      createdAt: new Date().toISOString(),
      unlocked: true,
      hasCompetitorInfo: hasCompetitor,
    };
    saveFeedback(entry);
    localStorage.setItem("diagnosis_price_survey_final", priceAccept);
    setFeedbackSent(true);
  };

  if (notFound) {
    return (
      <Section>
        <SectionHeader
          label="未找到数据"
          title="请先填写商品信息"
          description="需要先提交商品信息并解锁方案才能查看完整结果。"
        />
        <div className="mx-auto max-w-md text-center space-y-3">
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

  if (!result || !formData) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      </Section>
    );
  }

  const { productName, platform, score, originalTitle, fullResult } = result;
  const hasCompetitor = !!(formData.competitorTitle || formData.competitorSellingPoints);

  return (
    <Section>
      <SectionHeader
        label="完整优化方案"
        title={`${productName} · ${platform}`}
        description="以下是 AI 为你生成的完整商品页优化方案，可直接用于商品发布和修改。"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Score Recap */}
        <Card className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ScoreRing score={score.overall} size="md" />
            <div className="flex-1 space-y-3 w-full">
              <ScoreBar label="标题吸引力" score={score.titleAttractiveness} />
              <ScoreBar label="卖点清晰度" score={score.clarityOfSellingPoints} />
              <ScoreBar label="主图点击力" score={score.mainImageClickability} />
              <ScoreBar label="用户购买欲" score={score.purchaseDesire} />
              <ScoreBar label="差异化程度" score={score.differentiation} />
            </div>
          </div>
        </Card>

        {/* ─── 1. Optimized Titles ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">1</span>
              <h3 className="text-base font-semibold">优化标题 · 3个版本</h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              可用于商品标题、短视频挂车标题、商品卡标题
            </span>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-4 mb-4 bg-[var(--bg-alt)]">
            <p className="text-[11px] text-[var(--text-muted)] mb-1">原始标题</p>
            <p className="text-sm text-[var(--text-secondary)] line-through">
              {originalTitle}
            </p>
          </div>

          <div className="space-y-4">
            {fullResult.optimizedTitles.map((t) => (
              <div
                key={t.version}
                className="rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-[var(--text-muted)]">版本 {t.version}</span>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        {t.expectedCTR}
                      </span>
                    </div>
                    <p className="text-base font-semibold leading-snug">{t.title}</p>
                    <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                      {t.reasoning}
                    </p>
                  </div>
                  <CopyButton text={t.title} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 2. Selling Points ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">2</span>
              <h3 className="text-base font-semibold">核心卖点 · 5条</h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              可用于详情页首屏、商品卖点栏、客服话术
            </span>
          </div>
          <div className="space-y-3">
            {fullResult.sellingPoints.map((sp) => (
              <div
                key={sp.title}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-md bg-[var(--accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                      {sp.angle}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{sp.title}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                        {sp.description}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={`${sp.title}\n${sp.description}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 3. Main Image Concepts ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">3</span>
              <h3 className="text-base font-semibold">主图文案 · 5张</h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              可直接交给设计师做主图和卖点图
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fullResult.mainImageConcepts.map((img) => (
              <div
                key={img.version}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <p className="text-sm font-semibold">{img.concept}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {img.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[var(--accent)] font-medium">
                    {img.expectedImpact}
                  </span>
                  <CopyButton text={img.description} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 4. Detail Page Structure ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">4</span>
              <h3 className="text-base font-semibold">详情页结构建议</h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              可用于详情页排版和运营改版
            </span>
          </div>
          <div className="space-y-2">
            {fullResult.detailPageStructure.map((screen, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-[var(--bg-alt)] px-4 py-2.5 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[11px] font-medium text-[var(--accent)]">
                  {i + 1}
                </span>
                <span>{screen}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 5. FAQ ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">5</span>
              <h3 className="text-base font-semibold">用户顾虑 FAQ</h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              可用于详情页底部、客服快捷回复、直播间答疑
            </span>
          </div>
          <div className="space-y-3">
            {fullResult.userFAQs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-[var(--border)]"
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium select-none">
                  Q: {faq.question}
                </summary>
                <p className="px-4 pb-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Card>

        {/* ─── 6. Differentiation ─── */}
        <Card className="p-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">6</span>
            <h3 className="text-base font-semibold">差异化卖点</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {fullResult.differentiationPoints.map((pt) => (
              <div
                key={pt}
                className="flex items-center gap-2 rounded-lg bg-[var(--bg-alt)] px-3 py-2.5 text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-[var(--accent)]">
                  <path d="M3 8l3 3 7-7" />
                </svg>
                {pt}
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 7. Competitor Comparison ─── */}
        {hasCompetitor ? (
          <Card className="p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">7</span>
              <h3 className="text-base font-semibold">竞品对比分析</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Your product */}
              <div className="rounded-xl border border-[var(--border)] p-5">
                <p className="text-xs font-semibold text-[var(--accent)] mb-2">你的商品</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">标题</p>
                    <p className="text-[var(--text-secondary)]">{originalTitle}</p>
                  </div>
                  {formData.currentSellingPoints && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">卖点</p>
                      <p className="text-[var(--text-secondary)]">{formData.currentSellingPoints}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Competitor */}
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/5 p-5">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">竞品</p>
                <div className="space-y-2 text-sm">
                  {formData.competitorTitle && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">标题</p>
                      <p className="text-[var(--text-secondary)]">{formData.competitorTitle}</p>
                    </div>
                  )}
                  {formData.competitorSellingPoints && (
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">卖点</p>
                      <p className="text-[var(--text-secondary)]">{formData.competitorSellingPoints}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[var(--bg-alt)] p-4">
              <p className="text-xs font-semibold mb-2">AI 分析：你可以这样与竞品差异化</p>
              <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-[var(--accent)]"><path d="M3 8l3 3 7-7"/></svg>
                  对比竞品标题风格，你的标题可以更突出使用场景和体验感受
                </li>
                <li className="flex items-start gap-2">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-[var(--accent)]"><path d="M3 8l3 3 7-7"/></svg>
                  竞品卖点分析完毕后，你可以聚焦一个差异化优势（见上方「差异化卖点」）
                </li>
                <li className="flex items-start gap-2">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-[var(--accent)]"><path d="M3 8l3 3 7-7"/></svg>
                  在详情页中主动对比竞品并突出你的优势点，减少用户货比三家的流失
                </li>
              </ul>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--border)] text-xs text-[var(--text-muted)]">7</span>
              <h3 className="text-base font-semibold text-[var(--text-secondary)]">竞品对比分析</h3>
            </div>
            <div className="text-center py-6 text-[var(--text-muted)]">
              <p className="text-sm">未填写竞品信息</p>
              <p className="mt-1 text-xs">
                补充竞品标题和卖点后，可以生成更准确的差异化方案。
              </p>
              <Link
                href="/diagnose"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                重新填写，补充竞品信息
              </Link>
            </div>
          </Card>
        )}

        {/* ─── 8. Feedback & Lead Capture ─── */}
        <Card className="p-8">
          <h3 className="text-base font-semibold mb-4">这个方案对你有帮助吗？</h3>

          {feedbackSent ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M3 8l3 3 7-7"/></svg>
              </div>
              <p className="text-sm font-medium">感谢你的反馈！</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">我们会根据反馈持续优化产品。</p>
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

              {/* Price acceptance */}
              <div className="mb-5 rounded-lg bg-[var(--bg-alt)] p-4">
                <p className="text-xs font-medium mb-2">
                  你能接受这个工具正式版 9.9 元/次吗？
                </p>
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
                <p className="text-xs font-medium mb-2">
                  留下微信/邮箱，获得 V0 内测优惠和后续版本通知（选填）
                </p>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="微信/邮箱（选填）"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                  <button
                    onClick={handleFeedbackSubmit}
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-dark)]"
                  >
                    提交反馈
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                  不会发送垃圾邮件，仅在版本更新和内测邀请时联系。
                </p>
              </div>
            </>
          )}
        </Card>

        {/* Bottom CTAs */}
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            这个方案帮到你了吗？
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/diagnose"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
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
        </div>
      </div>
    </Section>
  );
}
