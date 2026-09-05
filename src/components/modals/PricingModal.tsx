"use client";

import React, { useEffect } from "react";
import { X, Trophy, Check, Sparkles, MessageCircle, Zap } from "lucide-react";
import { pricingTiers, clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [tiers, setTiers] = React.useState<any[]>(pricingTiers);

  React.useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pricing && data.pricing.length > 0) {
          const parsed = data.pricing.map((t: any) => ({
            ...t,
            featuresAr: Array.isArray(t.featuresAr) ? t.featuresAr : JSON.parse(t.featuresAr || "[]"),
            featuresEn: Array.isArray(t.featuresEn) ? t.featuresEn : JSON.parse(t.featuresEn || "[]"),
          }));
          setTiers(parsed);
        }
      })
      .catch((err) => console.error("Pricing fetch error:", err));
  }, []);
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-right animate-scaleUp max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pricing modal"
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div>
              <h2 id="pricing-modal-title" className="text-base sm:text-lg font-black text-white">
                باقات الاشتراك والعروض
              </h2>
              <p className="text-[10px] text-amber-400 font-english uppercase tracking-wider">
                Memberships & VIP Training Tiers
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pricing Cards List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {tiers.map((tier) => {
            const joinUrl = formatWhatsAppUrl(clubInfo.phoneRaw, tier.whatsappText);

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-4 transition-all ${
                  tier.popular
                    ? "bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10"
                    : "bg-zinc-900/70 border border-white/10"
                }`}
              >
                {/* Badge if available */}
                {tier.badge && (
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        tier.popular
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-red-600/90 text-white"
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>{tier.badge}</span>
                    </span>
                  </div>
                )}

                {/* Plan Title & Price */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white font-english">
                        {tier.price}
                      </span>
                      <span className="text-xs font-bold text-amber-400 font-english">
                        {tier.currency}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold block">
                      {tier.periodAr}
                    </span>
                  </div>

                  <div className="text-right">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {tier.titleAr}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-english uppercase tracking-wider">
                      {tier.titleEn}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 py-2 border-t border-white/5">
                  {tier.featuresAr.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-right">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct WhatsApp Joining CTA */}
                <div className="pt-3">
                  <a
                    href={joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                      tier.popular
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20"
                        : "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>اشترك الآن عبر الواتساب</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 text-center text-xs text-zinc-400">
          🥊 جميع الاشتراكات تشمل التقييم البدني المبدئي واستخدام كامل مرافق النادي.
        </div>
      </div>
    </div>
  );
};
