"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Bot, User, Send, Loader2, MessageCircle, MapPin } from "lucide-react";
import { clubInfo } from "@/data/clubData";
import { formatWhatsAppUrl } from "@/lib/utils";

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحباً! أنا المساعد الذكي لنادي جاب لاب 🥊. كيف بقدر أساعدك اليوم؟\n\n[SUGGESTION: كم أسعار الاشتراكات؟]\n[SUGGESTION: من هم كباتن النادي؟]\n[SUGGESTION: أين يقع النادي؟]",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow || "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("API Error");
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream available");
      
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
          return updated;
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]);
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  // Helper to render message content and inject WhatsApp/Map/Suggestion buttons
  const renderContent = (content: string, isLatest: boolean) => {
    let text = content;
    const waUrl = formatWhatsAppUrl(clubInfo.phoneRaw, "مرحباً، أحتاج إلى التحدث مع الإدارة لو سمحت.");
    
    const hasWhatsApp = text.includes("[WHATSAPP_BUTTON]");
    if (hasWhatsApp) {
      text = text.replace("[WHATSAPP_BUTTON]", "");
    }

    const hasMap = text.includes("[MAP_BUTTON]");
    if (hasMap) {
      text = text.replace("[MAP_BUTTON]", "");
    }

    // Extract suggestions
    const suggestions: string[] = [];
    const suggestionRegex = /\[SUGGESTION:\s*(.+?)\]/g;
    let match;
    while ((match = suggestionRegex.exec(text)) !== null) {
      suggestions.push(match[1].trim());
    }
    // Remove suggestions from text
    text = text.replace(/\[SUGGESTION:\s*(.+?)\]/g, "").trim();

    return (
      <div className="space-y-3">
        {text && <p className="whitespace-pre-wrap">{text}</p>}
        
        <div className="flex flex-col gap-2">
          {hasWhatsApp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl font-bold transition-all text-sm w-fit mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الإدارة عبر الواتساب</span>
            </a>
          )}
          
          {hasMap && (
            <a
              href={clubInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl font-bold transition-all text-sm w-fit mt-1"
            >
              <MapPin className="w-4 h-4" />
              <span>افتح الموقع على خرائط جوجل</span>
            </a>
          )}
        </div>

        {isLatest && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-red-900/30">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="bg-red-950/50 hover:bg-red-900/50 border border-red-900/50 text-red-100 text-xs py-1.5 px-3 rounded-lg transition-colors text-right"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end sm:justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-0 sm:p-4" dir="rtl">
      <div className="w-full h-[85vh] sm:h-[600px] sm:max-w-md bg-zinc-950 border border-zinc-800 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col animate-slideUp sm:animate-scaleUp relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 relative">
              <Bot className="w-5 h-5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm">مساعد جاب لاب الذكي</h3>
              <p className="text-[10px] text-zinc-400 font-medium">مدعوم بـ DeepSeek AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center ms-2 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-sm ${
                  msg.role === "user"
                    ? "bg-zinc-800 text-white rounded-tr-none"
                    : "bg-red-950/30 border border-red-900/50 text-zinc-200 rounded-tl-none leading-relaxed"
                }`}
              >
                {renderContent(msg.content, idx === messages.length - 1)}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center me-2 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-end">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center ms-2 mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[80%] rounded-2xl p-3.5 bg-red-950/30 border border-red-900/50 text-zinc-400 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span className="text-xs">جاري التفكير...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/5 bg-zinc-950">
          <form onSubmit={handleSend} className="flex items-end gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسألني عن الأسعار أو الكباتن..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 flex-shrink-0 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-2xl flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
