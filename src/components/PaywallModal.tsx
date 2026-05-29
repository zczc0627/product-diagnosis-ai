"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  const router = useRouter();
  const [priceAnswer, setPriceAnswer] = useState<string | null>(null);

  if (!open) return null;

  const handleFreeAccess = () => {
    if (priceAnswer) {
      localStorage.setItem("diagnosis_price_survey", priceAnswer);
    }
    onClose();
    router.push("/results/full");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--gold)]/30 p-6 shadow-2xl shadow-[var(--gold-glow)] premium-card">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold)]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--gold)]">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">解锁完整优化方案</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            免费诊断让你看清问题，完整方案直接告诉你怎么改。
            <br />
            <span className="text-[var(--gold-light)] font-medium">V1 内测价 9.9 元/次</span>，支付接口接入中，限时免费体验。
          </p>

          {/* Price acceptance survey */}
          <div className="mb-5 rounded-lg bg-[var(--bg-alt)] p-3 text-left">
            <p className="text-xs font-medium mb-2">
              如果这个方案对你有帮助，你能接受 9.9 元/次吗？
            </p>
            <div className="space-y-1.5">
              {[
                { value: "accept", label: "可以接受" },
                { value: "high", label: "价格有点高" },
                { value: "no", label: "暂时不会付费" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceAnswer(opt.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    priceAnswer === opt.value
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 font-medium"
                      : "border-[var(--border)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFreeAccess}
            className="btn-glow w-full rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            免费查看完整方案
          </button>
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-alt)]"
          >
            先看看再说
          </button>
          <p className="mt-3 text-[10px] text-[var(--text-muted)]">
            不满意全额退款 · 每个商品限免一次
          </p>
        </div>
      </div>
    </div>
  );
}
