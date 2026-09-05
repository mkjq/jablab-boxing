"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Calendar } from "lucide-react";
import { ClassSession, Coach } from "@prisma/client";
import { ScheduleFormModal } from "@/components/dashboard/ScheduleFormModal";
import { deleteSchedule } from "@/app/actions/schedule";

type SessionWithCoach = ClassSession & { coach: Coach };

const DAYS_AR = {
  sat: "السبت",
  sun: "الأحد",
  mon: "الإثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<SessionWithCoach[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [scheduleRes, coachesRes] = await Promise.all([
        fetch("/api/schedule"),
        fetch("/api/coaches")
      ]);
      
      const scheduleData = await scheduleRes.json();
      const coachesData = await coachesRes.json();
      
      if (scheduleRes.ok && scheduleData.success) {
        setSchedule(scheduleData.schedule);
      }
      if (coachesRes.ok && coachesData.success) {
        setCoaches(coachesData.coaches);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحصة؟")) {
      await deleteSchedule(id);
      fetchData();
    }
  };

  const handleEdit = (session: SessionWithCoach) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchData();
  };

  // Group by day
  const groupedSchedule = schedule.reduce((acc, session) => {
    if (!acc[session.day]) acc[session.day] = [];
    acc[session.day].push(session);
    return acc;
  }, {} as Record<string, SessionWithCoach[]>);

  const daysOrder = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة جدول الحصص</h1>
          <p className="text-sm text-zinc-400 mt-1">قم بإدارة أوقات وتفاصيل الحصص التدريبية.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة حصة
        </button>
      </header>

      {isLoading ? (
        <div className="bg-zinc-950 rounded-3xl border border-white/10 p-12 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : schedule.length === 0 ? (
        <div className="bg-zinc-950 rounded-3xl border border-white/10 p-12 text-center text-zinc-500">
          لا يوجد حصص مضافة حالياً.
        </div>
      ) : (
        <div className="space-y-6">
          {daysOrder.map(day => {
            const daySessions = groupedSchedule[day];
            if (!daySessions || daySessions.length === 0) return null;
            
            return (
              <div key={day} className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
                <div className="bg-zinc-900/50 p-4 border-b border-white/5">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    {DAYS_AR[day as keyof typeof DAYS_AR]}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm text-zinc-300">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/20 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-bold">الوقت</th>
                        <th className="px-6 py-4 font-bold">الحصة</th>
                        <th className="px-6 py-4 font-bold">المستوى</th>
                        <th className="px-6 py-4 font-bold">الكابتن</th>
                        <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {daySessions.map((session) => (
                        <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-base font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg border border-white/10">{session.time}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{session.titleAr}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              session.category === 'females' ? 'bg-pink-500/20 text-pink-400' :
                              session.category === 'kids' ? 'bg-blue-500/20 text-blue-400' :
                              session.category === 'personal' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-zinc-500/20 text-zinc-400'
                            }`}>
                              {session.category === 'females' ? 'سيدات فقط' :
                               session.category === 'kids' ? 'أطفال' :
                               session.category === 'personal' ? 'تدريب شخصي' : 'مختلط'}
                            </span>
                          </td>
                          <td className="px-6 py-4">{session.levelAr}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {session.coach?.image ? (
                                <img src={session.coach.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                              )}
                              <span className="font-bold text-white">{session.coach?.nameAr || "غير محدد"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-left">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(session)}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(session.id)}
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
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <ScheduleFormModal 
          session={editingSession} 
          coaches={coaches}
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
