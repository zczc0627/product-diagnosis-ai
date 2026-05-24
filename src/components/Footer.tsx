export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <span>2026 转化诊断 · AI 商品页转化诊断工具</span>
          <span>V0 内测版</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-3xl">
          本工具提供商品页表达和转化文案优化建议，不承诺实际销量、点击率或转化率提升。实际效果受产品、价格、流量、评价、店铺权重等多种因素影响。
        </p>
      </div>
    </footer>
  );
}
