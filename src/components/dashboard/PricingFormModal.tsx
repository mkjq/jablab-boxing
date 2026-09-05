"use client";

import React, { useState } from "react";
import { PricingTier } from "@prisma/client";
import { X, Loader2, Save, Plus, Trash2 } from "lucide-react";

interface Props {
  pricing: PricingTier | null;
  onClose: () => void;
  onSaved: () => void;
}

export function PricingFormModal({ pricing, onClose, onSaved }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Parse features safely
  const initialFeaturesAr = pricing ? JSON.parse(pricing.featuresAr || "[]") : [""];
  const initialFeaturesEn = pricing ? JSON.parse(pricing.featuresEn || "[]") : [""];
  
  const [featuresAr, setFeaturesAr] = useState<string[]>(initialFeaturesAr.length ? initialFeaturesAr : [""]);
  const [featuresEn, setFeaturesEn] = useState<string[]>(initialFeaturesEn.length ? initialFeaturesEn : [""]);

  const [data, setData] = useState<Partial<PricingTier>>(
    pricing || {
      titleAr: "",
      titleEn: "",
      price: "",
      currency: "JOD",
      periodAr: "",
      periodEn: "",
      popular: false,
      badge: "",
      whatsappText: "",
      order: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const updateFeature = (lang: 'ar' | 'en', index: number, value: string) => {
    if (lang === 'ar') {
      const newFeatures = [...featuresAr];
      newFeatures[index] = value;
      setFeaturesAr(newFeatures);
    } else {
      const newFeatures = [...featuresEn];
      newFeatures[index] = value;
      setFeaturesEn(newFeatures);
    }
  };

  const addFeature = (lang: 'ar' | 'en') => {
    if (lang === 'ar') setFeaturesAr([...featuresAr, ""]);
    else setFeaturesEn([...featuresEn, ""]);
  };

  const removeFeature = (lang: 'ar' | 'en', index: number) => {
    if (lang === 'ar') {
      setFeaturesAr(featuresAr.filter((_, i) => i !== index));
    } else {
      setFeaturesEn(featuresEn.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const finalData = {
      ...data,
      featuresAr: JSON.stringify(featuresAr.filter(f => f.trim() !== "")),
      featuresEn: JSON.stringify(featuresEn.filter(f => f.trim() !== "")),
    };
    
    try {
      const url = pricing ? `/api/pricing/${pricing.id}` : "/api/pricing";
      const method = pricing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
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
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">
            {pricing ? "تعديل الاشتراك" : "إضافة اشتراك جديد"}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="pricing-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الاشتراك (عربي)</label>
                <input required type="text" name="titleAr" value={data.titleAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الاشتراك (إنجليزي)</label>
                <input required type="text" name="titleEn" value={data.titleEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">السعر</label>
                <input required type="text" name="price" value={data.price} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">العملة</label>
                <input required type="text" name="currency" value={data.currency} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الترتيب</label>
                <input type="number" name="order" value={data.order} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">المدة (عربي)</label>
                <input required type="text" name="periodAr" value={data.periodAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" placeholder="مثال: شهرياً" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">المدة (إنجليزي)</label>
                <input required type="text" name="periodEn" value={data.periodEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" placeholder="Ex: /month" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">نص رسالة الواتساب</label>
                <input required type="text" name="whatsappText" value={data.whatsappText} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" placeholder="مرحباً، أريد التسجيل في اشتراك..." />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <label className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-white/5 cursor-pointer">
                <input type="checkbox" name="popular" checked={data.popular} onChange={handleChange} className="w-5 h-5 rounded border-zinc-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-black" />
                <div>
                  <p className="font-bold text-white">تمييز كـ "الأكثر شيوعاً"</p>
                  <p className="text-xs text-zinc-400">سيجعل هذا الاشتراك بارزاً باللون الأحمر</p>
                </div>
              </label>
            </div>

            {data.popular && (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">نص شارة التمييز</label>
                  <input type="text" name="badge" value={data.badge} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" placeholder="مثال: الأكثر مبيعاً" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              {/* Features AR */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-white">المميزات (عربي)</label>
                  <button type="button" onClick={() => addFeature('ar')} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-bold">
                    <Plus className="w-3 h-3" />
                    إضافة ميزة
                  </button>
                </div>
                <div className="space-y-3">
                  {featuresAr.map((feat, index) => (
                    <div key={`ar-${index}`} className="flex gap-2">
                      <input type="text" value={feat} onChange={(e) => updateFeature('ar', index, e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="ميزة جديدة..." />
                      <button type="button" onClick={() => removeFeature('ar', index)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features EN */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-white">المميزات (إنجليزي)</label>
                  <button type="button" onClick={() => addFeature('en')} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-bold">
                    <Plus className="w-3 h-3" />
                    إضافة ميزة
                  </button>
                </div>
                <div className="space-y-3">
                  {featuresEn.map((feat, index) => (
                    <div key={`en-${index}`} className="flex gap-2">
                      <input type="text" value={feat} onChange={(e) => updateFeature('en', index, e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white" dir="ltr" placeholder="New feature..." />
                      <button type="button" onClick={() => removeFeature('en', index)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-white font-bold hover:bg-white/10 rounded-xl transition-colors">
            إلغاء
          </button>
          <button form="pricing-form" type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ الاشتراك
          </button>
        </div>
      </div>
    </div>
  );
}
