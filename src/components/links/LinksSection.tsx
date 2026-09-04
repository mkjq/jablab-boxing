"use client";

import React from "react";
import { actionLinks } from "@/data/clubData";
import { LinkCard } from "./LinkCard";

interface LinksSectionProps {
  onOpenModal: (modalId: string) => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ onOpenModal }) => {
  return (
    <section aria-label="Quick Actions & Services" className="w-full my-3 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {actionLinks.map((link) => (
        <LinkCard key={link.id} link={link} onOpenModal={onOpenModal} />
      ))}
    </section>
  );
};
