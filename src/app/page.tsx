"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBar } from "@/components/ScoreBar";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════ Hero ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/4 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[var(--text-secondary)] backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              AI 商品页成交诊断工具
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight"
          >
            商品有人看，
            <br className="sm:hidden" />
            却没人下单？
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto"
          >
            输入商品标题、卖点和主图文案，让 AI 找出影响点击和成交的问题，并生成可直接复制的优化方案。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/diagnose"
              className="btn-glow inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--accent-glow)] transition-all hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:-translate-y-0.5"
            >
              免费诊断我的商品
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-3.5 text-base font-medium backdrop-blur-sm transition-all hover:bg-white/5 hover:border-white/20"
            >
              查看定价
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-5 text-sm text-[var(--text-muted)]"
          >
            无需注册，30 秒生成基础诊断。完整方案 V1 内测价 9.9 元。
          </motion.p>

          {/* Mini report preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="mt-12 mx-auto max-w-md"
          >
            <div className="glass rounded-2xl p-5 text-left shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
                  AI
                </div>
                <div>
                  <p className="text-xs font-semibold">商品页诊断报告</p>
                  <p className="text-[10px] text-[var(--text-muted)]">示例商品 · 抖音</p>
                </div>
              </div>
              <div className="flex items-center gap-5 mb-4">
                <ScoreRing score={68} size="md" />
                <div className="space-y-1.5 flex-1">
                  <ScoreBar label="标题吸引力" score={62} />
                  <ScoreBar label="卖点清晰度" score={70} />
                  <ScoreBar label="主图点击力" score={65} />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">!</span>
                  <span className="text-red-300">标题关键词堆砌，缺乏场景感和购买理由</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">!</span>
                  <span className="text-amber-300">卖点表达像参数说明，买家感知不到好处</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ 为什么商品有人看却没人下单 ═══════════════════════════════════════════ */}
      <Section className="pb-0 sm:pb-0">
        <FadeIn>
          <SectionHeader
            label="问题诊断"
            title="为什么商品有人看，却没人下单？"
            description="不是流量不够，是商品页没让用户产生「现在就该买」的感觉。"
            center
          />
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: "📝", title: "标题只有参数，没有购买理由", desc: "关键词堆砌让用户觉得是普通货，没有点击欲望。应该前置利益点和场景。" },
            { icon: "🖼", title: "主图没有第一眼吸引力", desc: "搜索结果里商品主图千篇一律，用户扫过去根本不会停下来点开。" },
            { icon: "📋", title: "卖点写得像厂家说明书", desc: "用户看不懂「食品级PP材质」，但你写成「宝宝啃咬也安全」他立刻懂了。" },
            { icon: "🤔", title: "详情页没打消用户顾虑", desc: "用户想买但不敢下单——售后怎么样？质量有保障吗？别人用得好不好？" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Card hover className="flex gap-3 p-5">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-lg">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ AI 能帮你诊断什么 ═══════════════════════════════════════════ */}
      <Section>
        <FadeIn>
          <SectionHeader
            label="AI 能力"
            title="AI 能帮你诊断什么？"
            description="六个维度系统分析，像请了一个专业电商运营帮你看商品页。"
            center
          />
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🔍", title: "标题吸引力", desc: "用户搜到你的商品时，标题能不能让他点进去？分析关键词、利益点和场景感。" },
            { icon: "🖼", title: "主图点击力", desc: "主图在搜索结果里够不够突出？分析视觉焦点、利益标签和差异化表达。" },
            { icon: "💎", title: "卖点清晰度", desc: "用户看完卖点是不是清楚买了有什么好处？分析是否从买家视角表达利益。" },
            { icon: "🛒", title: "下单理由", desc: "页面有没有让用户觉得「现在就该买」？分析紧迫感、促销心理和购买动机。" },
            { icon: "🛡", title: "信任与顾虑", desc: "页面上有没有打消用户的顾虑？分析售后保障、评价引导和质量信任。" },
            { icon: "⚔️", title: "差异化表达", desc: "用户能不能看出你和竞品的不同？分析核心差异点和独家优势的传达。" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <Card hover className="text-center p-6">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-xl">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ 免费版 vs 完整方案 ═══════════════════════════════════════════ */}
      <Section className="bg-[var(--bg-alt)]">
        <FadeIn>
          <SectionHeader
            label="方案对比"
            title="免费诊断 vs 完整优化方案"
            description="免费版让你看清问题，完整方案告诉你怎么改。"
            center
          />
        </FadeIn>
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <FadeIn delay={0.1}>
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-1">免费诊断</h3>
              <p className="text-3xl font-bold">¥0</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-5">了解你的商品页问题在哪</p>
              <ul className="space-y-2.5">
                {["综合评分", "六维度评分", "3 个核心问题", "1 条关键建议", "原标题 vs 优化后示例"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-emerald-500"><path d="M3 8l3 3 7-7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/diagnose"
                className="mt-6 block w-full rounded-xl border border-[var(--border)] py-2.5 text-center text-sm font-medium transition-all hover:bg-white/5"
              >
                立即免费诊断
              </Link>
            </Card>
          </FadeIn>

          {/* Paid */}
          <FadeIn delay={0.2}>
            <Card className="p-6 sm:p-8 premium-card relative overflow-hidden">
              <span className="absolute top-3 right-3 rounded-full bg-[var(--gold)]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--gold-light)]">
                推荐
              </span>
              <h3 className="text-lg font-semibold mb-1">完整优化方案</h3>
              <p className="text-3xl font-bold">¥9.9 <span className="text-sm font-normal text-[var(--text-muted)]">/次</span></p>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-5">一个商品的全套优化方案</p>
              <ul className="space-y-2.5">
                {["3 版可复制的高点击标题", "5 条核心卖点（买家语言版）", "主图文案 + 画面建议", "详情页结构建议", "买家顾虑 FAQ", "竞品对比分析", "可直接复制的成交文案"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-[var(--gold)]"><path d="M3 8l3 3 7-7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/diagnose"
                className="btn-glow mt-6 block w-full rounded-xl bg-[var(--accent)] py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--accent-glow)] transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                提交诊断，查看方案
              </Link>
            </Card>
          </FadeIn>
        </div>

        {/* Early bird */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-4 max-w-4xl">
            <Card className="p-5 text-center border-white/10">
              <p className="text-sm font-semibold">
                早鸟 5 次包：<span className="text-[var(--gold-light)]">¥39 / 5次</span>
                <span className="ml-2 text-xs text-emerald-400 font-medium">单次低至 ¥7.8</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">适合有多个商品的商家，更划算</p>
            </Card>
          </div>
        </FadeIn>
      </Section>

      {/* ═══════════════════════════════════════════ 适合哪些人用 ═══════════════════════════════════════════ */}
      <Section>
        <FadeIn>
          <SectionHeader
            label="适用人群"
            title="适合哪些人用？"
            description="不管你在哪个平台卖货，只要感觉转化不对，这个工具就适合你。"
            center
          />
        </FadeIn>
        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {["淘宝商家", "拼多多商家", "抖音小店", "小红书卖货", "闲鱼卖家", "新手商家"].map((label, i) => (
            <FadeIn key={label} delay={i * 0.06}>
              <Card hover className="text-center py-3 px-4">
                <p className="text-sm font-medium">{label}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ Pricing ═══════════════════════════════════════════ */}
      <Section id="pricing" className="bg-[var(--bg-alt)]">
        <FadeIn>
          <SectionHeader
            label="定价"
            title="先免费看问题，觉得有价值再付费"
            description="免费诊断告诉你问题在哪，完整方案直接告诉你怎么改。"
            center
          />
        </FadeIn>
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
              features: ["3版可直接用的标题", "5条买家语言卖点", "主图文案+画面建议", "详情页结构", "买家顾虑FAQ", "差异化成交话术", "可复制完整文案"],
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
                  ? "premium-card"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <p className="mb-2 text-[10px] font-semibold text-[var(--gold-light)]">推荐</p>
              )}
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                ¥{plan.price}
                {plan.perUse && <span className="text-xs font-normal text-[var(--text-muted)]">/次</span>}
              </p>
              {plan.subPrice && (
                <p className="text-[11px] text-emerald-400 font-medium mt-0.5">{plan.subPrice}</p>
              )}
              <p className="mt-1 text-xs text-[var(--text-muted)]">{plan.desc}</p>
              <ul className="mt-4 space-y-1.5 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[12px] text-[var(--text-secondary)]">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 shrink-0 text-emerald-500"><path d="M3 8l3 3 7-7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/diagnose"
                className={`mt-5 block w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-all ${
                  plan.highlighted
                    ? "btn-glow bg-[var(--accent)] text-white hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    : "border border-[var(--border)] hover:bg-white/5"
                }`}
              >
                {plan.btn}
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ CTA ═══════════════════════════════════════════ */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              9.9 元，给你的商品页做一次专业诊断
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              不是让你多花钱，是让你少走弯路。让 AI 帮你看清问题，把流量真的变成订单。
            </p>
            <div className="mt-8">
              <Link
                href="/diagnose"
                className="btn-glow inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--accent-glow)] transition-all hover:-translate-y-0.5"
              >
                免费诊断我的商品
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              免费诊断，无需注册。完整方案 V1 内测价 9.9 元。
            </p>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
