"use client";

import React from "react";
import { MessageCircle, MapPin, Instagram } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { formatTelUrl, formatWhatsAppUrl } from "@/lib/utils";

export const QuickActionBar: React.FC = () => {
  const quickActions = [
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
    <div className="flex items-center justify-center gap-4 w-full max-w-sm mx-auto my-3 px-2">
      {quickActions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target={action.isExternal ? "_blank" : undefined}
          rel={action.isExternal ? "noopener noreferrer" : undefined}
          aria-label={action.ariaLabel}
          className={`flex flex-col items-center justify-center flex-1 h-16 rounded-2xl bg-jab-card/90 border border-white/10 backdrop-blur-md text-zinc-300 transition-all duration-200 active:scale-95 shadow-md ${action.color}`}
        >
          <action.icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium tracking-tight text-zinc-400">
            {action.nameAr}
          </span>
        </a>
      ))}
    </div>
  );
};
