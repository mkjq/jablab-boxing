"use client";

import React, { useState, useEffect } from "react";
import { X, Flame, MessageCircle, CheckCircle2, User, Phone } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrialModal: React.FC<TrialModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [level, setLevel] = useState("beginner");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jordanian phone number validation (07 followed by 7,8,9 and 7 digits)
    const isValidPhone = /^07[789]\d{7}$/.test(phone);
    if (!isValidPhone) {
      setPhoneError("يرجى إدخال رقم هاتف أردني صحيح (مثال: 0791234567)");
      return;
    }
    setPhoneError("");

    const levelText =
      level === "beginner"
        ? "مبتدئ تماماً"
        : level === "intermediate"
        ? "متوسط / لدي خبرة سابقة"
        : "متقدم / رياضي";

    const msg = `مرحباً نادي جاب لاب، أود حجز حصة تجريبية مجانية:\n• الاسم: ${name || "غير محدد"}\n• الهاتف: ${phone || "غير محدد"}\n• المستوى: ${levelText}`;
    const waUrl = formatWhatsAppUrl(clubInfo.phoneRaw, msg);
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-right animate-scaleUp p-5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close trial modal"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 id="trial-modal-title" className="text-lg font-black text-white">
              احجز حصتك التجريبية المجانية
            </h2>
            <p className="text-xs text-zinc-400">
              Free Boxing Trial Session at Jab Lab
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-3 my-2 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>تجربة كاملة لأجواء التدريب وحلبة النادي</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>إشراف وتوجيه مباشر من مدربي المنتخب والأولمبياد</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>مجاناً 100% وبدون أي التزام مسبق</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="أدخل اسمك الكريم..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full py-2.5 px-3 ps-9 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors text-right"
              />
              <User className="w-4 h-4 text-zinc-500 absolute top-3 left-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              رقم الهاتف / الواتساب
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); // Allow only numbers
                  setPhone(val);
                  if (phoneError) setPhoneError("");
                }}
                required
                className={`w-full py-2.5 px-3 ps-9 rounded-xl bg-zinc-900 border text-white placeholder-zinc-500 text-xs focus:outline-none transition-colors text-right ${
                  phoneError ? "border-red-500/80 focus:border-red-500" : "border-white/10 focus:border-red-500"
                }`}
              />
              <Phone className={`w-4 h-4 absolute top-3 left-3 ${phoneError ? "text-red-400" : "text-zinc-500"}`} />
            </div>
            {phoneError && (
              <p className="mt-1 text-[10px] text-red-400 font-semibold">{phoneError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              مستواك الرياضي الحالي
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "beginner", label: "مبتدئ" },
                { id: "intermediate", label: "متوسط" },
                { id: "advanced", label: "متقدم" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    level === lvl.id
                      ? "bg-red-600 text-white border border-red-400"
                      : "bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تأكيد الحجز الفوري عبر الواتساب</span>
          </button>
        </form>
      </div>
    </div>
  );
};
