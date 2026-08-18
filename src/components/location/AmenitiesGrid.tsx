"use client";

import React from "react";
import { Shield, Flame, Dumbbell, Coffee, Sparkles, Car } from "lucide-react";
import { clubInfo } from "@/data/clubData";

export const AmenitiesGrid: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="w-4 h-4 text-amber-400" />;
      case "Flame":
        return <Flame className="w-4 h-4 text-red-400" />;
      case "Dumbbell":
        return <Dumbbell className="w-4 h-4 text-rose-400" />;
      case "Coffee":
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case "Car":
        return <Car className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <section aria-label="Gym Amenities" className="w-full my-4 px-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-black text-white">تجهيزات ومرافق جاب لاب</h3>
        <span className="text-[10px] text-zinc-500 font-english uppercase tracking-wider">
          Facility Highlights
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {clubInfo.amenities.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-white/10 text-right flex flex-col justify-between transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center mb-1.5 ms-auto">
              {getIcon(item.icon)}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200 leading-tight">
                {item.nameAr}
              </p>
              <p className="text-[9px] text-zinc-500 font-english mt-0.5 truncate">
                {item.nameEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
