"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, Key, Calendar, DollarSign, Dumbbell, Link as LinkIcon, User } from "lucide-react";
import { ProfileModal } from "@/components/dashboard/ProfileModal";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/gsg/login") {
      fetch("/api/auth/me")
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) setRole(data.role);
        })
        .catch(console.error);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/gsg/login");
    router.refresh();
  };

  if (pathname === "/gsg/login") {
    return <>{children}</>;
  }

  const links = [
    { href: "/gsg", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/gsg/settings", label: "الإعدادات العامة", icon: Settings },
    { href: "/gsg/coaches", label: "الكباتن", icon: Users },
    { href: "/gsg/schedule", label: "جدول الحصص", icon: Calendar },
    { href: "/gsg/pricing", label: "الاشتراكات", icon: DollarSign },
    { href: "/gsg/amenities", label: "المرافق", icon: Dumbbell },
    { href: "/gsg/action-links", label: "الأزرار السريعة", icon: LinkIcon },
  ];

  if (role === "SUPER_ADMIN") {
    links.push({ href: "/gsg/users", label: "إدارة المستخدمين", icon: Key });
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-l border-white/10 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">🥊</div>
            Jab Lab Admin
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${
                  isActive 
                    ? "bg-red-600/10 text-red-500 border border-red-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-1 border-t border-white/5">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors font-bold text-sm"
          >
            <User className="w-5 h-5 text-red-500" />
            الملف الشخصي وكلمة المرور
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Profile & Password Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
