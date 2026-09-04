"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Instagram, MessageCircle, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import { Coach } from "@/types";
import { clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface CoachDetailModalProps {
  coach: Coach | null;
  onClose: () => void;
}

export const CoachDetailModal: React.FC<CoachDetailModalProps> = ({ coach, onClose }) => {
  useEffect(() => {
    if (!coach) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [coach, onClose]);

  if (!coach) return null;

  const bookingUrl = formatWhatsAppUrl(clubInfo.phoneRaw, coach.whatsappMessageAr);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coach-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-right animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Portrait Header */}
        <div className="relative w-full h-56 bg-zinc-900">
          <Image
            src={coach.image}
            alt={coach.nameAr}
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Badge & Title */}
          <div className="absolute bottom-3 right-4 left-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-md mb-1.5">
              <span>{coach.badgeAr}</span>
            </span>
            <h2 id="coach-modal-title" className="text-xl sm:text-2xl font-black text-white">
              {coach.nameAr}
            </h2>
            <p className="text-xs font-bold text-amber-400 font-english uppercase tracking-wider">
              {coach.nameEn} • {coach.titleEn}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Credentials */}
          <div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/5">
            <div className="flex items-center gap-2 mb-1 text-red-400">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold">السيرة والإنجازات الرسمية</span>
            </div>
            <p className="text-sm font-semibold text-zinc-200 leading-relaxed">
              {coach.roleAr}
            </p>
            <p className="text-xs text-zinc-400 font-english mt-1">
              {coach.roleEn}
            </p>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              التخصصات التدريبية المتقدمة
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coach.specialtiesAr.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-medium text-zinc-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>حجز حصة 1-on-1 بالواتساب</span>
            </a>

            <a
              href={coach.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-pink-950/40 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 text-zinc-200 font-semibold text-sm transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>حساب الإنستغرام @{coach.instagram}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
