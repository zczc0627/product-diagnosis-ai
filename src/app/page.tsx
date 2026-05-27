import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";
import { caseCompareData } from "@/data/mock";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <Section className="pb-0 sm:pb-0">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-1 text-xs text-[var(--accent)] font-medium">
              <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              AI 商品页转化诊断工具
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              商品有人看，
              <br className="sm:hidden" />
              却没人下单？
              <br />
              <span className="text-[var(--accent)]">AI 帮你的商品页把流量变销量</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              输入商品标题、卖点和主图文案，让 AI 找出影响点击和成交的问题，
              <br className="hidden sm:block" />
              并生成可直接复制的优化方案。帮你把参数卖点改成买家愿意买单的表达。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/diagnose"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/20"
              >
                免费诊断我的商品
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
              >
                查看定价
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              无需注册，30 秒生成基础诊断。完整方案 V1 内测价 9.9 元。
            </p>
          </div>

          {/* Hero mock report */}
          <div className="relative lg:flex lg:justify-end">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm w-full max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
                  AI
                </div>
                <div>
                  <p className="text-xs font-semibold">商品页诊断报告</p>
                  <p className="text-[10px] text-[var(--text-muted)]">示例商品 · 抖音</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-5">
                <ScoreRing score={72} size="md" />
                <div className="space-y-1.5 flex-1">
                  <ScoreBar label="标题吸引力" score={68} />
                  <ScoreBar label="卖点清晰度" score={70} />
                  <ScoreBar label="主图点击力" score={75} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-2.5 text-xs">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-[10px] font-bold text-red-600 dark:text-red-400">!</span>
                  <span className="text-red-800 dark:text-red-300">标题关键词堆砌，缺乏场景感</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2.5 text-xs">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-[10px] font-bold text-amber-600 dark:text-amber-400">!</span>
                  <span className="text-amber-800 dark:text-amber-300">卖点表达不聚焦，缺少用户视角</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Pain Points ─── */}
      <Section>
        <SectionHeader
          label="痛点"
          title="你的商品是不是也有这些问题？"
          description="很多商家在商品上架后才发现，问题不在流量，而在商品页本身。"
          center
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((p) => (
            <Card key={p.title} hover className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xs">
                {p.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── Features ─── */}
      <Section className="bg-[var(--bg-alt)]">
        <SectionHeader
          label="能力"
          title="三个核心诊断维度"
          description="不只是生成文案，而是帮你看清商品页的问题根源。"
          center
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-xl">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── Report Preview ─── */}
      <Section>
        <SectionHeader
          label="诊断报告"
          title="像体检报告一样，看清楚你的商品页"
          description="每个维度独立评分，定位问题一目了然。"
          center
        />
        <div className="mx-auto max-w-3xl">
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <ScoreRing score={72} size="lg" />
              <div className="flex-1 space-y-3 w-full">
                <ScoreBar label="标题吸引力" score={68} />
                <ScoreBar label="卖点清晰度" score={70} />
                <ScoreBar label="主图点击力" score={75} />
                <ScoreBar label="用户购买欲" score={73} />
                <ScoreBar label="差异化程度" score={74} />
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-5">
              <h4 className="text-sm font-semibold mb-3">核心问题</h4>
              <div className="space-y-2">
                {[
                  { severity: "critical", text: "标题关键词太普通，缺少场景感和利益点" },
                  { severity: "critical", text: "主图文案像说明书，没有激发购买欲" },
                  { severity: "warning", text: "卖点表达不聚焦，用户感知不到差异化" },
                ].map((issue, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 rounded-lg p-3 text-sm ${
                      issue.severity === "critical"
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "bg-amber-50 dark:bg-amber-950/20"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        issue.severity === "critical"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {issue.severity === "critical" ? "!" : "~"}
                    </span>
                    <span className="text-sm">{issue.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <h4 className="text-sm font-semibold mb-2">AI 优化建议（预览）</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                建议将标题从罗列关键词的写法改为突出使用场景的写法，例如前置利益点、嵌入数字和具体场景——让用户一眼就能感知到买了有什么好处。
              </p>
            </div>
          </Card>
        </div>
      </Section>

      {/* ─── Case Comparison ─── */}
      <Section id="cases" className="bg-[var(--bg-alt)]">
        <SectionHeader
          label="案例"
          title="优化前 vs 优化后"
          description="不是写更华丽的文案，而是找到真正打动用户的表达方式。"
          center
        />
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Before */}
            <Card className="border-red-200 dark:border-red-900/30">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-0.5 text-[11px] font-medium text-red-600 dark:text-red-400">
                优化前
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">标题</p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {caseCompareData.before.title}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">主图风格</p>
                  <p className="text-[var(--text-secondary)]">{caseCompareData.before.mainImage}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">卖点</p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {caseCompareData.before.sellingPoint}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 px-3 py-2">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    卖点不聚焦，用户感知不到购买理由
                  </p>
                </div>
              </div>
            </Card>

            {/* After */}
            <Card className="border-emerald-200 dark:border-emerald-900/30">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                优化后
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">标题</p>
                  <p className="font-medium leading-relaxed">
                    {caseCompareData.after.title}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">主图风格</p>
                  <p className="font-medium">{caseCompareData.after.mainImage}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">卖点</p>
                  <p className="font-medium leading-relaxed">
                    {caseCompareData.after.sellingPoint}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    卖点清晰聚焦，购买理由明确可感知
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* ─── Pricing ─── */}
      <Section id="pricing">
        <SectionHeader
          label="定价"
          title="先免费看问题，觉得有价值再付费"
          description="免费诊断告诉你问题在哪，完整方案告诉你怎么改。"
          center
        />
        <div className="mx-auto max-w-3xl grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "免费诊断",
              price: "0",
              desc: "了解你的商品页问题在哪",
              features: ["综合评分", "6维度评分", "3个核心问题", "1条关键建议"],
              btn: "免费开始",
              highlighted: false,
            },
            {
              name: "单商品完整优化",
              price: "9.9",
              desc: "一个商品的全套优化方案",
              features: ["3版可直接用的标题", "5条买家语言卖点", "5条主图文案+画面建议", "详情页结构", "买家顾虑FAQ", "差异化成交话术"],
              btn: "9.9元获取方案",
              highlighted: true,
              perUse: true,
            },
            {
              name: "早鸟 5 次包",
              price: "39",
              desc: "适合有多个商品的商家",
              features: ["5次完整优化", "同单商品全部内容", "优先体验新功能", "早鸟专属优惠"],
              btn: "39元 / 5次",
              highlighted: false,
              subPrice: "单次低至 ¥7.8",
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={`text-center ${
                plan.highlighted
                  ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/20"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <p className="mb-2 text-[10px] font-semibold text-[var(--accent)]">推荐</p>
              )}
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                ¥{plan.price}
                {plan.perUse && (
                  <span className="text-xs font-normal text-[var(--text-muted)]">/次</span>
                )}
              </p>
              {plan.subPrice && (
                <p className="text-[11px] text-emerald-500 font-medium mt-0.5">{plan.subPrice}</p>
              )}
              {!plan.subPrice && plan.price !== "0" && (
                <p className="text-[11px] text-emerald-500 font-medium mt-0.5">&nbsp;</p>
              )}
              <p className="mt-1 text-xs text-[var(--text-muted)]">{plan.desc}</p>
              <ul className="mt-4 space-y-1.5 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[12px] text-[var(--text-secondary)]">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-emerald-500">
                      <path d="M3 8l3 3 7-7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/diagnose"
                className={`mt-5 block w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)]"
                    : "border border-[var(--border)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                {plan.btn}
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            商品卖不动，可能不是流量的问题
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
            让 AI 帮你看清问题，生成能真正打动用户、提高成交意愿的商品文案。
          </p>
          <div className="mt-8">
            <Link
              href="/diagnose"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/20"
            >
              免费诊断我的商品
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            无需注册。免费诊断告诉你问题在哪，9.9 元完整方案告诉你怎么改。
          </p>
        </div>
      </Section>
    </>
  );
}

const painPoints = [
  {
    icon: "👁",
    title: "商品有人看没人点",
    desc: "曝光量不低，但点击率一直上不去。主图和标题没有让人点进去的欲望。",
  },
  {
    icon: "🛒",
    title: "点进去了不下单",
    desc: "用户进来看了又走，详情页没说服力。卖点写了一大堆，但用户不买账。",
  },
  {
    icon: "📝",
    title: "卖点表达不清晰",
    desc: "只会写参数不会写利益。用户看完不知道你的产品和别人的有什么不同。",
  },
  {
    icon: "🖼",
    title: "主图没有吸引力",
    desc: "主图只是产品照片，没有场景感、没有利益标签，在海量商品中被淹没。",
  },
  {
    icon: "📋",
    title: "文案像流水账",
    desc: "标题关键词堆砌，详情页像说明书。用户读不下去，更不会下单。",
  },
  {
    icon: "🏪",
    title: "不知道竞品为什么卖得好",
    desc: "同类产品卖得比你好，但你看不出他们的商品页到底做对了什么。",
  },
];

const features = [
  {
    icon: "🔍",
    title: "商品页转化诊断",
    desc: "从标题、主图、卖点、详情页四个维度，系统分析你的商品页哪里在「劝退」用户。",
  },
  {
    icon: "⚔️",
    title: "竞品卖点对比",
    desc: "对比你的商品和竞品在卖点表达上的差异，找出你可以发力的差异化方向。",
  },
  {
    icon: "✨",
    title: "主图文案优化",
    desc: "不只是改写标题——给你可落地的标题、卖点、主图概念和详情页结构建议。",
  },
];
