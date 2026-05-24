"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
interface FeedbackEntry {
  id: string;
  productName: string;
  category: string;
  platform: string;
  score: number;
  helpfulness: string;
  pricingAcceptance: string;
  contact: string;
  createdAt: string;
  unlocked: boolean;
  hasCompetitorInfo: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  douyin: "抖音",
  xiaohongshu: "小红书",
  taobao: "淘宝",
  pinduoduo: "拼多多",
  standalone: "独立站",
};

const HELPFULNESS_LABELS: Record<string, string> = {
  helpful: "有帮助",
  ok: "一般",
  inaccurate: "不准确",
};

const PRICING_LABELS: Record<string, string> = {
  yes: "可以接受",
  high: "价格偏高",
  no: "不会付费",
};

function exportCSV(feedbacks: FeedbackEntry[]) {
  const headers = [
    "商品名称", "品类", "平台", "评分", "方案评价", "价格接受度",
    "联系方式", "已解锁", "有竞品信息", "提交时间",
  ];
  const rows = feedbacks.map((f) => [
    f.productName,
    f.category,
    PLATFORM_LABELS[f.platform] || f.platform,
    f.score,
    HELPFULNESS_LABELS[f.helpfulness] || f.helpfulness,
    PRICING_LABELS[f.pricingAcceptance] || f.pricingAcceptance,
    f.contact,
    f.unlocked ? "是" : "否",
    f.hasCompetitorInfo ? "是" : "否",
    f.createdAt,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const BOM = "﻿";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `反馈记录_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [pricingFilter, setPricingFilter] = useState("");
  const [helpfulnessFilter, setHelpfulnessFilter] = useState("");

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setFeedbacks(json.data);
        } else {
          setError(json.error || "加载失败");
        }
      })
      .catch(() => setError("加载失败，请稍后重试。"))
      .finally(() => setLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    return feedbacks.filter((f) => {
      if (platformFilter && f.platform !== platformFilter) return false;
      if (pricingFilter && f.pricingAcceptance !== pricingFilter) return false;
      if (helpfulnessFilter && f.helpfulness !== helpfulnessFilter) return false;
      return true;
    });
  }, [feedbacks, platformFilter, pricingFilter, helpfulnessFilter]);

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const acceptPrice = feedbacks.filter((f) => f.pricingAcceptance === "yes").length;
    const hasContact = feedbacks.filter((f) => f.contact.trim() !== "").length;
    const foundHelpful = feedbacks.filter((f) => f.helpfulness === "helpful").length;
    return {
      total,
      acceptPrice,
      acceptPriceRate: total ? Math.round((acceptPrice / total) * 100) : 0,
      hasContact,
      hasContactRate: total ? Math.round((hasContact / total) * 100) : 0,
      foundHelpful,
      foundHelpfulRate: total ? Math.round((foundHelpful / total) * 100) : 0,
    };
  }, [feedbacks]);

  const platforms = useMemo(
    () => [...new Set(feedbacks.map((f) => f.platform))].filter(Boolean),
    [feedbacks]
  );

  if (!loaded) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      </Section>
    );
  }

  if (error && feedbacks.length === 0) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center py-20">
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            重新加载
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        label="反馈记录"
        title="用户反馈数据"
        description="查看用户对诊断方案的反馈，了解定价接受度和满意度。数据存储在 Supabase 数据库，所有用户提交的反馈都会汇总到这里。"
      />

      <div className="mx-auto max-w-4xl space-y-6">
        {feedbacks.length === 0 ? (
          /* Empty state */
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-alt)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1">暂无反馈记录</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              用户查看完整优化方案并提交反馈后，数据会出现在这里。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/diagnose"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
              >
                去诊断一个商品
              </Link>
              <Link
                href="/results/full"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
              >
                查看完整方案
              </Link>
            </div>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5">
                <p className="text-[11px] text-[var(--text-muted)]">总反馈数</p>
                <p className="mt-1 text-2xl font-bold">{stats.total}</p>
              </Card>
              <Card className="p-5">
                <p className="text-[11px] text-[var(--text-muted)]">愿意接受 9.9 元</p>
                <p className="mt-1 text-2xl font-bold">
                  {stats.acceptPrice}
                  <span className="ml-1.5 text-sm font-normal text-[var(--text-muted)]">
                    {stats.acceptPriceRate}%
                  </span>
                </p>
                <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${stats.acceptPriceRate}%` }}
                  />
                </div>
              </Card>
              <Card className="p-5">
                <p className="text-[11px] text-[var(--text-muted)]">留下联系方式</p>
                <p className="mt-1 text-2xl font-bold">
                  {stats.hasContact}
                  <span className="ml-1.5 text-sm font-normal text-[var(--text-muted)]">
                    {stats.hasContactRate}%
                  </span>
                </p>
                <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{ width: `${stats.hasContactRate}%` }}
                  />
                </div>
              </Card>
              <Card className="p-5">
                <p className="text-[11px] text-[var(--text-muted)]">觉得有帮助</p>
                <p className="mt-1 text-2xl font-bold">
                  {stats.foundHelpful}
                  <span className="ml-1.5 text-sm font-normal text-[var(--text-muted)]">
                    {stats.foundHelpfulRate}%
                  </span>
                </p>
                <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${stats.foundHelpfulRate}%` }}
                  />
                </div>
              </Card>
            </div>

            {/* Filters + Export */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="input rounded-lg px-3 py-2 text-sm"
              >
                <option value="">全部平台</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p] || p}
                  </option>
                ))}
              </select>
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
                className="input rounded-lg px-3 py-2 text-sm"
              >
                <option value="">全部价格意向</option>
                <option value="yes">可以接受</option>
                <option value="high">价格偏高</option>
                <option value="no">不会付费</option>
              </select>
              <select
                value={helpfulnessFilter}
                onChange={(e) => setHelpfulnessFilter(e.target.value)}
                className="input rounded-lg px-3 py-2 text-sm"
              >
                <option value="">全部评价</option>
                <option value="helpful">有帮助</option>
                <option value="ok">一般</option>
                <option value="inaccurate">不准确</option>
              </select>

              <span className="ml-auto text-xs text-[var(--text-muted)]">
                {filtered.length} 条记录
              </span>
              <button
                onClick={() => exportCSV(filtered)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                导出 CSV
              </button>
            </div>

            {/* Feedback list */}
            {filtered.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  当前筛选条件下没有匹配的反馈记录。
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <Card key={f.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold truncate">{f.productName}</h3>
                          <span className="shrink-0 rounded-md bg-[var(--bg-alt)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
                            {PLATFORM_LABELS[f.platform] || f.platform}
                          </span>
                          {f.category && (
                            <span className="shrink-0 rounded-md bg-[var(--bg-alt)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                              {f.category}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`font-medium ${
                            f.helpfulness === "helpful" ? "text-emerald-600 dark:text-emerald-400" :
                            f.helpfulness === "ok" ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>
                            {HELPFULNESS_LABELS[f.helpfulness] || f.helpfulness}
                          </span>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className={`font-medium ${
                            f.pricingAcceptance === "yes" ? "text-emerald-600 dark:text-emerald-400" :
                            f.pricingAcceptance === "high" ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>
                            价格: {PRICING_LABELS[f.pricingAcceptance] || f.pricingAcceptance}
                          </span>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-[var(--text-muted)]">评分 {f.score}</span>
                          {f.contact && (
                            <>
                              <span className="text-[var(--text-muted)]">·</span>
                              <span className="text-[var(--text-muted)]">📮 {f.contact}</span>
                            </>
                          )}
                          {f.hasCompetitorInfo && (
                            <>
                              <span className="text-[var(--text-muted)]">·</span>
                              <span className="text-[var(--text-muted)]">含竞品</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-[10px] text-[var(--text-muted)] text-right">
                        {new Date(f.createdAt).toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
}
