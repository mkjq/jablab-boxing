"use client";

import React, { useState } from "react";
import { Coach } from "@prisma/client";
import { X, Loader2 } from "lucide-react";
import { createCoach, updateCoach } from "@/app/actions/coaches";

interface Props {
  coach: Coach | null;
  onClose: () => void;
  onSaved: () => void;
}

export const CoachFormModal: React.FC<Props> = ({ coach, onClose, onSaved }) => {
  const isEditing = !!coach;
  const [isSaving, setIsSaving] = useState(false);
  
  // Basic state for the form
  const [formData, setFormData] = useState({
    nameEn: coach?.nameEn || "",
    nameAr: coach?.nameAr || "",
    titleEn: coach?.titleEn || "",
    titleAr: coach?.titleAr || "",
    roleEn: coach?.roleEn || "",
    roleAr: coach?.roleAr || "",
    posterSubtitleAr: coach?.posterSubtitleAr || "",
    specialtiesEn: coach ? JSON.parse(coach.specialtiesEn).join(", ") : "",
    specialtiesAr: coach ? JSON.parse(coach.specialtiesAr).join(", ") : "",
    image: coach?.image || "/images/coaches/default.png",
    instagram: coach?.instagram || "",
    instagramUrl: coach?.instagramUrl || "",
    badgeEn: coach?.badgeEn || "",
    badgeAr: coach?.badgeAr || "",
    whatsappMessage: coach?.whatsappMessage || "",
    whatsappMessageAr: coach?.whatsappMessageAr || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Parse comma-separated specialties back to JSON string
    const dataToSave = {
      ...formData,
      specialtiesEn: JSON.stringify(formData.specialtiesEn.split(",").map((s: string) => s.trim()).filter(Boolean)),
      specialtiesAr: JSON.stringify(formData.specialtiesAr.split(",").map((s: string) => s.trim()).filter(Boolean)),
    };

    if (isEditing) {
      await updateCoach(coach.id, dataToSave);
    } else {
      await createCoach(dataToSave);
    }
    
    setIsSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white">{isEditing ? "تعديل بيانات الكابتن" : "إضافة كابتن جديد"}</h2>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <form id="coachForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">الاسم (عربي)</label>
                <input required name="nameAr" value={formData.nameAr} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">الاسم (انجليزي)</label>
                <input required name="nameEn" value={formData.nameEn} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">اللقب (عربي)</label>
                <input required name="titleAr" value={formData.titleAr} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">اللقب (انجليزي)</label>
                <input required name="titleEn" value={formData.titleEn} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">رابط الصورة (مسار)</label>
                <input required name="image" value={formData.image} onChange={handleChange} dir="ltr" placeholder="/images/coaches/..." className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">يوزر الانستقرام (بدون @)</label>
                <input required name="instagram" value={formData.instagram} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 mb-1">رابط الانستقرام الكامل</label>
                <input required name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">الدور (عربي)</label>
                <input required name="roleAr" value={formData.roleAr} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">التخصصات (عربي - مفصولة بفاصلة)</label>
                <input required name="specialtiesAr" value={formData.specialtiesAr} onChange={handleChange} placeholder="ملاكمة، لياقة، ..." className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none" />
              </div>

              {/* Just a few required english fallbacks for UI consistency */}
              <input type="hidden" name="roleEn" value={formData.roleAr} />
              <input type="hidden" name="specialtiesEn" value={formData.specialtiesAr} />
              <input type="hidden" name="posterSubtitleAr" value={formData.roleAr} />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-zinc-900/30 rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">إلغاء</button>
          <button 
            type="submit" 
            form="coachForm"
            disabled={isSaving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
