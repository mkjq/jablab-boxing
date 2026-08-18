"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Sparkles, MessageCircle } from "lucide-react";
import { scheduleData, clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const [selectedDayId, setSelectedDayId] = useState(scheduleData[0].id);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDay = scheduleData.find((d) => d.id === selectedDayId) || scheduleData[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-right animate-scaleUp max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close schedule modal"
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div>
              <h2 id="schedule-modal-title" className="text-base sm:text-lg font-black text-white">
                جدول الحصص الأسبوعي
              </h2>
              <p className="text-[10px] text-amber-400 font-english uppercase tracking-wider">
                Weekly Class Schedule & Timetable
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Day Selector Tabs (Horizontal Scroll) */}
        <div className="p-2 border-b border-zinc-800/60 bg-zinc-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {scheduleData.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDayId === day.id
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              {day.dayAr}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {currentDay.sessions.map((session, index) => {
            const bookingMessage = `مرحباً نادي جاب لاب، أود الاستفسار والتسجيل في حصة (${session.titleAr}) يوم ${currentDay.dayAr} الساعة ${session.time}.`;
            const waUrl = formatWhatsAppUrl(clubInfo.phoneRaw, bookingMessage);

            return (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                {/* Session Info */}
                <div className="text-right flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">
                      {session.titleAr}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        session.category === "sparring"
                          ? "bg-red-950 text-red-400 border border-red-500/30"
                          : session.category === "ladies"
                          ? "bg-pink-950 text-pink-400 border border-pink-500/30"
                          : session.category === "kids"
                          ? "bg-sky-950 text-sky-400 border border-sky-500/30"
                          : "bg-amber-950 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {session.levelAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-english">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{session.coachNameAr}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Class Booking via WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex-shrink-0 w-full sm:w-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>حجز مقعد</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 text-center text-xs text-zinc-400">
          💡 للتسجيل أو الاستفسار عن الحصص الخاصة، يمكنك التواصل معنا مباشرة عبر الواتساب.
        </div>
      </div>
    </div>
  );
};
