"use client";

import React, { useEffect, useState } from "react";
import { X, Clock, Calendar, Trophy, QrCode, UserCheck, Loader2 } from "lucide-react";

interface MemberHistoryModalProps {
  memberId: string;
  onClose: () => void;
}

export function MemberHistoryModal({ memberId, onClose }: MemberHistoryModalProps) {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/gsg/members/${memberId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.member) {
          setMember(data.member);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [memberId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-xl">
              🥊
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                سجل حضور اللاعب: {member?.name || "..."}
              </h3>
              <p className="text-xs text-zinc-400" dir="ltr">{member?.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stat card */}
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400">إجمالي الحصص المسجلة</span>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                    {member?.totalCheckIns} حصة
                  </p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">تاريخ الانضمام</span>
                  <p className="text-sm font-bold text-white mt-0.5" dir="ltr">
                    {member?.createdAt ? new Date(member.createdAt).toLocaleDateString("en-GB") : "-"}
                  </p>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 mb-2">سجل الحركات المسجلة:</h4>
                {member?.checkIns?.length === 0 ? (
                  <p className="text-center py-6 text-zinc-500 text-sm">
                    لا يوجد حركات مسجلة عبر النظام بعد لهذا اللاعب
                  </p>
                ) : (
                  member?.checkIns?.map((item: any, idx: number) => {
                    const date = new Date(item.createdAt);
                    const isManual = item.source === "MANUAL_CAPTAIN";

                    return (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between p-3.5 bg-zinc-900/50 border border-white/5 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                            isManual ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                          }`}>
                            {isManual ? <UserCheck className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">
                              {isManual ? "تسجيل يدوي بواسطة الكابتن" : "مسح باركود الحائط (QR)"}
                            </p>
                            <p className="text-zinc-500 text-[11px]">
                              {isManual ? "إضافة مباشرة من لوحة التحكم" : "مسح كاميرا المتدرب"}
                            </p>
                          </div>
                        </div>

                        <div className="text-left space-y-0.5">
                          <p className="font-medium text-zinc-300">
                            {date.toLocaleDateString("ar-JO", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-zinc-500 font-mono text-[10px]" dir="ltr">
                            {date.toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end bg-zinc-950">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
