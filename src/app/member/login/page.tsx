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
  AlertCircle
} from "lucide-react";

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/checkin";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExistingChecking, setIsExistingChecking] = useState(true);

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

    if (!name.trim()) {
      setError("يرجى كتابة اسمك الكريم");
      return;
    }

    if (!phone.trim()) {
      setError("يرجى إدخال رقم هاتفك");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/members/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "تعذر تسجيل الدخول، يرجى التأكد من البيانات والمحاولة مجدداً");
        setLoading(false);
        return;
      }

      // Login / registration successful! Forward directly to check-in or target page
      router.replace(redirectUrl);
    } catch (err) {
      console.error("Login error:", err);
      setError("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
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

      {/* Main Login Card */}
      <main className="relative z-10 my-auto py-8 max-w-md w-full mx-auto">
        <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header Title & Context */}
          <div className="text-center space-y-2">
            {isFromQr && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-1">
                <QrCode className="w-3.5 h-3.5" />
                مسح الباركود واحتساب الحضور
              </div>
            )}
            <h2 className="text-2xl font-black text-white">تسجيل الدخول / إنشاء حساب</h2>
            <p className="text-zinc-400 text-sm">
              {isFromQr 
                ? "سجّل بياناتك لمرة واحدة فقط ليتم احتساب حصتك تلقائياً في كل مرة تمسح فيها الباركود!" 
                : "أدخل رقم هاتفك واسمك للدخول إلى حسابك ومتابعة حصصك"}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl flex items-center gap-2.5 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>الاسم الكامل <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-zinc-500 font-normal">كما تحب أن يظهر للكابتن</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد خالد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>رقم الهاتف <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-amber-400 font-normal">المعرّف الأساسي لحسابك</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="079XXXXXXX أو +962..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-right"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
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
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-right"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الحساب والدخول...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>دخول واحتساب الحصة 🥊</span>
                </>
              )}
            </button>
          </form>

          {/* Features Checklist */}
          <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تسجيل سريع لمرة واحدة يظل محفوظاً في هاتفك لمدة 90 يوماً.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>في الزيارات القادمة، بمجرد مسح الباركود تُحسب حصتك في ثانية واحدة!</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>يتم توثيق كل حصة بدقة مع كباتن Jab Lab Boxing.</span>
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

