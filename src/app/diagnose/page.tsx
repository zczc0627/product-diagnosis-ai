"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { saveFormData, saveHistoryItem } from "@/lib/store";
import { generateDiagnosis } from "@/lib/generate";

const categories = ["美妆个护", "服饰鞋包", "家居日用", "厨房小家电", "数码3C", "食品饮料", "母婴用品", "运动户外", "其他"];
const platforms = ["抖音", "小红书", "淘宝", "拼多多", "独立站", "其他"];

interface FormData {
  productName: string;
  category: string;
  platform: string;
  currentTitle: string;
  currentSellingPoints: string;
  mainImageDescription: string;
  productDescription: string;
  competitorTitle: string;
  competitorSellingPoints: string;
}

const initialForm: FormData = {
  productName: "",
  category: "",
  platform: "",
  currentTitle: "",
  currentSellingPoints: "",
  mainImageDescription: "",
  productDescription: "",
  competitorTitle: "",
  competitorSellingPoints: "",
};

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;
  const progress = Math.round((step / totalSteps) * 100);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 1) return form.productName && form.category && form.platform;
    if (step === 2) return form.currentTitle;
    if (step === 3) return form.currentSellingPoints;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Save form data so results pages can read it
    saveFormData(form);
    // Generate diagnosis to create a history entry
    const diag = generateDiagnosis(form);
    saveHistoryItem({
      id: diag.id,
      productName: diag.productName,
      platform: diag.platform,
      score: diag.score.overall,
      date: new Date().toISOString().slice(0, 10),
      isCompleted: false,
    });
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1800));
    router.push("/results/free");
  };

  return (
    <Section>
      <SectionHeader
        label="免费诊断"
        title="输入你的商品信息"
        description="信息越详细，AI 诊断越精准。填写大约需要 2 分钟。"
      />

      {/* Progress */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {step}/{totalSteps}
          </span>
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
          <span className={step >= 1 ? "text-[var(--accent)] font-medium" : ""}>基本信息</span>
          <span className={step >= 2 ? "text-[var(--accent)] font-medium" : ""}>标题</span>
          <span className={step >= 3 ? "text-[var(--accent)] font-medium" : ""}>卖点与主图</span>
          <span className={step >= 4 ? "text-[var(--accent)] font-medium" : ""}>竞品对比</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">基本信息</h3>
              <Field label="商品名称" required>
                <input
                  className="input"
                  placeholder="例如：便携榨汁杯"
                  value={form.productName}
                  onChange={(e) => update("productName", e.target.value)}
                />
              </Field>
              <Field label="商品类目" required>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update("category", c)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        form.category === c
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                          : "border-[var(--border)] hover:bg-[var(--bg-alt)]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="销售平台" required>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update("platform", p)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        form.platform === p
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                          : "border-[var(--border)] hover:bg-[var(--bg-alt)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* Step 2: Title */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">当前标题</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                复制你现在的商品标题，AI 会分析它的转化力。
              </p>
              <Field label="商品标题" required>
                <textarea
                  className="input min-h-[80px]"
                  placeholder="例如：便携榨汁杯家用充电款迷你果汁机学生宿舍榨汁机"
                  value={form.currentTitle}
                  onChange={(e) => update("currentTitle", e.target.value)}
                />
              </Field>
              <Field label="商品介绍">
                <textarea
                  className="input min-h-[100px]"
                  placeholder="简单描述你的产品特点、材质、使用场景等（选填）"
                  value={form.productDescription}
                  onChange={(e) => update("productDescription", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Step 3: Selling Points & Main Image */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">卖点与主图</h3>
              <Field label="当前卖点" required>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="列出你现在的核心卖点，每行一条&#10;例如：&#10;大容量电池&#10;食品级材质&#10;Type-C充电"
                  value={form.currentSellingPoints}
                  onChange={(e) => update("currentSellingPoints", e.target.value)}
                />
              </Field>
              <Field label="主图文案或描述">
                <textarea
                  className="input min-h-[80px]"
                  placeholder="描述你的主图内容，或直接写出现在主图上的文字（选填）"
                  value={form.mainImageDescription}
                  onChange={(e) => update("mainImageDescription", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Step 4: Competitor */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">竞品对比（选填）</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                填了竞品信息，AI 可以帮你做差异化分析。
              </p>
              <Field label="竞品标题">
                <input
                  className="input"
                  placeholder="输入一个销量好的竞品标题（选填）"
                  value={form.competitorTitle}
                  onChange={(e) => update("competitorTitle", e.target.value)}
                />
              </Field>
              <Field label="竞品卖点">
                <textarea
                  className="input min-h-[80px]"
                  placeholder="竞品主要打什么卖点？（选填）"
                  value={form.competitorSellingPoints}
                  onChange={(e) => update("competitorSellingPoints", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className={`rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-alt)] ${
                step === 1 ? "invisible" : ""
              }`}
            >
              上一步
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                disabled={!canNext()}
                className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-dark)] disabled:opacity-60"
              >
                {submitting ? "AI 分析中..." : "开始 AI 诊断"}
              </button>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
