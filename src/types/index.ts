export interface BilingualText {
  en: string;
  ar: string;
}

export interface ClubInfo {
  nameEn: string;
  nameAr: string;
  shortName: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  locationEn: string;
  locationAr: string;
  addressEn: string;
  addressAr: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  tiktok: string;
  tiktokUrl: string;
  mapUrl: string;
  hours: {
    weekdaysEn: string;
    weekdaysAr: string;
    fridayEn: string;
    fridayAr: string;
    openTime: number; // hour (e.g. 6 for 06:00)
    closeTime: number; // hour (e.g. 23 for 23:00)
  };
  amenities: Array<{
    id: string;
    nameEn: string;
    nameAr: string;
    icon: string;
    descEn: string;
    descAr: string;
  }>;
}

export interface Coach {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  roleEn: string;
  roleAr: string;
  posterSubtitleAr: string;
  specialtiesEn: string[];
  specialtiesAr: string[];
  image: string;
  instagram: string;
  instagramUrl: string;
  badgeEn: string;
  badgeAr: string;
  whatsappMessage: string;
  whatsappMessageAr: string;
}

export interface ActionLink {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  icon: string;
  badge?: string;
  badgeColor?: "red" | "gold" | "silver";
  actionType: "modal" | "link" | "whatsapp" | "tel" | "map";
  modalId?: "schedule" | "pricing" | "trial" | "location" | "qr";
  href?: string;
  highlight?: boolean;
}

export interface ScheduleSession {
  time: string;
  titleEn: string;
  titleAr: string;
  coachId: string;
  coachNameEn: string;
  coachNameAr: string;
  category: "all" | "boxing" | "conditioning" | "sparring" | "ladies" | "kids";
  levelEn: string;
  levelAr: string;
}

export interface ScheduleDay {
  id: string;
  dayEn: string;
  dayAr: string;
  sessions: ScheduleSession[];
}

export interface PricingTier {
  id: string;
  titleEn: string;
  titleAr: string;
  price: string;
  currency: string;
  periodEn: string;
  periodAr: string;
  popular?: boolean;
  badge?: string;
  featuresEn: string[];
  featuresAr: string[];
  whatsappText: string;
}
