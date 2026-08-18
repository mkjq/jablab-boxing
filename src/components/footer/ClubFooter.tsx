"use client";

import React from "react";
import Image from "next/image";
import { Instagram, MessageCircle, MapPin, Radio, ShieldCheck } from "lucide-react";
import { clubInfo } from "@/data/clubData";

export const ClubFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-8 pt-8 pb-12 px-4 border-t border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-transparent to-black/80">
      {/* Brand Icon & Slogan */}
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-red-500/40 p-0.5 bg-zinc-900">
          <Image
            src="/images/logo.jpg"
            alt="Jab Lab Crest"
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h4 className="text-sm font-black text-white tracking-wider font-english uppercase">
          JAB LAB BOXING CLUB
        </h4>
        <p className="text-xs font-semibold text-zinc-400">
          حيث يُصنع الأبطال • عمّان، الأردن
        </p>
        <p className="text-[10px] text-zinc-500 font-english uppercase tracking-widest">
          Forged in Discipline • Built for Greatness
        </p>
      </div>

      {/* Social Icons Row */}
      <div className="flex items-center justify-center gap-3 my-4">
        <a
          href={clubInfo.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-pink-950/50 hover:text-pink-400 text-zinc-400 flex items-center justify-center border border-white/5 transition-colors"
        >
          <Instagram className="w-4 h-4" />
        </a>
        <a
          href={`https://wa.me/${clubInfo.phoneRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-emerald-950/50 hover:text-emerald-400 text-zinc-400 flex items-center justify-center border border-white/5 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <a
          href={clubInfo.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Maps Location"
          className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-red-950/50 hover:text-red-400 text-zinc-400 flex items-center justify-center border border-white/5 transition-colors"
        >
          <MapPin className="w-4 h-4" />
        </a>
      </div>

      {/* NFC & Copyright Badges */}
      <div className="flex flex-col items-center gap-1.5 pt-2 text-[10px] text-zinc-500">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-zinc-400 font-medium">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span>NFC Smart Card & Mobile Digital Experience</span>
        </div>
        <p className="mt-1">
          © {currentYear} {clubInfo.nameEn}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
