import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Section>
      <SectionHeader
        label="关于产品"
        title="用 AI 帮商家提升商品转化"
        description="我们相信，好的商品文案不应该靠天赋。每个商家都值得拥有专业的转化优化能力。"
      />

      <div className="mx-auto max-w-3xl space-y-8">
        {/* What */}
        <Card className="p-8">
          <h3 className="text-base font-semibold mb-3">这个产品是什么</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            转化诊断是一个 AI 驱动的商品页转化分析工具。输入你的商品信息，
            AI 会自动诊断标题、主图、卖点、详情页的问题，并生成可落地的优化方案。
          </p>
        </Card>

        {/* Who */}
        <Card className="p-8">
          <h3 className="text-base font-semibold mb-3">谁适合使用</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "小红书、抖音、淘宝、拼多多商家",
              "独立站小卖家",
              "电商运营新手",
              "不擅长写商品文案的人",
              "想提升转化率的品牌方",
              "一人公司 / 个体创业者",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg bg-[var(--bg-alt)] px-3 py-2.5 text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-[var(--accent)]">
                  <path d="M3 8l3 3 7-7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* How */}
        <Card className="p-8">
          <h3 className="text-base font-semibold mb-3">如何使用</h3>
          <div className="space-y-4">
            {[
              { step: "1", title: "输入商品信息", desc: "填写商品名称、标题、卖点、主图描述等信息" },
              { step: "2", title: "AI 自动诊断", desc: "AI 从多个维度分析你的商品页，给出综合评分和问题定位" },
              { step: "3", title: "获取优化方案", desc: "得到可落地的标题、卖点、主图概念和详情页结构建议" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* V0 note */}
        <Card className="p-8 border-dashed">
          <h3 className="text-base font-semibold mb-3">关于 V0 验证版</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            这是产品的 V0 验证版本，目的是验证需求、收集用户反馈。
            目前使用模拟数据演示产品能力，后续将接入 AI 实现真实诊断。
            如果你有任何建议或需求，欢迎告诉我们。
          </p>
        </Card>

        <div className="text-center">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            免费诊断我的商品页
          </Link>
        </div>
      </div>
    </Section>
  );
}
