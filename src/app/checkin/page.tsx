"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/navigation";
import Image from "next/image";
import { 
  CheckCircle2, 
  Dumbbell, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Trophy
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "success" | "already_checked" | "error">("loading");
  const [data, setData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E51937", "#D4AF37", "#ffffff", "#ff4d6d"],
      });
    } catch (e) {
      // Ignore if confetti not supported in preview
    }
  };

  const processCheckIn = async () => {
    try {
      // Step 1: Check if member is logged in
      const authRes = await fetch("/api/members/auth", { cache: "no-store" });
      const authData = await authRes.json();

      if (!authData.authenticated) {
        // Not logged in -> forward to login with redirect back to checkin
        router.replace("/member/login?redirect=/checkin");
        return;
      }

      // Step 2: Member is logged in -> Record check-in
      const checkinRes = await fetch("/api/members/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const checkinData = await checkinRes.json();

      if (!checkinRes.ok || !checkinData.success) {
        if (checkinData.requiresLogin) {
          router.replace("/member/login?redirect=/checkin");
          return;
        }
        setStatus("error");
        setErrorMessage(checkinData.error || "تعذر تسجيل الحصة حالياً");
        setLoading(false);
        return;
      }

      setData(checkinData);

      if (checkinData.alreadyCheckedIn) {
        setStatus("already_checked");
      } else {
        setStatus("success");
        triggerConfetti();
      }
      setLoading(false);
    } catch (err) {
      console.error("Check-in error:", err);
      setStatus("error");
      setErrorMessage("حدث خطأ في الاتصال بالخادم، يرجى المحاولة ثانية");
      setLoading(false);
    }
  };

  useEffect(() => {
    processCheckIn();
  }, []);

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
            <p className="text-xs text-red-500 font-bold uppercase tracking-wider">نظام الحضور الذكي</p>
          </div>
        </div>

        <a
          href="/member/profile"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <User className="w-3.5 h-3.5 text-red-500" />
          حسابي
        </a>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 my-auto py-8 max-w-md w-full mx-auto">
        {loading ? (
          <div className="bg-zinc-950/90 border border-white/10 rounded-3xl p-8 text-center space-y-5 backdrop-blur-xl shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-red-600/10 border-2 border-red-500/30 mx-auto flex items-center justify-center text-4xl animate-bounce">
              🥊
            </div>
            <div>
              <h2 className="text-xl font-black text-white">جاري التحقق وتسجيل الحصة...</h2>
              <p className="text-zinc-400 text-sm mt-1">لحظات لتسجيل حضورك في النادي</p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            </div>
          </div>
        ) : status === "success" ? (
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-red-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl shadow-red-950/40 relative overflow-hidden">
            {/* Top Badge Glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            {/* Success Icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-5xl shadow-2xl shadow-red-600/50 border-2 border-red-400/50">
                🥊
              </div>
              <div className="absolute -bottom-1 -left-1 bg-emerald-500 text-black p-1.5 rounded-full border-2 border-black">
                <CheckCircle2 className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Main Success Message */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                تم المسح بنجاح
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                تم حساب الحصة في النادي بنجاح! 🥊
              </h2>
              <p className="text-zinc-300 text-base">
                أهلاً بك يا كابتن <span className="text-red-400 font-bold">{data?.member?.name}</span>، عاش يا بطل!
              </p>
            </div>

            {/* Total Sessions Counter Card */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-5 text-right space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400 text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  إجمالي الحصص المسجلة:
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {data?.member?.totalCheckIns} <span className="text-xs text-zinc-400 font-normal">حصة</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  وقت الحضور:
                </span>
                <span className="text-zinc-300 font-mono" dir="ltr">
                  {new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  التاريخ:
                </span>
                <span className="text-zinc-300 font-mono">
                  {new Date().toLocaleDateString("ar-JO", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-zinc-300 flex items-center gap-2 text-right">
              <Flame className="w-5 h-5 text-red-500 shrink-0" />
              <span>لا تعد الأيام، اجعل الأيام تعد! تمرين قوي يا بطل. 🔥</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href="/member/profile"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30"
              >
                <span>عرض سجل حصصي وملفي الشخصي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </a>

              <a
                href="/"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-3 px-6 rounded-xl block transition-colors text-sm"
              >
                العودة للصفحة الرئيسية
              </a>
            </div>
          </div>
        ) : status === "already_checked" ? (
          <div className="bg-zinc-950/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 mx-auto flex items-center justify-center text-4xl">
              🥊
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                حضورك مسجل بالفعل
              </span>
              <h2 className="text-2xl font-black text-white">
                تم تسجيل حضورك مسبقاً!
              </h2>
              <p className="text-zinc-300 text-sm">
                كابتن <span className="text-amber-400 font-bold">{data?.member?.name}</span>، لقد تم احتساب هذه الحصة قبل قليل.
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-right space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">إجمالي حصصك المسجلة:</span>
                <span className="text-amber-400 font-bold text-xl">{data?.member?.totalCheckIns} حصة</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              النظام يمنع التكرار التلقائي في نفس الحصة لحماية رصيدك. استمتع بتمرينك! 💪
            </p>

            <div className="space-y-2 pt-2">
              <a
                href="/member/profile"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl block transition-colors text-sm"
              >
                عرض سجل الحصص
              </a>
              <a
                href="/"
                className="w-full bg-zinc-900 text-zinc-400 py-2.5 px-6 rounded-xl block text-sm"
              >
                الرئيسية
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">حدث خطأ أثناء تسجيل الحصة</h2>
              <p className="text-zinc-400 text-sm mt-1">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                setLoading(true);
                processCheckIn();
              }}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 text-center py-4 border-t border-white/5 text-xs text-zinc-500">
        <p>Jab Lab Boxing Club • نادي الملاكمة الاحترافي</p>
      </footer>
    </div>
  );
}
