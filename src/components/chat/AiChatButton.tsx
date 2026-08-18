"use client";

import React, { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { AiChatModal } from "./AiChatModal";

export const AiChatButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-zinc-950 border-2 border-red-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-600/20 hover:scale-110 transition-transform group"
        aria-label="Open AI Assistant"
      >
        <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping opacity-75" />
        <Bot className="w-6 h-6 relative z-10 group-hover:text-red-400 transition-colors" />
        <Sparkles className="w-3 h-3 text-yellow-400 absolute top-3 right-3 z-10 animate-pulse" />
      </button>

      <AiChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
