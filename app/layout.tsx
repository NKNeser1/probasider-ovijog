import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteViewTracker from "@/components/SiteViewTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "প্রবাসীদের অভিযোগ | Probashider Ovijog",
  description:
    "প্রবাসীদের সমস্যা, অভিযোগ ও অনিয়ম তুলে ধরুন। অভিযোগ করুন, প্রমাণ দিন এবং প্রবাসীদের অভিজ্ঞতা ও মতামত জানুন।",
  keywords: [
    "প্রবাসীদের অভিযোগ",
    "Probashider Ovijog",
    "প্রবাসী অভিযোগ",
    "বাংলাদেশি প্রবাসী",
    "প্রবাসীদের সমস্যা",
    "প্রবাসী অধিকার",
    "Bangladeshi expatriates",
    "expatriate complaints",
  ],
  authors: [
    {
      name: "Probashider Ovijog",
    },
  ],
  creator: "Probashider Ovijog",
  openGraph: {
    title: "প্রবাসীদের অভিযোগ | Probashider Ovijog",
    description:
      "প্রবাসীদের সমস্যা, অভিযোগ ও অনিয়ম তুলে ধরুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "প্রবাসীদের অভিযোগ",
    images: [
  {
    url: "/images/og-image.png",
    width: 1200,
    height: 630,
    alt: "প্রবাসীদের অভিযোগ | Probashider Ovijog",
  },
],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    
<html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteViewTracker />
        {children}
      </body>
    </html>
  );
}
