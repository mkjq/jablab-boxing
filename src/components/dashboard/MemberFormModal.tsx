"use client";

import React, { useState } from "react";
import { X, User, Phone, Mail, Trophy, Loader2 } from "lucide-react";

interface MemberFormModalProps {
  member?: any | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MemberFormModal({ member, onClose, onSaved }: MemberFormModalProps) {
  const isEditing = !!member;
  const [name, setName] = useState(member?.name || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [email, setEmail] = useState(member?.email || "");
  const [totalCheckIns, setTotalCheckIns] = useState(member?.totalCheckIns ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("اسم اللاعب مطلوب");
      return;
    }
    if (!phone.trim()) {
      setError("رقم الهاتف مطلوب");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing ? `/api/gsg/members/${member.id}` : "/api/gsg/members";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          totalCheckIns: parseInt(String(totalCheckIns), 10) || 0,
          initialCheckIns: parseInt(String(totalCheckIns), 10) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "حدث خطأ أثناء حفظ بيانات اللاعب");
        setLoading(false);
        return;
      }

      onSaved();
    } catch (err) {
      console.error("Save member error:", err);
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              🥊
            </div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? "تعديل بيانات اللاعب" : "إضافة لاعب جديد بواسطة الكابتن"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">
              اسم اللاعب <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="مثال: يوسف أحمد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="079XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 text-right"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">
              البريد الإلكتروني <span className="text-zinc-500 text-[10px]">(اختياري)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                dir="ltr"
                placeholder="player@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 text-right"
              />
            </div>
          </div>

          {/* Initial / Total Sessions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>{isEditing ? "إجمالي الحصص المسجلة" : "رصيد الحصص المبدئي"}</span>
              <span className="text-[10px] text-zinc-500">في حال وجود حصص سابقة</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <input
                type="number"
                min="0"
                value={totalCheckIns}
                onChange={(e) => setTotalCheckIns(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 text-sm font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "حفظ التعديلات" : "إضافة اللاعب"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
