"use client";

import React from "react";
import {
  Flame,
  Calendar,
  Trophy,
  MessageCircle,
  MapPin,
  Instagram,
  ChevronLeft,
  Sparkles,
  ArrowUpLeft,
} from "lucide-react";
import { ActionLink } from "@/types";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2">
        <stop stopColor="#feda75" offset="0"/>
        <stop stopColor="#fa7e1e" offset="0.25"/>
        <stop stopColor="#d62976" offset="0.5"/>
        <stop stopColor="#962fbf" offset="0.75"/>
        <stop stopColor="#4f5bd5" offset="1"/>
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.968-10.405a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
  </svg>
);

const GoogleMapsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#EA4335"/>
    <circle cx="12" cy="9" r="3.5" fill="#4285F4"/>
    <circle cx="12" cy="9" r="1.5" fill="#FBBC05"/>
  </svg>
);

interface LinkCardProps {
  link: ActionLink;
  onOpenModal: (modalId: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onOpenModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-5 h-5 text-red-400" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-amber-400" />;
      case "Trophy":
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case "MessageCircle":
        return <WhatsAppIcon className="w-6 h-6 drop-shadow-sm" />;
      case "MapPin":
        return <GoogleMapsIcon className="w-6 h-6 drop-shadow-sm" />;
      case "Instagram":
        return <InstagramIcon className="w-6 h-6 drop-shadow-sm" />;
      default:
        return <Sparkles className="w-5 h-5 text-zinc-400" />;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (link.actionType === "modal" && link.modalId) {
      e.preventDefault();
      onOpenModal(link.modalId);
    }
  };

  const isExternal = link.actionType === "link" || link.actionType === "whatsapp" || link.actionType === "map";

  const cardContent = (
    <div
      className={`relative group overflow-hidden w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 active:scale-[0.98] ${
        link.highlight
          ? "bg-gradient-to-r from-red-950/70 via-zinc-900/90 to-zinc-900/90 border-2 border-red-500/60 shadow-lg shadow-red-500/10 hover:border-red-400 hover:shadow-red-500/20"
          : "bg-jab-card/85 hover:bg-jab-cardHover border border-white/10 hover:border-white/20 shadow-md backdrop-blur-md"
      }`}
    >
      {/* Background Accent Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Right side in RTL (Icon and Titles) */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Icon Circle */}
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
            link.highlight
              ? "bg-red-500/20 border-red-500/40 shadow-inner"
              : "bg-zinc-800/80 border-white/10"
          }`}
        >
          {getIcon(link.icon)}
        </div>

        {/* Text Details */}
        <div className="flex flex-col text-right min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-red-400 transition-colors">
              {link.titleAr}
            </span>
            {link.badge && (
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  link.badgeColor === "red"
                    ? "bg-red-600 text-white shadow-sm shadow-red-600/50 animate-pulse"
                    : link.badgeColor === "gold"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-zinc-700/60 text-zinc-300 border border-white/10"
                }`}
              >
                {link.badge}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 font-medium truncate mt-0.5">
            {link.subtitleAr}
          </span>
          <span className="text-[10px] text-zinc-500 font-english uppercase tracking-wider hidden sm:block">
            {link.titleEn}
          </span>
        </div>
      </div>

      {/* Left side in RTL (Chevron or External Arrow) */}
      <div className="flex-shrink-0 me-1">
        {isExternal ? (
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <ArrowUpLeft className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  if (link.actionType === "modal") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full text-right focus:outline-none"
        aria-label={`Open ${link.titleEn} modal`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block w-full focus:outline-none"
      aria-label={`${link.titleEn} link`}
    >
      {cardContent}
    </a>
  );
};
