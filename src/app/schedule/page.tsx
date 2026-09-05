"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Flame,
  Swords,
  Sparkles,
  MessageCircle,
  Users,
  Heart,
  Trophy,
  Filter,
  CheckCircle2,
  Phone,
  MapPin,
} from "lucide-react";
import { clubInfo, scheduleData as defaultScheduleData } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";
import { TrialModal } from "@/components/modals/TrialModal";
import { SparringModal } from "@/components/modals/SparringModal";

const DAYS_META: { [key: string]: { dayEn: string; dayAr: string; group: "men" | "ladies" | "sparring" } } = {
  sat: { dayEn: "Saturday", dayAr: "السبت", group: "men" },
  sun: { dayEn: "Sunday", dayAr: "الأحد", group: "ladies" },
  mon: { dayEn: "Monday", dayAr: "الإثنين", group: "men" },
  tue: { dayEn: "Tuesday", dayAr: "الثلاثاء", group: "ladies" },
  wed: { dayEn: "Wednesday", dayAr: "الأربعاء", group: "men" },
  thu: { dayEn: "Thursday", dayAr: "الخميس", group: "ladies" },
  fri: { dayEn: "Friday", dayAr: "الجمعة", group: "sparring" },
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<any[]>(defaultScheduleData);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "men" | "ladies" | "sparring">("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [activeModal, setActiveModal] = useState<"trial" | "sparring" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.schedule && data.schedule.length > 0) {
          const dayMap: { [key: string]: any[] } = {};
          data.schedule.forEach((s: any) => {
            if (!dayMap[s.day]) dayMap[s.day] = [];
            dayMap[s.day].push({
              time: s.time,
              titleEn: s.titleEn,
              titleAr: s.titleAr,
              category: s.category,
              levelEn: s.levelEn,
              levelAr: s.levelAr,
              coachNameAr: s.coach?.nameAr || "",
              coachNameEn: s.coach?.nameEn || "",
              coachImage: s.coach?.image || "",
              coachRoleAr: s.coach?.roleAr || "",
            });
          });

          const dayOrder = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
          const formattedDays = dayOrder
            .filter((dId) => dayMap[dId] && dayMap[dId].length > 0)
            .map((dId) => ({
              id: dId,
              dayEn: DAYS_META[dId]?.dayEn || dId,
              dayAr: DAYS_META[dId]?.dayAr || dId,
              group: DAYS_META[dId]?.group || "men",
              sessions: dayMap[dId],
            }));

          if (formattedDays.length > 0) {
            setSchedule(formattedDays);
          }
        }
      })
      .catch((err) => console.error("Schedule load error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered days based on main group or specific day
  const filteredSchedule = schedule.filter((dayItem) => {
    const group = DAYS_META[dayItem.id]?.group || "men";
    if (selectedDay !== "all" && dayItem.id !== selectedDay) {
      return false;
    }
    if (selectedFilter !== "all" && group !== selectedFilter) {
      return false;
    }
    return true;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "ladies":
      case "females":
        return {
          bg: "bg-pink-950/80 text-pink-300 border-pink-500/40",
          label: "سيدات فقط",
        };
      case "kids":
        return {
          bg: "bg-sky-950/80 text-sky-300 border-sky-500/40",
          label: "أطفال وناشئين",
        };
      case "sparring":
        return {
          bg: "bg-red-950/80 text-red-400 border-red-500/40",
          label: "سبارينغ ونزالات",
        };
      case "pro":
        return {
          bg: "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
          label: "محترفين وبطولات",
        };
      case "conditioning":
        return {
          bg: "bg-orange-950/80 text-orange-300 border-orange-500/40",
          label: "إعداد بدني ولياقة",
        };
      default:
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-500/40",
          label: "ملاكمة تكنيكية",
        };
    }
  };

  return (
    <div className="relative min-h-screen bg-jab-void text-right text-zinc-100 selection:bg-red-600 selection:text-white pb-16">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs font-bold active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <h1 className="text-sm font-black text-white uppercase tracking-wider font-english">
                JAB LAB BOXING
              </h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-english">
                Weekly Class Timetable
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-md shadow-red-600/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center my-6 sm:my-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>جدول التدريب الأسبوعي المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            مواعيد وحصص التدريب بالتفصيل
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            برنامج تدريبي متكامل ومدروس من الصباح حتى المساء بإشراف كبار أبطال ومدربي المنتخب الوطني والأولمبي
          </p>
        </div>

        {/* Schedule Division Cards (Men/Kids vs Ladies vs Friday) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
          {/* Men & Kids Card */}
          <div
            onClick={() => {
              setSelectedFilter("men");
              setSelectedDay("all");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedFilter === "men"
                ? "bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-zinc-900/60 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">السبت • الإثنين • الأربعاء</h3>
                <span className="text-[10px] text-amber-400 font-bold uppercase">رجال وأطفال وناشئين</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              حصص ملاكمة صباحية ومسائية للرجال، وأكاديمية متخصصة لتطوير مهارات وبطولات الأشبال والناشئين.
            </p>
          </div>

          {/* Ladies Card */}
          <div
            onClick={() => {
              setSelectedFilter("ladies");
              setSelectedDay("all");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedFilter === "ladies"
                ? "bg-gradient-to-br from-pink-950/40 via-zinc-900 to-zinc-900 border-pink-500/50 shadow-lg shadow-pink-500/10"
                : "bg-zinc-900/60 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">الأحد • الثلاثاء • الخميس</h3>
                <span className="text-[10px] text-pink-400 font-bold uppercase">سيدات فقط (Ladies Only)</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              أيام مغلقة وخاصة 100% للسيدات؛ حصص حرق دهون، إعداد بدني HIIT، رشاقة قوام وملاكمة تكتيكية ودفاع عن النفس.
            </p>
          </div>

          {/* Friday Sparring Card */}
          <div
            onClick={() => {
              setSelectedFilter("sparring");
              setSelectedDay("all");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedFilter === "sparring"
                ? "bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 border-red-500/50 shadow-lg shadow-red-500/10"
                : "bg-zinc-900/60 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">يوم الجمعة</h3>
                <span className="text-[10px] text-red-400 font-bold uppercase">سبارينغ وتحدي مفتوح</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              نزالات سبارينغ وتحدي مفتوح في الحلبة لجميع الأوزان بإشراف أولمبي، وتدريبات خاصة واستشفاء رياضي.
            </p>
          </div>
        </div>

        {/* Dual CTA Actions: Free Trial & Sparring Match */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <button
            type="button"
            onClick={() => setActiveModal("trial")}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
          >
            <div className="text-right">
              <h4 className="font-black text-sm">احجز حصتك التجريبية المجانية</h4>
              <p className="text-[11px] text-red-100 opacity-90">جرّب تدريب جاب لاب مجاناً وبدون أي التزام</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("sparring")}
            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-red-500/40 text-white shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-red-400">احجز مباراة سبارينغ وتحدي</h4>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white">جديد</span>
              </div>
              <p className="text-[11px] text-zinc-400">اختبر مهاراتك ضد شباب وأبطال النادي في الحلبة</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
              <Swords className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Category & Day Filter Tabs */}
        <div className="my-6 space-y-3">
          {/* Main Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", label: "جميع الحصص والأيام" },
              { id: "men", label: "أيام الرجال والأطفال (سبت - اثنين - أربعاء)" },
              { id: "ladies", label: "أيام السيدات (أحد - ثلاثاء - خميس)" },
              { id: "sparring", label: "يوم السبارينغ المفتوح (الجمعة)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setSelectedFilter(f.id as any);
                  setSelectedDay("all");
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === f.id
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Specific Day Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setSelectedDay("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === "all"
                  ? "bg-white/20 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              الكل
            </button>
            {schedule.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDay(day.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedDay === day.id
                    ? "bg-zinc-800 text-white border border-white/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{day.dayAr}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    DAYS_META[day.id]?.group === "ladies"
                      ? "bg-pink-500"
                      : DAYS_META[day.id]?.group === "sparring"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Timetable Display */}
        <div className="space-y-6 my-6">
          {filteredSchedule.map((dayItem) => {
            const isLadies = DAYS_META[dayItem.id]?.group === "ladies";
            const isSparring = DAYS_META[dayItem.id]?.group === "sparring";

            return (
              <div
                key={dayItem.id}
                className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Day Header */}
                <div
                  className={`px-5 py-3.5 border-b border-white/10 flex items-center justify-between ${
                    isLadies
                      ? "bg-gradient-to-r from-pink-950/40 to-zinc-900"
                      : isSparring
                      ? "bg-gradient-to-r from-red-950/40 to-zinc-900"
                      : "bg-gradient-to-r from-amber-950/30 to-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isLadies
                          ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                          : isSparring
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {isLadies
                        ? "سيدات فقط"
                        : isSparring
                        ? "سبارينغ مفتوح"
                        : "رجال وأطفال"}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {dayItem.dayAr}
                    </h3>
                  </div>

                  <span className="text-[11px] text-zinc-400 font-english uppercase tracking-wider hidden sm:block">
                    {dayItem.dayEn}
                  </span>
                </div>

                {/* Day's Sessions List */}
                <div className="p-4 sm:p-5 space-y-3">
                  {dayItem.sessions.map((session: any, index: number) => {
                    const badge = getCategoryBadge(session.category);
                    const bookingMessage = `مرحباً نادي جاب لاب، أود الاستفسار والتسجيل في حصة (${session.titleAr}) يوم ${dayItem.dayAr} الساعة ${session.time}.`;
                    const waUrl = formatWhatsAppUrl(clubInfo.phoneRaw, bookingMessage);

                    return (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        {/* Time & Session Title */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* Time Block */}
                          <div className="flex-shrink-0 py-2 px-3 rounded-xl bg-zinc-950 border border-white/10 text-center min-w-[100px]">
                            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                              <Clock className="w-3 h-3 text-red-500" />
                              <span>التوقيت</span>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-white font-mono dir-ltr">
                              {session.time}
                            </span>
                          </div>

                          {/* Titles & Level */}
                          <div className="flex-1 min-w-0 text-right">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-sm sm:text-base font-bold text-white">
                                {session.titleAr}
                              </h4>
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg}`}
                              >
                                {badge.label}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-400 font-english mb-2">
                              {session.titleEn}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-zinc-500">المستوى:</span>
                                <span className="font-semibold text-zinc-300 text-[11px]">
                                  {session.levelAr}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="font-semibold text-zinc-300 text-[11px]">
                                  {session.coachNameAr}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Reservation Button */}
                        <div className="w-full md:w-auto flex items-center justify-end gap-2 flex-shrink-0">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                            <span>حجز مقعد عبر الواتساب</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Club Information & Notes */}
        <div className="p-5 my-8 rounded-3xl bg-zinc-950 border border-white/10 space-y-3 text-xs text-zinc-400">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ملاحظات هامة للمشتركين:</span>
          </h4>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
            <li>يرجى الحضور قبل موعد الحصة بـ 10 دقائق للإحماء وتجهيز ربطات اليد (Hand Wraps).</li>
            <li>كافة حصص السيدات مخصصة ومحمية بالكامل لضمان الخصوصية التامة.</li>
            <li>يمكن للمشتركين طلب جلسات تدريب فردية (Private Training) في أي وقت بالتنسيق مع الكابتن.</li>
            <li>الأوقات والمدربين قد تخضع لتحديثات دورية لتناسب كافة المشتركين.</li>
          </ul>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>هاتف / واتساب النادي: {clubInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{clubInfo.locationAr} - {clubInfo.addressAr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TrialModal
        isOpen={activeModal === "trial"}
        onClose={() => setActiveModal(null)}
      />
      <SparringModal
        isOpen={activeModal === "sparring"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
