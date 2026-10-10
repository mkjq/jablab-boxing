"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Phone, 
  User, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus
} from "lucide-react";
import { validateAndFormatJordanianPhone } from "@/lib/phone";

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/checkin";

  // Mode: "login" (لديه حساب) or "register" (مشترك جديد)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExistingChecking, setIsExistingChecking] = useState(true);

  // Live Jordanian Phone formatting preview
  const phoneValidation = validateAndFormatJordanianPhone(phone);

  // Check if member is already logged in
  useEffect(() => {
    fetch("/api/members/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace(redirectUrl);
        } else {
          setIsExistingChecking(false);
        }
      })
      .catch(() => setIsExistingChecking(false));
  }, [redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Phone strictly as Jordanian
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "يرجى إدخال رقم هاتف أردني صحيح (مثال: 0791234567)");
      return;
    }

    if (activeTab === "register") {
      if (!name.trim()) {
        setError("يرجى كتابة اسمك الكريم لإنشاء الحساب");
        return;
      }
      if (name.trim().length < 2) {
        setError("الاسم قصير جداً، يرجى كتابة اسمك الكامل");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/members/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: activeTab,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.notFound && activeTab === "login") {
          setError(data.error || "رقم الهاتف غير مسجل مسبقاً في النادي");
        } else {
          setError(data.error || "حدث خطأ أثناء معالجة البيانات، يرجى إعادة المحاولة");
        }
        setLoading(false);
        return;
      }

      // Login / registration successful! Forward directly to check-in or target page
      router.replace(redirectUrl);
    } catch (err) {
      console.error("Auth error:", err);
      setError("حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً");
      setLoading(false);
    }
  };

  if (isExistingChecking) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center text-white" dir="rtl">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  const isFromQr = redirectUrl.includes("checkin");

  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col justify-between p-4 sm:p-6" dir="rtl">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl shadow-lg shadow-red-600/30">
            🥊
          </div>
          <div>
            <h1 className="font-black text-lg text-white tracking-wide">JAB LAB BOXING</h1>
            <p className="text-xs text-zinc-400">بوابة اللاعبين والمتدربين</p>
          </div>
        </div>

        <a
          href="/"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/10"
        >
          الرئيسية
          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        </a>
      </header>

      {/* Main Container Card */}
      <main className="relative z-10 my-auto py-6 max-w-md w-full mx-auto">
        <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header Title & Context */}
          <div className="text-center space-y-2">
            {isFromQr && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-1">
                <QrCode className="w-3.5 h-3.5" />
                مسح الباركود واحتساب الحضور
              </div>
            )}
            <h2 className="text-2xl font-black text-white">
              {activeTab === "login" ? "تسجيل دخول المشتركين" : "إنشاء حساب لاعب جديد"}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {activeTab === "login"
                ? "أدخل رقم هاتفك المسجل للدخول السريع واحتساب حصتك"
                : "سجّل بياناتك لمرة واحدة فقط واحتسب حصتك فوراً"}
            </p>
          </div>

          {/* Dual Tabs: [ تسجيل الدخول ] | [ إنشاء حساب جديد ] */}
          <div className="grid grid-cols-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === "login"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setError(null);
              }}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === "register"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-red-400 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
                {error.includes("إنشاء حساب جديد") && activeTab === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setError(null);
                    }}
                    className="block text-amber-400 font-bold underline mt-1 text-xs"
                  >
                    اضغط هنا للانتقال إلى إنشاء حساب جديد 👈
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Only in Register Mode) */}
            {activeTab === "register" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>الاسم الكامل <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-zinc-500 font-normal">كما يظهر للكابتن في النادي</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد خالد المحمود"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Phone Number (Present in both modes) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>رقم الهاتف الأردني <span className="text-red-500">*</span></span>
                  <span className="text-xs">🇯🇴</span>
                </span>
                <span className="text-[10px] text-amber-400 font-normal">زين (079) • أورنج (077) • أمنية (078)</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="0791234567 أو 96279..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-right font-mono"
                />
              </div>

              {/* Dynamic Live Jordan Phone Status Preview */}
              {phone.trim() && (
                <div className="text-[11px] pt-1">
                  {phoneValidation.isValid ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono" dir="ltr">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{phoneValidation.phone} (معتمد ✓)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{phoneValidation.error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email (Optional - Only in Register Mode) */}
            {activeTab === "register" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>البريد الإلكتروني</span>
                  <span className="text-[10px] text-zinc-500 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    dir="ltr"
                    placeholder="player@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-right"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري التحقق والدخول...</span>
                </>
              ) : activeTab === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول واحتساب الحصة 🥊</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>إنشاء الحساب واحتساب الحصة 🥊</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Toggle Helper */}
          <div className="text-center pt-2">
            {activeTab === "login" ? (
              <p className="text-xs text-zinc-400">
                أول مرة تزور النادي؟{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setError(null);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold underline"
                >
                  أنشئ حسابك الجديد الآن
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                لديك حساب مسجل مسبقاً؟{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError(null);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold underline"
                >
                  سجل دخولك برقم الهاتف
                </button>
              </p>
            )}
          </div>

          {/* Features Checklist */}
          <div className="pt-3 border-t border-white/5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تسجيل سريع لمرة واحدة يظل محفوظاً في هاتفك لمدة 90 يوماً.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>يقبل أرقام الهواتف الأردنية بجميع الصيغ (079, 078, 077, +962).</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>في الزيارات القادمة، بمجرد مسح باركود النادي تُحسب حصتك في ثانية واحدة!</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 text-center py-4 border-t border-white/5 text-xs text-zinc-500">
        <p>Jab Lab Boxing Club • نادي الملاكمة الاحترافي</p>
      </footer>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080A] flex items-center justify-center text-white" dir="rtl">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      }
    >
      <MemberLoginForm />
    </Suspense>
  );
}
