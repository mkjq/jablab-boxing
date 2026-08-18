"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { CoachCard } from "./CoachCard";
import { getCoaches } from "@/app/actions/coaches";
import { Coach } from "@prisma/client";

export const CoachesSection = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await getCoaches();
        if (res.success && res.coaches) {
          setCoaches(res.coaches);
        } else {
          setError(res.error || "Unknown error occurred");
        }
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <section aria-label="Elite Coaches Roster" className="w-full my-4 px-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-right">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              كادر ومدربو جاب لاب النخبوي
            </h2>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-english">
              Elite Championship Coaching Staff
            </p>
          </div>
        </div>
      </div>

      {/* 2x2 Responsive Grid */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-xl text-center text-sm">
          {error}
        </div>
      ) : coaches.length === 0 ? (
        <div className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-center text-sm">
          لا يوجد مدربين متاحين حالياً
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach as any}
            />
          ))}
        </div>
      )}
    </section>
  );
};
