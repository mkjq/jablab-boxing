"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Instagram, MessageCircle, Trophy, Shield, Sparkles } from "lucide-react";
import { Coach } from "@/types";
import { clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface CoachCardProps {
  coach: Coach;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  const [imageError, setImageError] = useState(false);

  const bookingUrl = formatWhatsAppUrl(clubInfo.phoneRaw, coach.whatsappMessageAr || "");

  let parsedSpecialties: string[] = [];
  try {
    parsedSpecialties = typeof coach.specialtiesAr === "string" 
      ? JSON.parse(coach.specialtiesAr) 
      : coach.specialtiesAr;
  } catch (e) {
    parsedSpecialties = [];
  }

  return (
    <a 
      href={coach.instagramUrl || "#"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="relative group block rounded-2xl bg-jab-card/90 border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Section with Gradient Overlay */}
      <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />

        {/* Coach Portrait */}
        {!imageError ? (
          <Image
            src={coach.image}
            alt={coach.nameAr}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-4 text-center">
            <Trophy className="w-10 h-10 text-red-500 mb-2 opacity-60" />
            <span className="text-xs font-bold text-zinc-300">{coach.nameAr}</span>
          </div>
        )}

        {/* Role Pill Badge */}
        <div className="absolute top-2 right-2 z-20">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/90 text-white backdrop-blur-md shadow-md border border-red-400/30">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>{coach.badgeAr}</span>
          </span>
        </div>

        {/* Coach Name Overlay at bottom of image */}
        <div className="absolute bottom-2 right-2 left-2 z-20 text-right">
          <h3 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow-md">
            {coach.nameAr}
          </h3>
          <p className="text-[10px] font-bold text-amber-400 font-english uppercase tracking-wider">
            {coach.nameEn}
          </p>
        </div>
      </div>

      {/* Card Content & Bio Snippet */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5 bg-zinc-900/60">
        <div className="text-right">
          <p className="text-[11px] font-semibold text-zinc-300 line-clamp-2 leading-relaxed">
            {coach.roleAr}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5 justify-end">
            {Array.isArray(parsedSpecialties) && parsedSpecialties.slice(0, 2).map((spec: string, i: number) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

      </div>
    </a>
  );
};
