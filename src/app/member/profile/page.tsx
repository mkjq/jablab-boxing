"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Trophy, 
  QrCode, 
  LogOut, 
  ArrowLeft, 
  Loader2, 
  Award, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function MemberProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/members/auth", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.member) {
        setMember(data.member);
      } else {
        router.replace("/member/login?redirect=/member/profile");
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (!confirm("هل تريد تسجيل الخروج من حسابك؟")) return;
    await fetch("/api/members/auth", { method: "DELETE" });
    router.replace("/member/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center text-white" dir="rtl">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col justify-between p-4 sm:p-6" dir="rtl">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl shadow-lg shadow-red-600/30">
            🥊
          </div>
          <div>
            <h1 className="font-black text-lg text-white tracking-wide">JAB LAB BOXING</h1>
            <p className="text-xs text-zinc-400">بطاقة المتدرب وسجل الحصص</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10"
          >
            الرئيسية
          </a>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            خروج
          </button>
        </div>
      </header>

      {/* Main Profile & Stats */}
      <main className="relative z-10 my-6 max-w-xl w-full mx-auto space-y-6">
        {/* Digital Membership Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-red-500/30 shadow-2xl overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                عضوية معتمدة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                {member?.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1" dir="ltr">
                  <Phone className="w-3 h-3 text-red-400" />
                  {member?.phone}
                </span>
                {member?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-zinc-500" />
                    {member?.email}
                  </span>
                )}
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
              🥊
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-zinc-400 flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                إجمالي الحصص
              </span>
              <p className="text-3xl font-black text-amber-400 font-mono">
                {member?.totalCheckIns || 0}
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-zinc-400 flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                تاريخ الانضمام
              </span>
              <p className="text-sm font-bold text-white mt-2" dir="ltr">
                {member?.createdAt ? new Date(member.createdAt).toLocaleDateString("en-GB") : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Check-in CTA */}
        <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">هل أنت متواجد في النادي الآن؟</h4>
              <p className="text-xs text-zinc-400">امسح باركود الحائط لاحتساب حصتك اليومية فوراً</p>
            </div>
          </div>

          <a
            href="/checkin"
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-lg shadow-red-600/20"
          >
            تسجيل الحصة
          </a>
        </div>

        {/* Attendance History */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-black text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              سجل آخر الحصص
            </h3>
            <span className="text-xs text-zinc-500">آخر 10 زيارات</span>
          </div>

          {member?.recentCheckIns?.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 space-y-2">
              <p className="text-sm">لم تسجل أي حصة بعد!</p>
              <p className="text-xs">امسح باركود النادي عند وصولك لتظهر حصصك هنا 🥊</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {member?.recentCheckIns?.map((checkIn: any, idx: number) => {
                const date = new Date(checkIn.createdAt);
                return (
                  <div
                    key={checkIn.id || idx}
                    className="flex items-center justify-between p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 rounded-xl text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                        #{member.totalCheckIns - idx}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          حصة تمرين ملاكمة
                        </p>
                        <p className="text-zinc-500 text-[11px]">
                          {checkIn.source === "MANUAL_CAPTAIN" ? "مسجلة يدوياً من الكابتن" : "مسح باركود النادي"}
                        </p>
                      </div>
                    </div>

                    <div className="text-left space-y-0.5">
                      <p className="font-medium text-zinc-300">
                        {date.toLocaleDateString("ar-JO", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-zinc-500 font-mono text-[10px]" dir="ltr">
                        {date.toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 text-center py-4 border-t border-white/5 text-xs text-zinc-500">
        <p>Jab Lab Boxing Club • نادي الملاكمة الاحترافي</p>
      </footer>
    </div>
  );
}
