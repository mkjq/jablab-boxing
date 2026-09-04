"use client";

import React, { useState, useEffect } from "react";
import { Clock, MapPin, Navigation, Phone, ExternalLink } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { isClubOpen } from "@/lib/utils";

export const LocationHours: React.FC = () => {
  const [status, setStatus] = useState({
    isOpen: true,
    textEn: "Open Now • Closes at 11:00 PM",
    textAr: "مفتوح الآن • يغلق عند 11:00 م",
  });

  useEffect(() => {
    setStatus(isClubOpen(clubInfo.hours.openTime, clubInfo.hours.closeTime));
    const interval = setInterval(() => {
      setStatus(isClubOpen(clubInfo.hours.openTime, clubInfo.hours.closeTime));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-label="Location and Working Hours" className="w-full">
      <div className="rounded-2xl bg-jab-card/90 border border-white/10 p-4 shadow-lg backdrop-blur-md">
        {/* Status Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status.isOpen ? "bg-emerald-500 animate-ping" : "bg-red-500"
              }`}
            />
            <span
              className={`text-xs font-bold ${
                status.isOpen ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {status.textAr}
            </span>
          </div>

          <span className="text-[10px] text-zinc-500 font-english uppercase tracking-wider">
            Amman, Jordan
          </span>
        </div>

        {/* Working Hours Rows */}
        <div className="py-3 space-y-2 text-right">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold font-english">
              {clubInfo.hours.weekdaysEn.split(": ")[1]}
            </span>
            <span className="text-zinc-400 font-medium">السبت – الخميس</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold font-english">
              {clubInfo.hours.fridayEn.split(": ")[1]}
            </span>
            <span className="text-zinc-400 font-medium">الجمعة</span>
          </div>
        </div>

        {/* Location & Navigation CTA */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-start gap-2 text-right">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">{clubInfo.addressAr}</p>
              <p className="text-[10px] text-zinc-400 font-english">{clubInfo.addressEn}</p>
            </div>
          </div>

          <a
            href={clubInfo.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs transition-all active:scale-98"
          >
            <Navigation className="w-3.5 h-3.5 text-red-400" />
            <span>فتح الاتجاهات عبر Google Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};
