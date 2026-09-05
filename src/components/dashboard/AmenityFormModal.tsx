"use client";

import React, { useState } from "react";
import { Amenity } from "@prisma/client";
import { X, Loader2, Save } from "lucide-react";

interface Props {
  amenity: Amenity | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AmenityFormModal({ amenity, onClose, onSaved }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Partial<Amenity>>(
    amenity || {
      nameAr: "",
      nameEn: "",
      descAr: "",
      descEn: "",
      icon: "Star",
      order: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = amenity ? `/api/amenities/${amenity.id}` : "/api/amenities";
      const method = amenity ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        onSaved();
      } else {
        alert("حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">
            {amenity ? "تعديل المرفق" : "إضافة مرفق جديد"}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="amenity-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الاسم (عربي)</label>
                <input required type="text" name="nameAr" value={data.nameAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الاسم (إنجليزي)</label>
                <input required type="text" name="nameEn" value={data.nameEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (عربي)</label>
                <textarea rows={2} required name="descAr" value={data.descAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (إنجليزي)</label>
                <textarea rows={2} required name="descEn" value={data.descEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white resize-none" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الأيقونة (Lucide)</label>
                <input required type="text" name="icon" value={data.icon} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
                <p className="text-xs text-zinc-500 mt-1">مثال: Wifi, Dumbbell, Coffee, Car</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الترتيب</label>
                <input type="number" name="order" value={data.order} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-white font-bold hover:bg-white/10 rounded-xl transition-colors">
            إلغاء
          </button>
          <button form="amenity-form" type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ المرفق
          </button>
        </div>
      </div>
    </div>
  );
}
