"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Link as LinkIcon, ExternalLink, MapPin, Phone, MessageCircle } from "lucide-react";
import { ActionLink } from "@prisma/client";
import { ActionLinkFormModal } from "@/components/dashboard/ActionLinkFormModal";
import { deleteActionLink } from "@/app/actions/action-links";

export default function ActionLinksPage() {
  const [links, setLinks] = useState<ActionLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ActionLink | null>(null);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/action-links");
      const data = await res.json();
      if (res.ok && data.success && data.actionLinks) {
        setLinks(data.actionLinks);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
      await deleteActionLink(id);
      fetchLinks();
    }
  };

  const handleEdit = (link: ActionLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchLinks();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'tel': return <Phone className="w-5 h-5 text-blue-500" />;
      case 'map': return <MapPin className="w-5 h-5 text-yellow-500" />;
      case 'modal': return <ExternalLink className="w-5 h-5 text-purple-500" />;
      default: return <LinkIcon className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center bg-zinc-950 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة الأزرار السريعة</h1>
          <p className="text-sm text-zinc-400 mt-1">أضف، عدّل، أو احذف الأزرار التفاعلية التي تظهر أسفل الهيدر.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة زر جديد
        </button>
      </header>

      <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">لا يوجد أزرار مضافة حالياً.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">الرابط</th>
                  <th className="px-6 py-4 font-bold">النوع</th>
                  <th className="px-6 py-4 font-bold">الترتيب</th>
                  <th className="px-6 py-4 font-bold">التميز</th>
                  <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                          {getIcon(link.actionType)}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {link.titleAr}
                            {link.badge && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                link.badgeColor === 'red' ? 'bg-red-500/20 text-red-400' :
                                link.badgeColor === 'green' ? 'bg-green-500/20 text-green-400' :
                                link.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                link.badgeColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-zinc-500/20 text-zinc-400'
                              }`}>{link.badge}</span>
                            )}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">{link.subtitleAr || "بدون وصف"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-lg text-xs font-mono">
                        {link.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{link.order}</td>
                    <td className="px-6 py-4">
                      {link.highlight ? (
                        <span className="text-red-500 font-bold">نعم (بارز)</span>
                      ) : (
                        <span className="text-zinc-500">عادي</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(link)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(link.id)}
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
        <ActionLinkFormModal 
          link={editingLink} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
