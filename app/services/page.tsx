
"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "bn" | "en";

const services = [
  {
    id: "embassy",
    icon: "🏛️",
    title: { bn: "দূতাবাস ও কনস্যুলেট", en: "Embassies & Consulates" },
    description: {
      bn: "বাংলাদেশ দূতাবাস, কনস্যুলেট ও অফিসিয়াল যোগাযোগের তথ্য।",
      en: "Embassy, consulate and official contact information.",
    },
  },
  {
    id: "emergency",
    icon: "🆘",
    title: { bn: "জরুরি যোগাযোগ", en: "Emergency Contacts" },
    description: {
      bn: "জরুরি পরিস্থিতিতে প্রয়োজনীয় যোগাযোগের তথ্য।",
      en: "Important contacts for emergency situations.",
    },
  },
  {
    id: "passport",
    icon: "📖",
    title: { bn: "পাসপোর্ট ও কনস্যুলার সেবা", en: "Passport & Consular Services" },
    description: {
      bn: "পাসপোর্ট, নবায়ন ও কনস্যুলার সেবা সম্পর্কিত তথ্য।",
      en: "Information about passports, renewals and consular services.",
    },
  },
  {
    id: "labor",
    icon: "⚖️",
    title: { bn: "শ্রম অধিকার ও চাকরি", en: "Labor Rights & Employment" },
    description: {
      bn: "বেতন, চাকরি ও শ্রম অধিকার বিষয়ে সরকারি সহায়তার তথ্য।",
      en: "Official support information for salary, employment and labor rights.",
    },
  },
  {
    id: "visa",
    icon: "🪪",
    title: { bn: "ভিসা ও ইকামা", en: "Visa & Iqama" },
    description: {
      bn: "ভিসা, ইকামা ও সংশ্লিষ্ট সরকারি সেবার তথ্য।",
      en: "Information about visas, iqama and related official services.",
    },
  },
  {
    id: "notices",
    icon: "🔔",
    title: { bn: "সরকারি নোটিশ ও আপডেট", en: "Government Notices & Updates" },
    description: {
      bn: "সরকারি ঘোষণা, নির্দেশনা ও গুরুত্বপূর্ণ আপডেট।",
      en: "Government announcements, guidance and important updates.",
    },
  },
];

export default function ServicesPage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [notice, setNotice] = useState("");

  const bn = language === "bn";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              🌍
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold text-emerald-800 sm:text-lg">
                {bn ? "প্রবাসীদের অভিযোগ" : "Probasider Ovijog"}
              </span>
              <span className="block text-xs text-slate-500 sm:text-sm">
                {bn ? "প্রবাসীদের প্রয়োজনীয় সেবা" : "Expatriate Service Hub"}
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setLanguage(bn ? "en" : "bn");
              setNotice("");
            }}
            className="shrink-0 rounded-xl border border-emerald-700 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            aria-label={bn ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন"}
          >
            {bn ? "English" : "বাংলা"}
          </button>
        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            <span aria-hidden="true">←</span>
            {bn ? "হোমপেজে ফিরে যান" : "Back to Home"}
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
              🌍 {bn ? "প্রবাসীদের জন্য এক জায়গায়" : "One place for expatriates"}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {bn ? "প্রবাসীদের প্রয়োজনীয় সেবা" : "Essential Services for Expatriates"}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              {bn
                ? "দূতাবাস, জরুরি যোগাযোগ, পাসপোর্ট, শ্রম অধিকার, ভিসা ও সরকারি তথ্য খুঁজুন। প্রয়োজনীয় তথ্য যাচাই করে সংশ্লিষ্ট সরকারি উৎস ব্যবহার করুন।"
                : "Find embassy contacts, emergency information, passport services, labor rights, visa guidance and government updates. Verify information and use the relevant official sources."}
            </p>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div
          role="note"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <div>
              <h2 className="font-extrabold text-amber-950">
                {bn ? "সতর্কবার্তা" : "Important Notice"}
              </h2>
              <p className="mt-1 text-sm leading-7 text-amber-900">
                {bn
                  ? "প্রবাসীদের অভিযোগ একটি তথ্যভিত্তিক সহায়তা প্ল্যাটফর্ম; এটি কোনো দূতাবাস বা সরকারি সংস্থা নয়। নিয়ম, ফি, যোগাযোগ ও জরুরি নম্বর পরিবর্তিত হতে পারে। ব্যক্তিগত তথ্য বা টাকা দেওয়ার আগে সংশ্লিষ্ট সরকারি ওয়েবসাইট থেকে তথ্য যাচাই করুন।"
                  : "Probasider Ovijog is an information and support platform, not an embassy or government agency. Rules, fees, contacts and emergency numbers may change. Verify information through official government websites before sharing personal information or making payments."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {bn ? "সেবার বিভাগসমূহ" : "Service Categories"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            {bn
              ? "আপনার প্রয়োজন অনুযায়ী একটি বিভাগ নির্বাচন করুন।"
              : "Choose a category according to your needs."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:p-6"
            >
              <div className="flex w-full items-start justify-between gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                  {service.icon}
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                {service.title[language]}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">
                {service.description[language]}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-900">
                {bn ? "বিভাগ নির্বাচন করুন" : "Select Category"}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900"
          >
            <div className="flex items-start justify-between gap-3">
              <p>{notice}</p>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="shrink-0 rounded-lg px-2 py-1 font-bold hover:bg-emerald-100"
                aria-label={bn ? "বার্তা বন্ধ করুন" : "Dismiss message"}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* NEXT STEP INFORMATION */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl" aria-hidden="true">🌐</span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {bn ? "দেশ নির্বাচন করে সেবা খুঁজুন" : "Find Services by Country"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {bn
                  ? "পরবর্তী ধাপে প্রতিটি বিভাগের জন্য দেশ নির্বাচন, যাচাইকৃত যোগাযোগের তথ্য এবং সরকারি ওয়েবসাইটের লিংক যুক্ত করা হবে। তথ্য যাচাই ছাড়া কোনো নম্বর বা লিংককে সরকারি বলে ধরে নেবেন না।"
                  : "In the next step, we will add country selection, verified contact information and official website links for each category. Do not assume a number or link is official until it has been verified."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            {bn ? "হোমপেজে ফিরে যান" : "Return to Home"}
          </Link>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            {bn ? "অভিযোগ জমা দিন" : "Submit a Complaint"}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm leading-7 text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Probasider Ovijog
          <p>
            {bn
              ? "প্রবাসীদের কথা, এক প্ল্যাটফর্মে।"
              : "Expatriate voices, one platform."}
          </p>
        </div>
      </footer>
    </main>
  );
}