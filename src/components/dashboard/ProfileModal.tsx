"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Key, User, Check, Shield } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");

    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUsername(data.user.username);
          setRole(data.user.role);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "كلمة المرور وتأكيدها غير متطابقين!" });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: password ? password : undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ type: "success", text: json.message || "تم حفظ البيانات بنجاح!" });
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: "error", text: json.error || "حدث خطأ أثناء التحديث." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "حدث خطأ في الاتصال بالخادم." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">الملف الشخصي وكلمة المرور</h2>
              <p className="text-xs text-zinc-400">تعديل بيانات حسابك الحالي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-8 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : (
            <form id="profileForm" onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {message.type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <X className="w-4 h-4 flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">اسم المستخدم</label>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">الصلاحية الحالية</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-white/5 text-xs text-zinc-300">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>{role === "SUPER_ADMIN" ? "مدير عام (Super Admin)" : "محرر (Editor)"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-3">
                <p className="text-[11px] font-bold text-zinc-400">تغيير كلمة المرور (اتركها فارغة إذا لم ترد التغيير):</p>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none text-left"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-zinc-900/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="profileForm"
            disabled={isSaving || isLoading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
