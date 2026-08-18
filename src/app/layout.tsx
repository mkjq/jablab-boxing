import type { Metadata, Viewport } from "next";
import { Cairo, Montserrat } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jab Lab Boxing Club | نادي جاب لاب للملاكمة",
  description:
    "Amman's Premier High-Performance Boxing Club & Athletic Conditioning Lab. Join decorated Olympic and National Team coaches.",
  keywords: [
    "Jab Lab Boxing",
    "جاب لاب",
    "نادي ملاكمة عمان",
    "Boxing Amman",
    "Olympic Boxing Jordan",
    "Odai Al-Hindawi",
    "عدي الهنداوي",
    "ملاكمة الأردن",
  ],
  authors: [{ name: "Jab Lab Boxing Club" }],
  creator: "Jab Lab Boxing",
  publisher: "Jab Lab Boxing Club",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    title: "Jab Lab Boxing Club | نادي جاب لاب للملاكمة",
    description: "Where Champions Are Engineered. Elite Boxing Training & Conditioning in Amman.",
    url: "https://jablabboxing.com",
    siteName: "Jab Lab Boxing Club",
    images: [
      {
        url: "/images/logo.jpg",
        width: 600,
        height: 600,
        alt: "Jab Lab Boxing Official Crest",
      },
    ],
    locale: "ar_JO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jab Lab Boxing Club | نادي جاب لاب للملاكمة",
    description: "Where Champions Are Engineered. Elite Boxing Training in Amman.",
    images: ["/images/logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-jab-void text-white font-sans antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
