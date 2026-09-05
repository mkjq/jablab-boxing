"use client";

import React, { useEffect, useState } from "react";
import { actionLinks as defaultActionLinks } from "@/data/clubData";
import { LinkCard } from "./LinkCard";

interface LinksSectionProps {
  onOpenModal: (modalId: string) => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ onOpenModal }) => {
  const [links, setLinks] = useState<any[]>(defaultActionLinks);

  useEffect(() => {
    fetch("/api/action-links")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.actionLinks && data.actionLinks.length > 0) {
          setLinks(data.actionLinks);
        }
      })
      .catch((err) => console.error("Action links fetch error:", err));
  }, []);

  return (
    <section aria-label="Quick Actions & Services" className="w-full my-3 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onOpenModal={onOpenModal} />
      ))}
    </section>
  );
};
