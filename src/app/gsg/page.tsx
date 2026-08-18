"use client";

import React, { useEffect, useState } from "react";
import { Users, Dumbbell, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ coaches: 0, loading: true });

  useEffect(() => {
    // In a real app, this would fetch actual stats from a dashboard API
    // For now, we simulate a quick load
    setTimeout(() => {
      setStats({ coaches: 4, loading: false }); // Placeholder count
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
          <p className="text-zinc-400 mt-1">أهلاً بك في نظام إدارة محتوى جاب لاب</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-600/10 transition-colors" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-400 font-bold mb-1">عدد الكباتن</p>
              <h3 className="text-4xl font-black text-white">
                {stats.loading ? <Loader2 className="w-8 h-8 animate-spin text-red-500" /> : stats.coaches}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <Link href="/gsg/coaches" className="inline-block mt-4 text-sm text-red-400 font-bold hover:text-red-300">
            إدارة الكباتن &larr;
          </Link>
        </div>

        {/* Placeholder Card 2 */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 opacity-50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-400 font-bold mb-1">الحصص الأسبوعية</p>
              <h3 className="text-4xl font-black text-white">12</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Dumbbell className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500 font-bold">قريباً...</p>
        </div>

        {/* Placeholder Card 3 */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 opacity-50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-400 font-bold mb-1">الروابط السريعة</p>
              <h3 className="text-4xl font-black text-white">5</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <LinkIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500 font-bold">قريباً...</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 text-center mt-12">
        <h2 className="text-xl font-black mb-2">🚀 لوحة التحكم قيد التطوير</h2>
        <p className="text-zinc-400 text-sm">
          يمكنك الآن التوجه إلى صفحة الكباتن لإدارتهم وتعديل بياناتهم.
        </p>
        <Link 
          href="/gsg/coaches"
          className="inline-flex mt-6 bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          الذهاب لصفحة الكباتن
        </Link>
      </div>
    </div>
  );
}
