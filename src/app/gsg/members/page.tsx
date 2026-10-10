"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  QrCode, 
  Search, 
  Trash2, 
  Edit2, 
  Clock, 
  Trophy, 
  CalendarCheck, 
  Loader2, 
  Phone, 
  CheckCircle2, 
  Printer, 
  Flame,
  Plus
} from "lucide-react";
import { MemberFormModal } from "@/components/dashboard/MemberFormModal";
import { MemberHistoryModal } from "@/components/dashboard/MemberHistoryModal";

export default function MembersDashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalMembers: 0, totalCheckIns: 0, todayCheckIns: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [historyMemberId, setHistoryMemberId] = useState<string | null>(null);
  const [manualLoadingId, setManualLoadingId] = useState<string | null>(null);

  const loadMembers = async (searchQuery = "") => {
    setLoading(true);
    try {
      const url = searchQuery 
        ? `/api/gsg/members?search=${encodeURIComponent(searchQuery)}`
        : "/api/gsg/members";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setMembers(data.members || []);
        if (data.stats) setStats(data.stats);
        setError(null);
      } else {
        setError(data.error || "خطأ في تحميل المتدربين");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers(search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMembers(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف اللاعب "${name}" وسجل حصصه؟`)) return;
    try {
      const res = await fetch(`/api/gsg/members/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadMembers(search);
      } else {
        alert(data.error || "حدث خطأ أثناء الحذف");
      }
    } catch {
      alert("حدث خطأ في الاتصال");
    }
  };

  const handleManualCheckIn = async (member: any) => {
    if (!confirm(`تسجيل حضور يدوي الآن للاعب "${member.name}"؟`)) return;
    setManualLoadingId(member.id);
    try {
      const res = await fetch(`/api/gsg/members/${member.id}/manual-checkin`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert(`تم تسجيل الحصة بنجاح للاعب ${member.name}! أصبح رصيده: ${data.member.totalCheckIns} حصة 🥊`);
        loadMembers(search);
      } else {
        alert(data.error || "تعذر تسجيل الحضور اليدوي");
      }
    } catch {
      alert("حدث خطأ في الاتصال");
    } finally {
      setManualLoadingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" />
            إدارة المشتركين وتسجيل الحضور
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            متابعة حضور اللاعبين، حساب الحصص، وإضافة مشتركين جدد بواسطة الكابتن
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/gsg/qr-poster"
            className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-red-500" />
            <span>طباعة بوستر الباركود</span>
          </Link>

          <button
            onClick={() => {
              setEditingMember(null);
              setIsFormOpen(true);
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة لاعب جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">إجمالي المتدربين</span>
            <p className="text-2xl font-black text-white font-mono mt-0.5">
              {stats.totalMembers} <span className="text-xs text-zinc-500 font-normal">مشترك</span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">إجمالي الحصص المحتسبة</span>
            <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {stats.totalCheckIns} <span className="text-xs text-zinc-500 font-normal">حصة</span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">حضور اليوم</span>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {stats.todayCheckIns} <span className="text-xs text-zinc-500 font-normal">دخول</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="البحث بالاسم أو برقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="text-xs text-zinc-400">
          عدد النتائج: <span className="text-white font-bold">{members.length}</span> لاعب
        </div>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-2xl">
            🥊
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">لا يوجد لاعبين مسجلين حالياً</h3>
            <p className="text-xs text-zinc-400 mt-1">
              يمكنك إضافة لاعب جديد يدوياً الآن أو دعوة المشتركين لمسح باركود النادي المعلق على الحائط
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setIsFormOpen(true);
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            إضافة أول لاعب
          </button>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-zinc-900/60 text-zinc-400 text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">اسم المتدرب</th>
                  <th className="px-6 py-4 font-bold">رقم الهاتف</th>
                  <th className="px-6 py-4 font-bold">البريد الإلكتروني</th>
                  <th className="px-6 py-4 font-bold text-center">إجمالي الحصص</th>
                  <th className="px-6 py-4 font-bold">آخر حضور</th>
                  <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 flex items-center justify-center text-xs font-black text-white shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <span>{member.name}</span>
                          <span className="block text-[10px] text-zinc-500 font-normal">
                            انضم في: {new Date(member.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-zinc-300 font-mono text-xs" dir="ltr">
                      {member.phone}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {member.email ? (
                        <span dir="ltr">{member.email}</span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>

                    {/* Sessions Count */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                        <Trophy className="w-3 h-3" />
                        {member.totalCheckIns} حصة
                      </span>
                    </td>

                    {/* Last Check-in */}
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {member.lastCheckIn ? (
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {new Date(member.lastCheckIn).toLocaleDateString("ar-JO", { month: "short", day: "numeric" })}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono" dir="ltr">
                            {new Date(member.lastCheckIn).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-zinc-600">لا يوجد حضور</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Quick Manual Check-in Button */}
                        <button
                          onClick={() => handleManualCheckIn(member)}
                          disabled={manualLoadingId === member.id}
                          className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-red-500/30"
                          title="تسجيل حصة يدوية الآن"
                        >
                          {manualLoadingId === member.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <span>حضور</span>
                        </button>

                        {/* History */}
                        <button
                          onClick={() => setHistoryMemberId(member.id)}
                          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="عرض سجل الحصص"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="تعديل البيانات"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 bg-zinc-900 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="حذف اللاعب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <MemberFormModal
          member={editingMember}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            setIsFormOpen(false);
            loadMembers(search);
          }}
        />
      )}

      {/* History Modal */}
      {historyMemberId && (
        <MemberHistoryModal
          memberId={historyMemberId}
          onClose={() => setHistoryMemberId(null)}
        />
      )}
    </div>
  );
}
