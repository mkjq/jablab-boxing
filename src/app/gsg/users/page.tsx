"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, ShieldAlert, Trash2, Edit2, Loader2, Key } from "lucide-react";
import { getUsers, deleteUser } from "@/app/actions/users";
import { UserFormModal } from "@/components/dashboard/UserFormModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        setError(null);
      } else {
        setError(data.error || "خطأ في تحميل المستخدمين");
      }
    } catch (err) {
      setError("تعذر تحميل البيانات");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    const res = await deleteUser(id);
    if (res.success) {
      loadUsers();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-red-500" />
            إدارة المستخدمين والصلاحيات
          </h1>
          <p className="text-zinc-400 text-sm mt-1">التحكم في المدراء والمحررين للنظام</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">مستخدم جديد</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-center justify-center gap-3 text-red-500">
          <ShieldAlert className="w-6 h-6" />
          <p className="font-bold">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-bold">اسم المستخدم</th>
                  <th className="px-6 py-4 font-bold">الصلاحية</th>
                  <th className="px-6 py-4 font-bold">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-white" dir="ltr">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${user.role === 'SUPER_ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-300'}`}>
                        {user.role === 'SUPER_ADMIN' ? 'مدير عام' : 'محرر'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500" dir="ltr">
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-900 rounded-lg transition-colors"
                          title="حذف"
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

      {isModalOpen && (
        <UserFormModal 
          user={editingUser} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={() => {
            setIsModalOpen(false);
            loadUsers();
          }} 
        />
      )}
    </div>
  );
}
