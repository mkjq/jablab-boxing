"use client";

import React from "react";
import { Phone, MessageCircle, MapPin, Instagram, Share2 } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { formatTelUrl, formatWhatsAppUrl } from "@/lib/utils";

interface QuickActionBarProps {
  onOpenShareModal: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onOpenShareModal }) => {
  const quickActions = [
    {
      id: "call",
      name: "Call Club",
      nameAr: "اتصال",
      href: formatTelUrl(clubInfo.phoneRaw),
      icon: Phone,
      color: "hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10",
      ariaLabel: "Call Jab Lab Boxing Club",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      nameAr: "واتساب",
      href: formatWhatsAppUrl(clubInfo.phoneRaw, "مرحباً نادي جاب لاب، أود الاستفسار عن التدريب والاشتراكات."),
      icon: MessageCircle,
      color: "hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10",
      ariaLabel: "Chat on WhatsApp with Jab Lab",
      isExternal: true,
    },
    {
      id: "maps",
      name: "Directions",
      nameAr: "الخريطة",
      href: clubInfo.mapUrl,
      icon: MapPin,
      color: "hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10",
      ariaLabel: "Open Jab Lab on Google Maps",
      isExternal: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      nameAr: "إنستغرام",
      href: clubInfo.instagramUrl,
      icon: Instagram,
      color: "hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10",
      ariaLabel: "Visit Jab Lab Instagram profile",
      isExternal: true,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto my-3 px-2">
      {quickActions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target={action.isExternal ? "_blank" : undefined}
          rel={action.isExternal ? "noopener noreferrer" : undefined}
          aria-label={action.ariaLabel}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-jab-card/90 border border-white/10 backdrop-blur-md text-zinc-300 transition-all duration-200 active:scale-90 shadow-md ${action.color}`}
        >
          <action.icon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight text-zinc-400">
            {action.nameAr}
          </span>
        </a>
      ))}

      <button
        type="button"
        onClick={onOpenShareModal}
        aria-label="Share Jab Lab profile or QR code"
        className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-jab-card/90 border border-white/10 backdrop-blur-md text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-200 active:scale-90 shadow-md"
      >
        <Share2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight text-zinc-400">
          مشاركة
        </span>
      </button>
    </div>
  );
};
