"use client";

import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          openTime: parseInt(data.openTime),
          closeTime: parseInt(data.closeTime)
        })
      });
      if (res.ok) {
        setMessage("تم الحفظ بنجاح!");
      } else {
        setMessage("حدث خطأ أثناء الحفظ.");
      }
    } catch (err) {
      setMessage("حدث خطأ في الاتصال.");
    }
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-red-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">الإعدادات العامة</h1>
          <p className="text-zinc-400 text-sm mt-1">تعديل بيانات النادي، روابط التواصل، وأوقات العمل.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("نجاح") ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-red-500 mb-4 border-b border-zinc-800 pb-2">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">اسم النادي (عربي)</label>
              <input type="text" name="nameAr" value={data?.nameAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">اسم النادي (انجليزي)</label>
              <input type="text" name="nameEn" value={data?.nameEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">الاسم المختصر (Short Name)</label>
              <input type="text" name="shortName" value={data?.shortName || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">الشعار / التاجلاين (عربي)</label>
              <input type="text" name="taglineAr" value={data?.taglineAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">الشعار / التاجلاين (انجليزي)</label>
              <input type="text" name="taglineEn" value={data?.taglineEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (عربي)</label>
              <textarea name="descriptionAr" value={data?.descriptionAr || ""} onChange={handleChange} rows={2} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (انجليزي)</label>
              <textarea name="descriptionEn" value={data?.descriptionEn || ""} onChange={handleChange} rows={2} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-red-500 mb-4 border-b border-zinc-800 pb-2">التواصل والموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">رقم الهاتف (مع الفواصل للعرض)</label>
              <input type="text" name="phone" value={data?.phone || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">رقم الهاتف (للروابط بدون مسافات)</label>
              <input type="text" name="phoneRaw" value={data?.phoneRaw || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">رقم الواتساب</label>
              <input type="text" name="whatsapp" value={data?.whatsapp || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">البريد الإلكتروني</label>
              <input type="text" name="email" value={data?.email || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">رابط خرائط جوجل (Google Maps URL)</label>
              <input type="text" name="mapUrl" value={data?.mapUrl || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">الموقع (عربي)</label>
              <input type="text" name="locationAr" value={data?.locationAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">الموقع (انجليزي)</label>
              <input type="text" name="locationEn" value={data?.locationEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">العنوان التفصيلي (عربي)</label>
              <input type="text" name="addressAr" value={data?.addressAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">العنوان التفصيلي (انجليزي)</label>
              <input type="text" name="addressEn" value={data?.addressEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-red-500 mb-4 border-b border-zinc-800 pb-2">السوشيال ميديا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">يوزر الانستغرام (بدون @)</label>
              <input type="text" name="instagram" value={data?.instagram || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">رابط الانستغرام الكامل</label>
              <input type="text" name="instagramUrl" value={data?.instagramUrl || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">يوزر التيك توك (مع @)</label>
              <input type="text" name="tiktok" value={data?.tiktok || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">رابط التيك توك الكامل</label>
              <input type="text" name="tiktokUrl" value={data?.tiktokUrl || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-red-500 mb-4 border-b border-zinc-800 pb-2">أوقات الدوام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">نص الأيام العادية (عربي)</label>
              <input type="text" name="weekdaysAr" value={data?.weekdaysAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none" placeholder="السبت - الخميس: 6:00 ص - 11:00 م" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">نص الأيام العادية (انجليزي)</label>
              <input type="text" name="weekdaysEn" value={data?.weekdaysEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">نص يوم الجمعة (عربي)</label>
              <input type="text" name="fridayAr" value={data?.fridayAr || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none" placeholder="الجمعة: 10:00 ص - 8:00 م" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">نص يوم الجمعة (انجليزي)</label>
              <input type="text" name="fridayEn" value={data?.fridayEn || ""} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">وقت الفتح (للبرمجة - نظام 24)</label>
              <input type="number" name="openTime" value={data?.openTime || 6} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">وقت الإغلاق (للبرمجة - نظام 24)</label>
              <input type="number" name="closeTime" value={data?.closeTime || 23} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none text-left" dir="ltr" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
