"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  ExternalLink, 
  QrCode, 
  Flame,
  CheckCircle2,
  Copy
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QrPosterPage() {
  const [baseUrl, setBaseUrl] = useState("https://jablab.mkq.one/checkin");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.origin}/checkin`);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const svgElement = document.getElementById("qr-svg-code");
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "jablab-checkin-qr.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8" dir="rtl">
      {/* Top Controls Bar - Hidden on print */}
      <div className="print:hidden max-w-4xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/gsg/members"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl transition-colors border border-white/5"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-red-500" />
                بوستر باركود الحائط الرسمي (A4)
              </h1>
              <p className="text-xs text-zinc-400">
                جاهز للطباعة والتعليق على جدار النادي عند المدخل أو الرسبشن
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={downloadSvg}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل الكود كصورة SVG</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوستر الآن</span>
            </button>
          </div>
        </div>

        {/* Dynamic Target URL Setting */}
        <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
          <span className="text-zinc-400 whitespace-nowrap font-bold">الرابط المبرمج في الباركود:</span>
          <div className="flex-1 flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg border border-white/5">
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="bg-transparent border-none text-white text-xs flex-1 focus:outline-none font-mono"
              dir="ltr"
            />
            <button
              onClick={copyUrl}
              className="text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/40 text-[11px]"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ" : "نسخ"}</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">
            * يمكنك تعديل الرابط لأي نطاق رسمي (مثلاً: https://jablab.mkq.one/checkin) وسيتحدث الكود فوراً!
          </p>
        </div>
      </div>

      {/* The Printable A4 Poster Sheet */}
      <div className="flex justify-center">
        <div
          ref={printRef}
          className="print-poster-container w-[210mm] min-h-[297mm] bg-black text-white p-12 border-2 border-red-600/60 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col justify-between print:m-0 print:border-none print:w-full print:h-full print:rounded-none print:p-8"
        >
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="text-center space-y-3 relative z-10 border-b border-red-600/30 pb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-red-600/40 border border-red-400/50">
              🥊
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-widest text-white uppercase font-sans">
                JAB LAB BOXING
              </h2>
              <p className="text-sm font-bold text-red-500 uppercase tracking-widest mt-0.5">
                ELITE BOXING & ATHLETIC CLUB
              </p>
            </div>
          </div>

          {/* Central QR Code Section */}
          <div className="my-auto text-center space-y-8 relative z-10 py-6">
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-sm font-black">
                نظام تسجيل الحضور الذكي
              </span>
              <h3 className="text-3xl font-black text-white">
                امسح الباركود لتسجيل حصتك في النادي
              </h3>
              <p className="text-zinc-400 text-sm">
                Scan the QR Code to check-in and count your session
              </p>
            </div>

            {/* High-Resolution QR Card */}
            <div className="relative inline-block p-6 rounded-3xl bg-white border-4 border-red-600 shadow-2xl">
              <div id="qr-svg-wrapper">
                <QRCodeSVG
                  id="qr-svg-code"
                  value={baseUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/images/logo.jpg",
                    x: undefined,
                    y: undefined,
                    height: 52,
                    width: 52,
                    excavate: true,
                  }}
                />
              </div>
              <div className="absolute -bottom-3 inset-x-8 bg-red-600 text-white py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md">
                JAB LAB ATTENDANCE
              </div>
            </div>

            {/* Instructions Steps */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6 text-right">
              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  1
                </div>
                <h4 className="font-bold text-xs text-white">افتح الكاميرا</h4>
                <p className="text-[10px] text-zinc-400">وجه كاميرا هاتفك نحو الباركود</p>
              </div>

              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  2
                </div>
                <h4 className="font-bold text-xs text-white">سجل الدخول</h4>
                <p className="text-[10px] text-zinc-400">سجل رقمك لمرة واحدة فقط</p>
              </div>

              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  3
                </div>
                <h4 className="font-bold text-xs text-white">تُحسب الحصة!</h4>
                <p className="text-[10px] text-zinc-400">تظهر رسالة التأكيد وعداد حصصك</p>
              </div>
            </div>
          </div>

          {/* Poster Bottom Footer */}
          <div className="border-t border-red-600/30 pt-6 text-center space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 text-zinc-300 font-bold text-sm">
              <Flame className="w-4 h-4 text-red-500" />
              <span>لا تعد الأيام، اجعل الأيام تعد! • تمرن بقوة، تمرن كبطل</span>
            </div>
            <p className="text-xs text-zinc-500" dir="ltr">
              {baseUrl}
            </p>
          </div>
        </div>
      </div>

      {/* Global CSS for Print Media */}
      <style jsx global>{`
        @media print {
          body {
            background-color: black !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          aside, nav, header {
            display: none !important;
          }
          .print-poster-container {
            width: 100% !important;
            min-height: 100vh !important;
            border: none !important;
            box-shadow: none !important;
            padding: 20mm !important;
          }
        }
      `}</style>
    </div>
  );
}
