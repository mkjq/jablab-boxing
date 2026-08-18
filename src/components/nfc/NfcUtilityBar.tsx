"use client";

import React, { useState } from "react";
import { UserPlus, QrCode, Check, Download } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { downloadClubVCard } from "@/lib/vcard";

interface NfcUtilityBarProps {
  onOpenShareModal: () => void;
}

export const NfcUtilityBar: React.FC<NfcUtilityBarProps> = ({ onOpenShareModal }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadContact = () => {
    try {
      // Trigger client-side direct download or API fallback
      const link = document.createElement("a");
      link.href = "/api/vcard";
      link.download = "JabLabBoxing.vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (e) {
      console.error("vCard download error:", e);
    }
  };

  return (
    <section aria-label="NFC Smart Actions" className="w-full my-2 px-2">
      <div className="grid grid-cols-2 gap-2.5">
        {/* Save Contact Button */}
        <button
          type="button"
          onClick={handleDownloadContact}
          className="relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />
              <span className="font-extrabold">تم الحفظ بنجاح!</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              <span className="font-bold">حفظ جهة الاتصال</span>
            </>
          )}
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
