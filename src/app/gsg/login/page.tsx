"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/gsg");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-right" dir="rtl">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white">لوحة تحكم Jab Lab</h1>
          <p className="text-xs text-zinc-400 mt-1">أدخل بيانات الإدمن للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none text-left"
              dir="ltr"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none text-left"
              dir="ltr"
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
