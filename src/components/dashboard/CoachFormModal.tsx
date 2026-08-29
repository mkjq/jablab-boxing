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
    imagePosition: (coach as any)?.imagePosition || "center top",
    imageScale: (coach as any)?.imageScale ?? 1.0,
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
                <label className="block text-xs font-bold text-zinc-400 mb-1">صورة الكابتن</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-500/10 file:text-red-500 hover:file:bg-red-500/20" 
                />
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

              {/* Image Position & Scale Controls */}
              <div className="md:col-span-2 bg-zinc-900 border border-white/10 rounded-2xl p-4">
                <label className="block text-xs font-bold text-zinc-300 mb-3">🖼️ ضبط الصورة</label>
                <div className="flex gap-6 items-start flex-wrap">
                  
                  {/* Preview */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10">
                    {formData.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.image}
                        alt="preview"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: formData.imagePosition,
                          transform: `scale(${formData.imageScale})`,
                          transformOrigin: formData.imagePosition,
                        }}
                      />
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">معاينة</div>
                  </div>

                  <div className="flex-1 space-y-3 min-w-[160px]">
                    {/* 3x3 Position Grid */}
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-1.5">موضع الصورة</p>
                      <div className="grid grid-cols-3 gap-1 w-fit">
                        {[
                          ["right top", "↖"], ["center top", "↑"], ["left top", "↗"],
                          ["right center", "←"], ["center center", "•"], ["left center", "→"],
                          ["right bottom", "↙"], ["center bottom", "↓"], ["left bottom", "↘"],
                        ].map(([pos, icon]) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imagePosition: pos }))}
                            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                              formData.imagePosition === pos
                                ? "bg-red-600 text-white"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scale Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-zinc-500">التكبير</p>
                        <span className="text-[10px] text-red-400 font-bold">{Number(formData.imageScale).toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={formData.imageScale}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageScale: parseFloat(e.target.value) }))}
                        className="w-full accent-red-500"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                        <span>1x طبيعي</span>
                        <span>2x تكبير</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
