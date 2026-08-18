"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { getCoaches, deleteCoach } from "@/app/actions/coaches";
import { Coach } from "@prisma/client";
import { CoachFormModal } from "@/components/dashboard/CoachFormModal";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  const fetchCoaches = async () => {
    setIsLoading(true);
    const res = await getCoaches();
    if (res.success && res.coaches) {
      setCoaches(res.coaches);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الكابتن؟")) {
      await deleteCoach(id);
      fetchCoaches();
    }
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCoach(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchCoaches();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة الكباتن</h1>
          <p className="text-sm text-zinc-400 mt-1">أضف، عدل، أو احذف الكباتن في الموقع.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة كابتن
        </button>
      </header>

      <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : coaches.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">لا يوجد كباتن حالياً.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">الصورة</th>
                  <th className="px-6 py-4 font-bold">الاسم</th>
                  <th className="px-6 py-4 font-bold">الدور</th>
                  <th className="px-6 py-4 font-bold">التخصص</th>
                  <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {coach.image ? (
                        <img src={coach.image} alt={coach.nameAr} className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-zinc-900" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{coach.nameAr}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{coach.titleAr}</p>
                    </td>
                    <td className="px-6 py-4">{coach.roleAr}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(coach.specialtiesAr).slice(0, 2).map((sp: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-red-600/10 text-red-400 rounded-md text-[10px] font-bold">{sp}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(coach)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(coach.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
        )}
      </div>

      {isModalOpen && (
        <CoachFormModal 
          coach={editingCoach} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
