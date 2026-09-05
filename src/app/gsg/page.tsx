"use client";

import React, { useEffect, useState } from "react";
import { Users, Dumbbell, Link as LinkIcon, Calendar, DollarSign, Settings, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    coaches: 0,
    amenities: 0,
    links: 0,
    pricing: 0,
    sessions: 0,
    loading: true,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/coaches").then(r => r.json()).catch(() => ({ coaches: [] })),
      fetch("/api/amenities").then(r => r.json()).catch(() => ({ amenities: [] })),
      fetch("/api/action-links").then(r => r.json()).catch(() => ({ actionLinks: [] })),
      fetch("/api/pricing").then(r => r.json()).catch(() => ({ pricing: [] })),
      fetch("/api/schedule").then(r => r.json()).catch(() => ({ schedule: [] })),
    ]).then(([coachesRes, amenitiesRes, linksRes, pricingRes, scheduleRes]) => {
      setStats({
        coaches: coachesRes.coaches?.length || 0,
        amenities: amenitiesRes.amenities?.length || 0,
        links: linksRes.actionLinks?.length || 0,
        pricing: pricingRes.pricing?.length || 0,
        sessions: scheduleRes.schedule?.length || 0,
        loading: false,
      });
    });
  }, []);

  const cards = [
    { title: "الكباتن والمدربين", count: stats.coaches, icon: Users, href: "/gsg/coaches", color: "text-red-500", bg: "bg-red-600/10", border: "border-red-500/20" },
    { title: "المرافق والتجهيزات", count: stats.amenities, icon: Dumbbell, href: "/gsg/amenities", color: "text-amber-500", bg: "bg-amber-600/10", border: "border-amber-500/20" },
    { title: "الأزرار السريعة", count: stats.links, icon: LinkIcon, href: "/gsg/action-links", color: "text-blue-500", bg: "bg-blue-600/10", border: "border-blue-500/20" },
    { title: "باقات الاشتراكات", count: stats.pricing, icon: DollarSign, href: "/gsg/pricing", color: "text-emerald-500", bg: "bg-emerald-600/10", border: "border-emerald-500/20" },
    { title: "حصص الجدول الأسبوعي", count: stats.sessions, icon: Calendar, href: "/gsg/schedule", color: "text-purple-500", bg: "bg-purple-600/10", border: "border-purple-500/20" },
    { title: "الإعدادات العامة", count: "نشط", icon: Settings, href: "/gsg/settings", color: "text-zinc-400", bg: "bg-zinc-800", border: "border-white/10" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
          <p className="text-zinc-400 mt-1">أهلاً بك في نظام إدارة محتوى نادي جاب لاب للملاكمة 🥊</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={c.href}
              className="bg-zinc-950 border border-white/10 hover:border-white/20 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-zinc-400 font-bold mb-1 text-sm">{c.title}</p>
                  <h3 className="text-3xl font-black text-white">
                    {stats.loading && typeof c.count === "number" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    ) : (
                      c.count
                    )}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center ${c.color} border ${c.border}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-white font-bold transition-colors">
                <span>إدارة القسم</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
