"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, DollarSign } from "lucide-react";
import { PricingTier } from "@prisma/client";
import { PricingFormModal } from "@/components/dashboard/PricingFormModal";
import { deletePricing } from "@/app/actions/pricing";

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<PricingTier | null>(null);

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (res.ok && data.success && data.pricing) {
        setPricing(data.pricing);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الاشتراك؟")) {
      await deletePricing(id);
      fetchPricing();
    }
  };

  const handleEdit = (tier: PricingTier) => {
    setEditingPricing(tier);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPricing(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchPricing();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة الاشتراكات</h1>
          <p className="text-sm text-zinc-400 mt-1">أضف، عدّل، أو احذف باقات الاشتراك وأسعارها.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة اشتراك جديد
        </button>
      </header>

      <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : pricing.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">لا يوجد اشتراكات مضافة حالياً.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">الاشتراك</th>
                  <th className="px-6 py-4 font-bold">السعر</th>
                  <th className="px-6 py-4 font-bold">التمييز</th>
                  <th className="px-6 py-4 font-bold">الترتيب</th>
                  <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pricing.map((tier) => (
                  <tr key={tier.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tier.popular ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-white/10 text-zinc-400'}`}>
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{tier.titleAr}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{JSON.parse(tier.featuresAr || "[]").length} ميزات</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white font-mono text-base">{tier.price} {tier.currency}</p>
                      <p className="text-xs text-zinc-500">{tier.periodAr}</p>
                    </td>
                    <td className="px-6 py-4">
                      {tier.popular ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">{tier.badge || "الأكثر شيوعاً"}</span>
                      ) : (
                        <span className="text-zinc-500 text-xs">عادي</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{tier.order}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(tier)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tier.id)}
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
        <PricingFormModal 
          pricing={editingPricing} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
