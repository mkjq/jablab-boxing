"use client";

import React, { useState, useEffect } from "react";
import { X, QrCode, Copy, Check, Share2, MessageCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clubInfo } from "@/data/clubData";

interface ShareQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareQrModal: React.FC<ShareQrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://jablabboxing.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.href);
    }
  }, [isOpen]);

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

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(siteUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Jab Lab Boxing Club | نادي جاب لاب للملاكمة",
          text: "اكتشف نادي جاب لاب للملاكمة في عمّان - تدريب نخبوي بإشراف أبطال أولمبيين!",
          url: siteUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-center animate-scaleUp p-5 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share modal"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2 mt-1">
          <QrCode className="w-6 h-6" />
        </div>
        <h2 id="share-modal-title" className="text-lg font-black text-white">
          امسح لمشاركة بطاقة النادي
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Scan QR Code or share instant link
        </p>

        {/* QR Code Container */}
        <div className="my-4 p-4 rounded-2xl bg-white shadow-xl flex items-center justify-center">
          <QRCodeSVG
            value={siteUrl}
            size={180}
            level="H"
            includeMargin={false}
            fgColor="#08080A"
            bgColor="#FFFFFF"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-white font-bold text-xs transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-400">تم نسخ الرابط بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>نسخ رابط الصفحة (Copy Link)</span>
              </>
            )}
          </button>

          {/* Native Share Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة عبر التطبيقات (Share)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
