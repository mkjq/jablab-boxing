"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { QuickActionBar } from "./QuickActionBar";

interface ClubHeaderProps {
  onOpenShareModal: () => void;
}

export const ClubHeader: React.FC<ClubHeaderProps> = ({ onOpenShareModal }) => {
  const [info, setInfo] = React.useState(clubInfo);

  React.useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.nameAr) {
          setInfo((prev) => ({
            ...prev,
            nameAr: data.nameAr,
            nameEn: data.nameEn,
            taglineAr: data.taglineAr,
            taglineEn: data.taglineEn,
            locationAr: data.locationAr,
            locationEn: data.locationEn,
          }));
        }
      })
      .catch((err) => console.error("ClubHeader settings fetch error:", err));
  }, []);

  return (
    <header className="flex flex-col items-center text-center pt-2 pb-1 px-4 relative z-10">
      {/* Glowing Logo Container */}
      <div className="relative mb-3 group cursor-pointer">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulse-glow transition duration-1000" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-2xl border-2 border-red-500/50 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/logo.jpg"
            alt="Jab Lab Boxing Official Logo"
            width={112}
            height={112}
            priority
            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23E51937' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m19 14 1.5-1.5a2.121 2.121 0 0 0-3-3l-3.5 3.5'%3E%3C/path%3E%3Cpath d='m8 15-3.5 3.5a2.121 2.121 0 0 0 3 3L11 18'%3E%3C/path%3E%3Cpath d='m2 2 20 20'%3E%3C/path%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Verified Badge Icon */}
        <div
          title="Official Verified Boxing Club"
          className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-1 border-2 border-zinc-950 shadow-lg flex items-center justify-center"
        >
          <CheckCircle2 className="w-4 h-4 text-white fill-red-600" />
        </div>
      </div>

      {/* Club Title (Bilingual) */}
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
        <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
          {info.nameAr}
        </span>
      </h1>
      <p className="text-xs sm:text-sm font-extrabold tracking-widest text-red-500 uppercase mt-0.5 font-english">
        {info.nameEn}
      </p>

      {/* Tagline & Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/60 text-red-300 border border-red-500/30 backdrop-blur-md">
          <span>{info.taglineAr}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900/80 text-zinc-300 border border-white/10 backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>{info.locationAr}</span>
        </span>
      </div>

      {/* Quick Action Floating Bar */}
      <QuickActionBar />
    </header>
  );
};
