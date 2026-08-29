"use client";

import React, { useState } from "react";
import { QrCode, PhoneCall } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { downloadClubVCard } from "@/lib/vcard";

interface NfcUtilityBarProps {
  onOpenShareModal: () => void;
}

export const NfcUtilityBar: React.FC<NfcUtilityBarProps> = ({ onOpenShareModal }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${clubInfo.phoneRaw}`;
  };

  return (
    <section aria-label="NFC Smart Actions" className="w-full my-2 px-2">
      <div className="grid grid-cols-2 gap-2.5">
        {/* Call Now Button */}
        <button
          type="button"
          onClick={handleCall}
          className="relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <PhoneCall className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
          <span className="font-bold">اتصال فوري</span>
        </button>

        {/* Share QR Code Button */}
        <button
          type="button"
          onClick={onOpenShareModal}
          className="relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all duration-200 backdrop-blur-md"
        >
          <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <QrCode className="w-4 h-4 text-red-400" />
          <span>مشاركة / QR</span>
        </button>
      </div>
    </section>
  );
};
