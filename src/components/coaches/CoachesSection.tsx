"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { coaches } from "@/data/coaches";
import { CoachCard } from "./CoachCard";

export const CoachesSection: React.FC = () => {
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
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {coaches.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
          />
        ))}
      </div>

    </section>
  );
};
