"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, Key } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

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
    { href: "/gsg/coaches", label: "الكباتن", icon: Users },
    { href: "/gsg/settings", label: "الإعدادات", icon: Settings },
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

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors font-bold text-sm"
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
    </div>
  );
}
