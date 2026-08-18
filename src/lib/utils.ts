import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function formatTelUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  return `tel:${cleanPhone}`;
}

export function isClubOpen(
  openHour: number = 6,
  closeHour: number = 23,
  fridayOpen: number = 10,
  fridayClose: number = 20
): { isOpen: boolean; textEn: string; textAr: string } {
  // Jordan Time UTC+3
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jordanTime = new Date(utc + 3600000 * 3);
  const day = jordanTime.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  const hour = jordanTime.getHours();

  let open = openHour;
  let close = closeHour;

  if (day === 5) {
    // Friday
    open = fridayOpen;
    close = fridayClose;
  }

  const isOpen = hour >= open && hour < close;

  if (isOpen) {
    const closesAt = close > 12 ? `${close - 12}:00 PM` : `${close}:00 AM`;
    const closesAtAr = close > 12 ? `${close - 12}:00 م` : `${close}:00 ص`;
    return {
      isOpen: true,
      textEn: `Open Now • Closes at ${closesAt}`,
      textAr: `مفتوح الآن • يغلق عند الساعة ${closesAtAr}`,
    };
  } else {
    const opensAt = open > 12 ? `${open - 12}:00 PM` : `${open}:00 AM`;
    const opensAtAr = open > 12 ? `${open - 12}:00 م` : `${open}:00 ص`;
    return {
      isOpen: false,
      textEn: `Closed • Opens at ${opensAt}`,
      textAr: `مغلق الآن • يفتح عند الساعة ${opensAtAr}`,
    };
  }
}
