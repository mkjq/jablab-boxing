"use client";

import React, { useState } from "react";
import { ClubHeader } from "@/components/header/ClubHeader";
import { NfcUtilityBar } from "@/components/nfc/NfcUtilityBar";
import { LinksSection } from "@/components/links/LinksSection";
import { CoachesSection } from "@/components/coaches/CoachesSection";
import { LocationHours } from "@/components/location/LocationHours";
import { AmenitiesGrid } from "@/components/location/AmenitiesGrid";
import { ScheduleModal } from "@/components/modals/ScheduleModal";
import { ShareQrModal } from "@/components/modals/ShareQrModal";
import { TrialModal } from "@/components/modals/TrialModal";
import { ClubFooter } from "@/components/footer/ClubFooter";

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="relative min-h-screen bg-jab-void flex flex-col items-center justify-start overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-40 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Responsive Mobile-First Container */}
      <main className="relative z-10 w-full max-w-md mx-auto min-h-screen px-3 py-4 sm:py-6 flex flex-col items-center">
        {/* 1. Header & Quick Actions */}
        <ClubHeader onOpenShareModal={() => handleOpenModal("qr")} />

        {/* 2. NFC Smart Utility (Save Contact & Share) */}
        <NfcUtilityBar onOpenShareModal={() => handleOpenModal("qr")} />

        {/* 3. Primary Linktree Action Buttons */}
        <LinksSection onOpenModal={handleOpenModal} />

        {/* 4. Elite Coaches Showcase (2x2 Grid) */}
        <CoachesSection />

        {/* 5. Location, Live Hours & Gym Amenities */}
        <LocationHours />
        <AmenitiesGrid />

        {/* 6. Footer & Brand Watermark */}
        <ClubFooter />
      </main>

      {/* Interactive Modals */}
      <ScheduleModal
        isOpen={activeModal === "schedule"}
        onClose={handleCloseModal}
      />
      <ShareQrModal
        isOpen={activeModal === "qr"}
        onClose={handleCloseModal}
      />
      <TrialModal
        isOpen={activeModal === "trial"}
        onClose={handleCloseModal}
      />
    </div>
  );
}
