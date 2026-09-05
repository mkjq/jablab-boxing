"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Dumbbell, Coffee, Wifi, CheckCircle2 } from "lucide-react";
import { Amenity } from "@prisma/client";
import { AmenityFormModal } from "@/components/dashboard/AmenityFormModal";

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

  const fetchAmenities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/amenities", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success && data.amenities) {
        setAmenities(data.amenities);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المرفق؟")) {
      setAmenities((prev) => prev.filter((a) => a.id !== id));
      try {
        const res = await fetch(`/api/amenities/${id}`, { method: "DELETE" });
        if (!res.ok) {
          alert("حدث خطأ أثناء الحذف من الخادم.");
          fetchAmenities();
        }
      } catch (err) {
        console.error(err);
        alert("حدث خطأ في الاتصال.");
        fetchAmenities();
      }
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAmenity(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchAmenities();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة المرافق</h1>
          <p className="text-sm text-zinc-400 mt-1">أضف أو عدّل مرافق وخدمات النادي.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة مرفق جديد
        </button>
      </header>

      <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : amenities.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">لا يوجد مرافق مضافة حالياً.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">المرفق</th>
                  <th className="px-6 py-4 font-bold">الوصف</th>
                  <th className="px-6 py-4 font-bold">الترتيب</th>
                  <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {amenities.map((amenity) => (
                  <tr key={amenity.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-500">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-white">{amenity.nameAr}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-400 text-xs max-w-xs">{amenity.descAr}</p>
                    </td>
                    <td className="px-6 py-4">{amenity.order}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(amenity)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(amenity.id)}
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
        <AmenityFormModal 
          amenity={editingAmenity} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
