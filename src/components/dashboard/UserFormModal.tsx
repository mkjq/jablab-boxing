"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createUser, updateUser } from "@/app/actions/users";

interface Props {
  user: any | null;
  onClose: () => void;
  onSaved: () => void;
}

export const UserFormModal: React.FC<Props> = ({ user, onClose, onSaved }) => {
  const isEditing = !!user;
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    role: user?.role || "EDITOR",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    
    let res;
    if (isEditing) {
      res = await updateUser(user.id, formData);
    } else {
      res = await createUser(formData);
    }
    
    if (res.success) {
      onSaved();
    } else {
      setError(res.error || "حدث خطأ");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white">{isEditing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h2>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-bold">{error}</div>}
          <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">اسم المستخدم</label>
              <input required name="username" value={formData.username} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">كلمة السر {isEditing && "(اتركها فارغة إذا لم ترد تغييرها)"}</label>
              <input required={!isEditing} type="password" name="password" value={formData.password} onChange={handleChange} dir="ltr" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">الصلاحية</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none">
                <option value="EDITOR">محرر (Editor)</option>
                <option value="SUPER_ADMIN">مدير عام (Super Admin)</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-zinc-900/30 rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">إلغاء</button>
          <button 
            type="submit" 
            form="userForm"
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
