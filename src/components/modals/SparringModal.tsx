"use client";

import React, { useState, useEffect } from "react";
import { X, Swords, MessageCircle, ShieldCheck, User, Phone, Scale, Award } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface SparringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SparringModal: React.FC<SparringModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [hasSparredBefore, setHasSparredBefore] = useState<"yes" | "no">("yes");
  const [preferredDay, setPreferredDay] = useState("friday");

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

    // Validate phone number
    const isValidPhone = /^07[789]\d{7}$/.test(phone);
    if (!isValidPhone) {
      setPhoneError("يرجى إدخال رقم هاتف أردني صحيح (مثال: 0791234567)");
      return;
    }
    setPhoneError("");

    const expText =
      experience === "beginner"
        ? "مبتدئ (أول تجربة سبارينغ)"
        : experience === "intermediate"
        ? "متوسط (لدي أساسيات وخبرة تدريب)"
        : "متقدم / ملاكم بطولات";

    const dayText =
      preferredDay === "friday"
        ? "الجمعة (يوم السبارينغ المفتوح)"
        : preferredDay === "men_days"
        ? "أيام الرجال (سبت - اثنين - أربعاء)"
        : "أيام السيدات (أحد - ثلاثاء - خميس)";

    const msg = `🥊 طلب حجز مباراة سبارينغ وتحدي - نادي جاب لاب 🥊\n\n` +
      `• الاسم الكامل: ${name || "غير محدد"}\n` +
      `• العمر: ${age || "غير محدد"} سنة\n` +
      `• الوزن التقريبي: ${weight || "غير محدد"} كغ\n` +
      `• رقم الهاتف: ${phone}\n` +
      `• مستوى الخبرة: ${expText}\n` +
      `• هل خاض سبارينغ سابقاً؟: ${hasSparredBefore === "yes" ? "نعم" : "لا (أول مرة)"}\n` +
      `• التوقيت/اليوم المفضل: ${dayText}\n\n` +
      `أود التنسيق مع الكابتن لتحديد الموعد والمنافس المناسب في الحلبة.`;

    const waUrl = formatWhatsAppUrl(clubInfo.phoneRaw, msg);
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sparring-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-950/40 text-right animate-scaleUp p-5 sm:p-6 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sparring modal"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30 flex-shrink-0">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="sparring-modal-title" className="text-lg sm:text-xl font-black text-white">
                احجز مباراة سبارينغ وتحدي
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30">
                SPARRING
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              اختبر مهاراتك في حلبة جاب لاب ضد شباب وأبطال النادي
            </p>
          </div>
        </div>

        {/* Safety & Protocol Banner */}
        <div className="p-3.5 my-2 rounded-2xl bg-zinc-900/90 border border-red-500/20 space-y-1.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>معايير السلامة والنزال الودي:</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            • النزالات ودية ومنظمة بإشراف تحكيمي وتدريبي كامل من مدربي المنتخب والأولمبياد.
            <br />
            • يتم اختيار الخصم المناسب والمتطابق بدقة مع وزنك ومستواك الفني.
            <br />
            • ارتداء واقي الرأس والقفازات الاحترافية (14/16 oz) إلزامي للسلامة.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {/* Name & Age */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                الاسم الكامل
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسمك الكريم..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 ps-9 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors text-right"
                />
                <User className="w-4 h-4 text-zinc-500 absolute top-3 left-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 text-center">
                العمر
              </label>
              <input
                type="tel"
                placeholder="24"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                required
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors text-center"
              />
            </div>
          </div>

          {/* Phone & Weight */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                رقم الهاتف / الواتساب
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
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
              <label className="block text-xs font-bold text-zinc-300 mb-1 text-center">
                الوزن (كغ)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="75"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors text-center"
                />
                <Scale className="w-3.5 h-3.5 text-zinc-500 absolute top-3 left-2.5 hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Boxing Experience Level */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>مستوى الخبرة في الملاكمة</span>
              <Award className="w-3.5 h-3.5 text-red-400" />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "beginner", label: "مبتدئ / هاوي" },
                { id: "intermediate", label: "متوسط" },
                { id: "advanced", label: "متقدم / بطولات" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperience(lvl.id as any)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                    experience === lvl.id
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30 border border-red-500"
                      : "bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Have you sparred before? */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              هل خضت سبارينغ في حلبة ملاكمة من قبل؟
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasSparredBefore("yes")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  hasSparredBefore === "yes"
                    ? "bg-zinc-800 text-emerald-400 border border-emerald-500/50"
                    : "bg-zinc-900 text-zinc-400 border border-white/5"
                }`}
              >
                نعم، لدي تجارب سابقة
              </button>
              <button
                type="button"
                onClick={() => setHasSparredBefore("no")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  hasSparredBefore === "no"
                    ? "bg-zinc-800 text-amber-400 border border-amber-500/50"
                    : "bg-zinc-900 text-zinc-400 border border-white/5"
                }`}
              >
                لا، ستكون أول تجربة لي
              </button>
            </div>
          </div>

          {/* Preferred Day */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              التوقيت واليوم المفضل للنزال
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "friday", label: "الجمعة (مفتوح)" },
                { id: "men_days", label: "رجال (سبت-اثنين-أربعاء)" },
                { id: "ladies_days", label: "سيدات (أحد-ثلاثاء-خميس)" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setPreferredDay(d.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                    preferredDay === d.id
                      ? "bg-white/15 text-white border border-white/30"
                      : "bg-zinc-900 text-zinc-400 border border-white/5"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>تأكيد طلب السبارينغ عبر الواتساب</span>
          </button>
        </form>

        <p className="mt-3 text-center text-[10px] text-zinc-500">
          سيتم التواصل معك لترتيب جولات النزال وتأكيد التوقيت المناسب مع الكابتن.
        </p>
      </div>
    </div>
  );
};
