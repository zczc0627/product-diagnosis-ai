"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { saveFormData, saveHistoryItem } from "@/lib/store";
import type { AIDiagnoseResponse } from "@/lib/aiTypes";

const CATEGORIES = [
  "美妆个护", "服饰鞋包", "家居日用", "厨房小家电", "数码3C",
  "食品饮料", "母婴用品", "运动户外", "图书文娱", "其他",
];
const PLATFORMS = ["淘宝", "拼多多", "抖音", "小红书", "闲鱼", "独立站", "其他"];
const USER_GOALS = [
  { value: "click", label: "提升点击率" },
  { value: "order", label: "提升下单转化" },
  { value: "title", label: "优化标题" },
  { value: "image", label: "优化主图" },
  { value: "unknown", label: "不知道问题在哪" },
];

interface FormData {
  productName: string;
  category: string;
  price: string;
  platform: string;
  targetUser: string;
  currentTitle: string;
  currentSellingPoints: string;
  mainImageDescription: string;
  productDescription: string;
  competitorTitle: string;
  competitorSellingPoints: string;
  userGoal: string;
}

const INITIAL_FORM: FormData = {
  productName: "",
  category: "",
  price: "",
  platform: "淘宝",
  targetUser: "",
  currentTitle: "",
  currentSellingPoints: "",
  mainImageDescription: "",
  productDescription: "",
  competitorTitle: "",
  competitorSellingPoints: "",
  userGoal: "unknown",
};

const RATE_LIMIT_KEY = "diagnosis_rate_limit";

function getRateLimit(): { count: number; date: string } {
  if (typeof window === "undefined") return { count: 0, date: "" };
  try {
    return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"date":""}');
  } catch {
    return { count: 0, date: "" };
  }
}

function incrementRateLimit(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  const current = getRateLimit();
  if (current.date !== today) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, date: today }));
  } else {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: current.count + 1, date: today }));
  }
}

function isRateLimited(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const current = getRateLimit();
  if (current.date !== today) return false;
  return current.count >= 3;
}

export default function DiagnosePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canSubmit =
    form.productName.trim() &&
    form.category &&
    form.currentTitle.trim() &&
    form.currentSellingPoints.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    if (isRateLimited()) {
      setRateLimited(true);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Build competitor info string
      const competitorParts = [];
      if (form.competitorTitle) competitorParts.push(`竞品标题：${form.competitorTitle}`);
      if (form.competitorSellingPoints) competitorParts.push(`竞品卖点：${form.competitorSellingPoints}`);
      const competitorInfo = competitorParts.join("；");

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTitle: form.currentTitle,
          category: form.category,
          price: form.price,
          targetUser: form.targetUser,
          sellingPoints: form.currentSellingPoints,
          mainImageCopy: form.mainImageDescription,
          detailDescription: form.productDescription,
          platform: form.platform,
          competitorInfo,
          userGoal: USER_GOALS.find((g) => g.value === form.userGoal)?.label || "",
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "诊断失败，请稍后重试");
        setSubmitting(false);
        return;
      }

      const aiData = json.data as AIDiagnoseResponse;

      // Save form data for results pages
      saveFormData({
        productName: form.productName,
        category: form.category,
        platform: form.platform,
        price: form.price,
        targetUser: form.targetUser,
        currentTitle: form.currentTitle,
        currentSellingPoints: form.currentSellingPoints,
        mainImageDescription: form.mainImageDescription,
        productDescription: form.productDescription,
        competitorTitle: form.competitorTitle,
        competitorSellingPoints: form.competitorSellingPoints,
        userGoal: form.userGoal,
      });

      // Save AI result to localStorage for results page
      localStorage.setItem("diagnosis_ai_result", JSON.stringify(aiData));

      // Save to history
      saveHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        productName: form.productName || form.currentTitle.slice(0, 20),
        platform: form.platform,
        score: aiData.overallScore,
        date: new Date().toISOString().slice(0, 10),
        isCompleted: false,
        summary: aiData.summary,
        resultJson: JSON.stringify(aiData),
      });

      // Rate limit
      incrementRateLimit();

      // Navigate to results
      router.push("/results/free");
    } catch {
      setError("网络异常，请稍后重试");
      setSubmitting(false);
    }
  };

  if (rateLimited) {
    return (
      <Section>
        <div className="mx-auto max-w-lg text-center py-20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">今日免费诊断次数已用完</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            每个浏览器每天可免费诊断 3 次。明天再来，或联系站长升级不限次。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            刷新页面重试
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        label="免费诊断"
        title="输入你的商品信息，让 AI 诊断转化问题"
        description="信息越详细，AI 诊断越精准。必填项不多，大约 1 分钟完成。"
      />

      <div className="mx-auto max-w-2xl">
        <Card className="p-6 sm:p-8">
          <div className="space-y-5">
            {/* Row 1: Product Name + Category */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="商品名称" required>
                <input
                  className="input"
                  placeholder="例如：便携榨汁杯"
                  value={form.productName}
                  onChange={(e) => update("productName", e.target.value)}
                  maxLength={200}
                />
              </Field>
              <Field label="商品类目" required>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="">请选择类目</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 2: Price + Platform */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="售价" sub="选填">
                <input
                  className="input"
                  placeholder="例如：¥39.9"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  maxLength={50}
                />
              </Field>
              <Field label="销售平台" sub="选填">
                <select
                  className="input"
                  value={form.platform}
                  onChange={(e) => update("platform", e.target.value)}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 3: Target User + User Goal */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="目标用户" sub="选填，例如：宝妈、学生">
                <input
                  className="input"
                  placeholder="例如：25-35岁宝妈"
                  value={form.targetUser}
                  onChange={(e) => update("targetUser", e.target.value)}
                  maxLength={100}
                />
              </Field>
              <Field label="你最想解决的问题">
                <select
                  className="input"
                  value={form.userGoal}
                  onChange={(e) => update("userGoal", e.target.value)}
                >
                  {USER_GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 4: Title (required) */}
            <Field label="当前商品标题" required sub="复制你现在的商品标题">
              <textarea
                className="input min-h-[70px]"
                placeholder="例如：便携榨汁杯家用充电款迷你果汁机学生宿舍榨汁机"
                value={form.currentTitle}
                onChange={(e) => update("currentTitle", e.target.value)}
                maxLength={500}
              />
            </Field>

            {/* Row 5: Selling Points (required) */}
            <Field label="当前卖点" required sub="每行一条卖点">
              <textarea
                className="input min-h-[90px]"
                placeholder={"例如：\n大容量电池 续航7天\n食品级不锈钢材质\nType-C快充\n轻音破壁"}
                value={form.currentSellingPoints}
                onChange={(e) => update("currentSellingPoints", e.target.value)}
                maxLength={1000}
              />
            </Field>

            {/* Row 6: Main Image + Detail (optional) */}
            <Field label="主图文案或描述" sub="选填">
              <textarea
                className="input min-h-[70px]"
                placeholder="描述你的主图内容，或写出现在主图上的文字"
                value={form.mainImageDescription}
                onChange={(e) => update("mainImageDescription", e.target.value)}
                maxLength={800}
              />
            </Field>
            <Field label="详情页描述" sub="选填，帮助 AI 更全面诊断">
              <textarea
                className="input min-h-[90px]"
                placeholder="描述你详情页主要写什么，或粘贴详情页关键段落"
                value={form.productDescription}
                onChange={(e) => update("productDescription", e.target.value)}
                maxLength={1500}
              />
            </Field>

            {/* Row 7: Competitor (optional) */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors select-none">
                填写竞品信息（选填，帮助 AI 做差异化分析）
              </summary>
              <div className="mt-3 space-y-3">
                <Field label="竞品标题">
                  <input
                    className="input"
                    placeholder="输入一个销量好的竞品标题"
                    value={form.competitorTitle}
                    onChange={(e) => update("competitorTitle", e.target.value)}
                    maxLength={500}
                  />
                </Field>
                <Field label="竞品卖点">
                  <textarea
                    className="input min-h-[70px]"
                    placeholder="竞品主打什么卖点？"
                    value={form.competitorSellingPoints}
                    onChange={(e) => update("competitorSellingPoints", e.target.value)}
                    maxLength={1000}
                  />
                </Field>
              </div>
            </details>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI 正在分析标题吸引力、卖点清晰度和下单理由…
                </span>
              ) : (
                "开始 AI 诊断"
              )}
            </button>

            <p className="text-center text-[11px] text-[var(--text-muted)]">
              免费诊断，无需注册。完整优化方案 V1 内测价 9.9 元。
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Field({
  label,
  required,
  sub,
  children,
}: {
  label: string;
  required?: boolean;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        {label}
        {required && <span className="text-red-500 text-xs">*必填</span>}
      </span>
      {sub && (
        <span className="mb-1.5 block text-[11px] text-[var(--text-muted)]">{sub}</span>
      )}
      {children}
    </label>
  );
}
