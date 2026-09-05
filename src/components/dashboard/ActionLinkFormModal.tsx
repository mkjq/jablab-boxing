"use client";

import React, { useState } from "react";
import { ActionLink } from "@prisma/client";
import { X, Loader2, Save } from "lucide-react";

interface Props {
  link: ActionLink | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ActionLinkFormModal({ link, onClose, onSaved }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Partial<ActionLink>>(
    link || {
      titleAr: "",
      titleEn: "",
      subtitleAr: "",
      subtitleEn: "",
      icon: "",
      badge: "",
      badgeColor: "",
      actionType: "link",
      modalId: "",
      href: "",
      highlight: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = link ? `/api/action-links/${link.id}` : "/api/action-links";
      const method = link ? "PUT" : "POST";
      
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
            {link ? "تعديل الرابط" : "إضافة رابط جديد"}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="link-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">العنوان (عربي)</label>
                <input required type="text" name="titleAr" value={data.titleAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">العنوان (إنجليزي)</label>
                <input required type="text" name="titleEn" value={data.titleEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (عربي)</label>
                <input type="text" name="subtitleAr" value={data.subtitleAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الوصف (إنجليزي)</label>
                <input type="text" name="subtitleEn" value={data.subtitleEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">نوع الرابط</label>
                <select name="actionType" value={data.actionType} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white">
                  <option value="link">رابط عادي</option>
                  <option value="modal">نافذة منبثقة</option>
                  <option value="whatsapp">واتساب</option>
                  <option value="map">موقع خرائط</option>
                  <option value="tel">رقم هاتف</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الأيقونة (Lucide)</label>
                <input required type="text" name="icon" value={data.icon} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
                <p className="text-xs text-zinc-500 mt-1">مثال: MapPin, Phone, MessageCircle, UserPlus, Info</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  {data.actionType === 'modal' ? 'معرّف النافذة (Modal ID)' : 'الرابط (URL)'}
                </label>
                {data.actionType === 'modal' ? (
                  <div className="space-y-1">
                    <input type="text" name="modalId" value={data.modalId || ''} onChange={handleChange} placeholder="sparring أو trial أو schedule أو qr" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
                    <p className="text-[11px] text-zinc-500">نوافذ جاهزة: sparring (سبارينغ وتحدي), trial (حصة مجانية), schedule (الجدول), qr (مشاركة)</p>
                  </div>
                ) : (
                  <input type="text" name="href" value={data.href || ''} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الترتيب</label>
                <input type="number" name="order" value={data.order} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">شارة (Badge)</label>
                <input type="text" name="badge" value={data.badge} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">لون الشارة</label>
                <select name="badgeColor" value={data.badgeColor} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white">
                  <option value="">تلقائي</option>
                  <option value="red">أحمر</option>
                  <option value="green">أخضر</option>
                  <option value="blue">أزرق</option>
                  <option value="yellow">أصفر</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-white/5 cursor-pointer">
              <input type="checkbox" name="highlight" checked={data.highlight} onChange={handleChange} className="w-5 h-5 rounded border-zinc-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-black" />
              <div>
                <p className="font-bold text-white">تمييز الرابط</p>
                <p className="text-xs text-zinc-400">سيجعل الزر أحمر اللون وبارز للعين</p>
              </div>
            </label>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-white font-bold hover:bg-white/10 rounded-xl transition-colors">
            إلغاء
          </button>
          <button form="link-form" type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ الرابط
          </button>
        </div>
      </div>
    </div>
  );
}
