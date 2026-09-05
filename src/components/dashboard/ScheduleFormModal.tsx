"use client";

import React, { useState, useEffect } from "react";
import { ClassSession, Coach } from "@prisma/client";
import { X, Loader2, Save } from "lucide-react";

interface Props {
  session: ClassSession | null;
  coaches: Coach[];
  onClose: () => void;
  onSaved: () => void;
}

export function ScheduleFormModal({ session, coaches, onClose, onSaved }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Partial<ClassSession>>(
    session || {
      day: "sat",
      time: "18:00",
      titleAr: "",
      titleEn: "",
      category: "mixed",
      levelAr: "مبتدئ / متوسط",
      levelEn: "Beginner / Intermediate",
      coachId: coaches.length > 0 ? coaches[0].id : "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.coachId) {
      alert("يجب اختيار كابتن للحصة");
      return;
    }
    
    setIsSaving(true);
    try {
      const url = session ? `/api/schedule/${session.id}` : "/api/schedule";
      const method = session ? "PUT" : "POST";
      
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
            {session ? "تعديل الحصة" : "إضافة حصة جديدة"}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="schedule-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اليوم</label>
                <select required name="day" value={data.day} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white">
                  <option value="sat">السبت</option>
                  <option value="sun">الأحد</option>
                  <option value="mon">الإثنين</option>
                  <option value="tue">الثلاثاء</option>
                  <option value="wed">الأربعاء</option>
                  <option value="thu">الخميس</option>
                  <option value="fri">الجمعة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الوقت (مثال: 06:00 PM – 07:30 PM)</label>
                <input required type="text" name="time" value={data.time} onChange={handleChange} placeholder="06:00 PM – 07:30 PM" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الحصة (عربي)</label>
                <input required type="text" name="titleAr" value={data.titleAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">اسم الحصة (إنجليزي)</label>
                <input required type="text" name="titleEn" value={data.titleEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">المستوى (عربي)</label>
                <input required type="text" name="levelAr" value={data.levelAr} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">المستوى (إنجليزي)</label>
                <input required type="text" name="levelEn" value={data.levelEn} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الفئة</label>
                <select required name="category" value={data.category} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white">
                  <option value="boxing">ملاكمة وتكنيك</option>
                  <option value="conditioning">إعداد بدني ولياقة</option>
                  <option value="ladies">سيدات فقط</option>
                  <option value="females">سيدات</option>
                  <option value="kids">أطفال وناشئين</option>
                  <option value="sparring">سبارينغ ونزالات</option>
                  <option value="pro">محترفين وبطولات</option>
                  <option value="personal">تدريب شخصي</option>
                  <option value="mixed">مختلط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">الكابتن</label>
                <select required name="coachId" value={data.coachId} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-white">
                  {coaches.map(coach => (
                    <option key={coach.id} value={coach.id}>{coach.nameAr}</option>
                  ))}
                </select>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-white font-bold hover:bg-white/10 rounded-xl transition-colors">
            إلغاء
          </button>
          <button form="schedule-form" type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ الحصة
          </button>
        </div>
      </div>
    </div>
  );
}
