"use client";

import React, { useEffect, useState } from "react";
import { Shield, Flame, Dumbbell, Coffee, Sparkles, Car, Star, Wifi, CheckCircle2 } from "lucide-react";
import { clubInfo } from "@/data/clubData";

export const AmenitiesGrid: React.FC = () => {
  const [amenities, setAmenities] = useState<any[]>(clubInfo.amenities);

  useEffect(() => {
    fetch("/api/amenities")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.amenities && data.amenities.length > 0) {
          setAmenities(data.amenities);
        }
      })
      .catch((err) => console.error("Amenities fetch error:", err));
  }, []);

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
      case "Wifi":
        return <Wifi className="w-4 h-4 text-cyan-400" />;
      case "Star":
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <section aria-label="Gym Amenities" className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-black text-white">تجهيزات ومرافق جاب لاب</h3>
        <span className="text-[10px] text-zinc-500 font-english uppercase tracking-wider">
          Facility Highlights
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {amenities.map((item) => (
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
