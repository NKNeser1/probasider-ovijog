
"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "bn" | "en";

type Guide = {
  icon: string;
  title: { bn: string; en: string };
  intro: { bn: string; en: string };
  steps: { bn: string[]; en: string[] };
  warning: { bn: string; en: string };
};

const guides: Guide[] = [
  {
    icon: "🔎",
    title: {
      bn: "পাসপোর্টের মেয়াদ শেষ বা শেষ হওয়ার পথে",
      en: "Passport Expired or Expiring Soon",
    },
    intro: {
      bn: "পাসপোর্টের মেয়াদ পরীক্ষা করুন। বিদেশে থাকলে সংশ্লিষ্ট বাংলাদেশ দূতাবাস বা কনস্যুলেটের পাসপোর্ট সেবা সম্পর্কে জানুন।",
      en: "Check your passport expiry date. If you live abroad, consult the relevant Bangladesh embassy or consulate about passport services.",
    },
    steps: {
      bn: [
        "পাসপোর্টের মেয়াদ শেষ হওয়ার তারিখ লিখে রাখুন।",
        "আপনার দেশের বাংলাদেশ মিশনের সরকারি ওয়েবসাইটে পাসপোর্ট রি-ইস্যুর নিয়ম দেখুন।",
        "প্রযোজ্য ক্ষেত্রে NID, ইংরেজি জন্মনিবন্ধন, পুরোনো পাসপোর্ট ও আবেদনের কাগজপত্র প্রস্তুত করুন।",
        "সরকারি নির্দেশনা অনুযায়ী আবেদন, ফি প্রদান ও প্রয়োজনীয় অ্যাপয়েন্টমেন্ট সম্পন্ন করুন।",
        "নতুন পাসপোর্ট পাওয়ার পর আপনার ভিসা, ইকামা বা বসবাসের নথিতে পাসপোর্ট নম্বর আপডেট প্রয়োজন কি না যাচাই করুন।",
      ],
      en: [
        "Record your passport expiry date.",
        "Check the official website of your Bangladesh mission for re-issue procedures.",
        "Prepare your NID, English birth certificate, previous passport and other applicable documents.",
        "Apply, pay the applicable fee and attend the required appointment.",
        "After receiving the new passport, check whether your visa, residence permit or other records need updating.",
      ],
    },
    warning: {
      bn: "পাসপোর্টের মেয়াদ বাড়ানোর নিয়ম, ফি ও সময় দেশ এবং সেবার ধরন অনুযায়ী ভিন্ন হতে পারে।",
      en: "Renewal procedures, fees and processing times vary by country and service type.",
    },
  },
  {
    icon: "🚨",
    title: {
      bn: "পাসপোর্ট হারিয়ে গেলে বা চুরি হলে",
      en: "Lost or Stolen Passport",
    },
    intro: {
      bn: "পাসপোর্ট হারালে দ্রুত প্রয়োজনীয় পদক্ষেপ নিন এবং নথি হারানোর বিষয়টি সংশ্লিষ্ট কর্তৃপক্ষকে জানান।",
      en: "If your passport is lost, take prompt action and report the loss to the appropriate authorities.",
    },
    steps: {
      bn: [
        "পাসপোর্ট কোথায় ও কখন হারিয়েছে, সে বিষয়ে তথ্য লিখে রাখুন।",
        "স্থানীয় পুলিশ বা সংশ্লিষ্ট কর্তৃপক্ষের কাছে রিপোর্ট করুন এবং রিপোর্টের কপি সংগ্রহ করুন।",
        "পুরোনো পাসপোর্টের ফটোকপি, পাসপোর্ট নম্বর বা ডিজিটাল কপি থাকলে সংরক্ষণ করুন।",
        "নিকটস্থ বাংলাদেশ দূতাবাস বা কনস্যুলেটের সঙ্গে যোগাযোগ করে রি-ইস্যু বা জরুরি ভ্রমণ নথির নিয়ম জানুন।",
        "ভ্রমণের জরুরি প্রয়োজন থাকলে টিকিট কাটার আগে সংশ্লিষ্ট মিশনের কাছ থেকে কী নথি প্রয়োজন তা নিশ্চিত করুন।",
      ],
      en: [
        "Write down when and where the passport was lost.",
        "Report the loss to local police or the relevant authority and obtain a copy of the report.",
        "Keep a photocopy, passport number or digital copy of the old passport if available.",
        "Contact the nearest Bangladesh embassy or consulate about re-issue or emergency travel documents.",
        "If you need to travel urgently, confirm the required documents with the mission before booking travel.",
      ],
    },
    warning: {
      bn: "পুলিশ রিপোর্টের নিয়ম দেশভেদে আলাদা। কোনো দালালকে পাসপোর্ট উদ্ধারের নামে টাকা দেবেন না।",
      en: "Police reporting requirements vary by country. Do not pay unofficial agents who promise to recover your passport.",
    },
  },
  {
    icon: "📄",
    title: {
      bn: "পাসপোর্ট নষ্ট, ছেঁড়া বা ক্ষতিগ্রস্ত",
      en: "Damaged Passport",
    },
    intro: {
      bn: "পাসপোর্টের পৃষ্ঠা, তথ্যের অংশ, ছবি বা চিপ ক্ষতিগ্রস্ত হলে ভ্রমণের আগে কর্তৃপক্ষের পরামর্শ নিন।",
      en: "If passport pages, personal details, the photograph or chip are damaged, seek official advice before travelling.",
    },
    steps: {
      bn: [
        "পাসপোর্টের ক্ষতিগ্রস্ত অংশের ছবি তুলে রাখুন।",
        "পাসপোর্টের বাকি অংশ এবং পরিচয়পত্র নিরাপদে রাখুন।",
        "বাংলাদেশ মিশন বা সংশ্লিষ্ট পাসপোর্ট কর্তৃপক্ষকে ক্ষতির ধরন জানান।",
        "রি-ইস্যুর আবেদন ও প্রয়োজনীয় কাগজপত্র সম্পর্কে নির্দেশনা নিন।",
        "কর্তৃপক্ষের অনুমতি বা গ্রহণযোগ্যতা নিশ্চিত না করে ক্ষতিগ্রস্ত পাসপোর্ট দিয়ে ভ্রমণের পরিকল্পনা করবেন না।",
      ],
      en: [
        "Photograph the damaged parts of the passport.",
        "Keep the remaining passport and identity documents safe.",
        "Explain the damage to your Bangladesh mission or passport authority.",
        "Ask about re-issue procedures and supporting documents.",
        "Do not plan to travel using a damaged passport without confirming its acceptability.",
      ],
    },
    warning: {
      bn: "নিজে পাসপোর্ট মেরামত, পৃষ্ঠা পরিবর্তন বা কোনো তথ্য লিখে সংশোধন করবেন না।",
      en: "Do not attempt to repair the passport, replace pages or alter any information yourself.",
    },
  },
  {
    icon: "✍️",
    title: {
      bn: "নাম, জন্মতারিখ বা অন্যান্য তথ্যে ভুল",
      en: "Incorrect Name, Date of Birth or Other Details",
    },
    intro: {
      bn: "পাসপোর্টের তথ্য ভুল হলে সরকারি পরিচয়পত্র ও মূল নথির সঙ্গে মিলিয়ে সংশোধনের নিয়ম জেনে আবেদন করুন।",
      en: "If passport details are incorrect, compare them with official identity documents and follow the formal correction procedure.",
    },
    steps: {
      bn: [
        "পাসপোর্টে ভুল থাকা তথ্যটি চিহ্নিত করুন।",
        "NID, জন্মনিবন্ধন ও প্রাসঙ্গিক সরকারি নথিতে সঠিক তথ্য যাচাই করুন।",
        "নাম, জন্মতারিখ বা পিতা-মাতার নাম সংশোধনের জন্য প্রয়োজনীয় প্রমাণপত্র সংগ্রহ করুন।",
        "বাংলাদেশ মিশন বা পাসপোর্ট কর্তৃপক্ষের নির্দেশনা অনুযায়ী আবেদন করুন।",
        "আবেদনের রসিদ ও রেফারেন্স নম্বর সংরক্ষণ করুন।",
      ],
      en: [
        "Identify the incorrect information in your passport.",
        "Verify the correct details against your NID, birth certificate and relevant official records.",
        "Collect supporting documents for corrections to your name, date of birth or parents' names.",
        "Apply according to the instructions of the Bangladesh mission or passport authority.",
        "Keep your application receipt and reference number.",
      ],
    },
    warning: {
      bn: "সংশোধনের জন্য অতিরিক্ত প্রমাণপত্র বা যাচাই প্রয়োজন হতে পারে। আবেদন করার আগে সংশ্লিষ্ট অফিসের নিয়ম দেখুন।",
      en: "Corrections may require additional evidence or verification. Check the relevant office's rules before applying.",
    },
  },
  {
    icon: "🆕",
    title: {
      bn: "নতুন পাসপোর্ট বা রি-ইস্যুর আবেদন",
      en: "New Passport or Re-issue Application",
    },
    intro: {
      bn: "আবেদনের আগে নিজের বয়স, পরিচয়পত্র ও আবেদনের ধরন অনুযায়ী প্রয়োজনীয় কাগজপত্র যাচাই করুন।",
      en: "Before applying, check the required documents based on your age, identity documents and application type.",
    },
    steps: {
      bn: [
        "সরকারি ই-পাসপোর্ট পোর্টালে নির্দেশনা পড়ুন।",
        "প্রযোজ্য NID বা ইংরেজি জন্মনিবন্ধন এবং আগের পাসপোর্ট প্রস্তুত করুন।",
        "অনলাইনে আবেদন পূরণ করার সময় সরকারি নথির সঙ্গে মিল রেখে তথ্য দিন।",
        "প্রযোজ্য ফি, অ্যাপয়েন্টমেন্ট এবং বায়োমেট্রিকের নিয়ম অনুসরণ করুন।",
        "আবেদন সারাংশ, রসিদ ও ডেলিভারি স্লিপ নিরাপদে রাখুন।",
      ],
      en: [
        "Read the official e-passport portal instructions.",
        "Prepare the applicable NID or English birth certificate and previous passport.",
        "Enter information consistent with your official documents.",
        "Follow the applicable fee, appointment and biometric procedures.",
        "Keep your application summary, receipt and delivery slip safe.",
      ],
    },
    warning: {
      bn: "প্রয়োজনীয় কাগজপত্র আবেদনকারীর অবস্থা ও বিদেশস্থ মিশনের নিয়ম অনুযায়ী আলাদা হতে পারে।",
      en: "Required documents can vary depending on the applicant's circumstances and the overseas mission.",
    },
  },
  {
    icon: "👶",
    title: {
      bn: "শিশুর পাসপোর্ট বা নতুন জন্ম নেওয়া শিশুর পাসপোর্ট",
      en: "Passport for a Child or Newborn",
    },
    intro: {
      bn: "শিশুর পাসপোর্টের জন্য জন্মনিবন্ধন, অভিভাবকের পরিচয় এবং সংশ্লিষ্ট মিশনের নিয়ম যাচাই করুন।",
      en: "For a child's passport, check birth registration, parental identification and the relevant mission's requirements.",
    },
    steps: {
      bn: [
        "শিশুর জন্মনিবন্ধন এবং প্রয়োজনীয় পরিচয়পত্র প্রস্তুত করুন।",
        "অভিভাবকের NID বা পাসপোর্টসহ প্রয়োজনীয় নথি যাচাই করুন।",
        "শিশুর বয়স অনুযায়ী ছবি ও উপস্থিতির নিয়ম জেনে নিন।",
        "বিদেশে জন্ম হলে জন্ম নিবন্ধন ও নাগরিকত্ব-সংক্রান্ত প্রক্রিয়া সম্পর্কে মিশনের নির্দেশনা নিন।",
        "আবেদন জমা দেওয়ার আগে সব নথির নাম ও জন্মতারিখ মিলিয়ে নিন।",
      ],
      en: [
        "Prepare the child's birth certificate and required identity documents.",
        "Check the required parental NID or passport documents.",
        "Confirm photo and attendance requirements based on the child's age.",
        "If the child was born abroad, ask the mission about birth registration and citizenship procedures.",
        "Verify all names and dates of birth before submitting the application.",
      ],
    },
    warning: {
      bn: "শিশুর ক্ষেত্রে অতিরিক্ত নথি, অভিভাবকের সম্মতি বা উপস্থিতির শর্ত থাকতে পারে।",
      en: "Additional documents, parental consent or attendance may be required for children.",
    },
  },
  {
    icon: "🛫",
    title: {
      bn: "জরুরি দেশে ফিরতে হবে",
      en: "Urgent Return or Emergency Travel",
    },
    intro: {
      bn: "পাসপোর্ট না থাকলে বা জরুরি পরিস্থিতিতে দেশে ফিরতে হলে বাংলাদেশ মিশনের সঙ্গে দ্রুত যোগাযোগ করুন।",
      en: "If you have no usable passport or must return home urgently, contact your Bangladesh mission promptly.",
    },
    steps: {
      bn: [
        "নিজের পরিচয়পত্র ও পাসপোর্টের কপি থাকলে প্রস্তুত রাখুন।",
        "পাসপোর্ট হারিয়ে থাকলে সংশ্লিষ্ট পুলিশ রিপোর্ট সংগ্রহ করুন, যদি প্রয়োজন হয়।",
        "দূতাবাস বা কনস্যুলেটকে আপনার পরিস্থিতি এবং ভ্রমণের জরুরি কারণ জানান।",
        "জরুরি ভ্রমণ নথি বা ট্রাভেল পারমিটের যোগ্যতা ও নিয়ম জেনে নিন।",
        "গন্তব্য দেশ, ট্রানজিট ও এয়ারলাইনের শর্ত নিশ্চিত করে তারপর ভ্রমণ পরিকল্পনা করুন।",
      ],
      en: [
        "Prepare your identity documents and any copy of your passport.",
        "Obtain a police report if your passport was lost and a report is required.",
        "Explain your circumstances and urgent travel needs to the embassy or consulate.",
        "Ask whether you qualify for an emergency travel document or travel permit.",
        "Confirm destination, transit and airline requirements before making travel plans.",
      ],
    },
    warning: {
      bn: "জরুরি ভ্রমণ নথি সব দেশে প্রবেশ বা ট্রানজিটের অনুমতি দেয় না। আগে সংশ্লিষ্ট কর্তৃপক্ষের অনুমোদন নিশ্চিত করুন।",
      en: "An emergency travel document may not permit entry or transit through every country. Confirm acceptance in advance.",
    },
  },
  {
    icon: "📍",
    title: {
      bn: "আবেদনের অবস্থা বা পাসপোর্ট সংগ্রহ",
      en: "Application Status or Passport Collection",
    },
    intro: {
      bn: "আবেদন জমা দেওয়ার পর সরকারি পোর্টাল বা সংশ্লিষ্ট মিশনের মাধ্যমে অগ্রগতি যাচাই করুন।",
      en: "After applying, check progress through the official portal or the relevant mission.",
    },
    steps: {
      bn: [
        "আবেদনের রেফারেন্স নম্বর ও ডেলিভারি স্লিপ সংরক্ষণ করুন।",
        "সরকারি পোর্টালে স্ট্যাটাস দেখার সুবিধা থাকলে তা ব্যবহার করুন।",
        "দীর্ঘদিন আপডেট না পেলে সংশ্লিষ্ট অফিসের সরকারি যোগাযোগমাধ্যমে খোঁজ নিন।",
        "পাসপোর্ট সংগ্রহের সময় প্রয়োজনীয় রসিদ ও পরিচয়পত্র সঙ্গে রাখুন।",
        "অন্য কাউকে দিয়ে সংগ্রহ করা যাবে কি না, আগে সংশ্লিষ্ট অফিসের নিয়ম জেনে নিন।",
      ],
      en: [
        "Keep your application reference number and delivery slip.",
        "Use the official portal if online status tracking is available.",
        "If there is no update for an extended period, contact the relevant office through official channels.",
        "Bring the required receipt and identification when collecting your passport.",
        "Check whether collection by another person is permitted before sending a representative.",
      ],
    },
    warning: {
      bn: "প্রসেসিংয়ের সময় নিশ্চিত নয়; আবেদন ও যাচাইয়ের ধরন অনুযায়ী সময় লাগতে পারে।",
      en: "Processing times are not guaranteed and may vary with the application and verification process.",
    },
  },
];

export default function PassportServicePage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [openGuide, setOpenGuide] = useState<number | null>(0);

  const text = {
    bn: {
      back: "← সার্ভিস পেজে ফিরে যান",
      label: "পাসপোর্ট সহায়তা",
      title: "পাসপোর্ট বিষয়ে করণীয়",
      description:
        "পাসপোর্ট হারানো, মেয়াদ শেষ, তথ্য সংশোধন বা নতুন পাসপোর্টের জন্য প্রয়োজনীয় নির্দেশনা এখানে দেখুন।",
      officialTitle: "সরকারি পাসপোর্ট সেবা",
      portal: "ই-পাসপোর্ট পোর্টাল",
      instructions: "আবেদনের নির্দেশনা",
      mission: "বাংলাদেশ মিশন খুঁজুন",
      warningTitle: "গুরুত্বপূর্ণ সতর্কতা",
      warning:
        "এই পেজটি সাধারণ নির্দেশনার জন্য। দেশ, দূতাবাস ও আবেদনকারীর অবস্থা অনুযায়ী নিয়ম, ফি ও কাগজপত্র বদলাতে পারে। সর্বশেষ তথ্য সংশ্লিষ্ট সরকারি ওয়েবসাইট থেকে নিশ্চিত করুন।",
      expand: "নির্দেশনা দেখুন",
      collapse: "নির্দেশনা বন্ধ করুন",
      steps: "করণীয় ধাপ",
      note: "সতর্কতা",
      footer:
        "সঠিক তথ্য যাচাই করুন। পাসপোর্টের মূল কপি ও ব্যক্তিগত তথ্য নিরাপদে রাখুন।",
    },
    en: {
      back: "← Back to Services",
      label: "Passport Assistance",
      title: "Passport Guidance",
      description:
        "Find guidance for lost passports, expiry, data corrections and new passport applications.",
      officialTitle: "Official Passport Services",
      portal: "e-Passport Portal",
      instructions: "Application Instructions",
      mission: "Find a Bangladesh Mission",
      warningTitle: "Important Notice",
      warning:
        "This page provides general guidance. Rules, fees and documents may vary by country, mission and applicant. Confirm the latest requirements through official government websites.",
      expand: "View instructions",
      collapse: "Hide instructions",
      steps: "Steps to Follow",
      note: "Important Note",
      footer:
        "Verify information carefully. Keep your original passport and personal information secure.",
    },
  }[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/services"
            className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            {text.back}
          </Link>

          <div
            className="flex rounded-xl border border-emerald-200 bg-white p-1"
            aria-label="Select language"
          >
            <button
              type="button"
              onClick={() => setLanguage("bn")}
              aria-pressed={language === "bn"}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                language === "bn"
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                language === "en"
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 p-6 text-white shadow-lg sm:p-9">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
            🛂
          </div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-100">
            {text.label}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
            {text.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50 sm:text-base">
            {text.description}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {text.officialTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {language === "bn"
              ? "আবেদন করার আগে সরকারি নির্দেশনা ও প্রয়োজনীয় কাগজপত্র যাচাই করুন।"
              : "Check official instructions and document requirements before applying."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a
              href="https://www.epassport.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              🌐
              <span className="mt-2 block text-sm">{text.portal}</span>
            </a>

            <a
              href="https://www.epassport.gov.bd/instructions/instructions"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              📋
              <span className="mt-2 block text-sm">{text.instructions}</span>
            </a>

            <a
              href="https://mofa.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              🏛️
              <span className="mt-2 block text-sm">{text.mission}</span>
            </a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {language === "bn"
              ? "আপনার সমস্যাটি নির্বাচন করুন"
              : "Choose Your Situation"}
          </h2>

          <div className="space-y-3">
            {guides.map((guide, index) => {
              const isOpen = openGuide === index;

              return (
                <article
                  key={guide.title.en}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                    isOpen
                      ? "border-emerald-300"
                      : "border-slate-200 hover:border-emerald-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGuide(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                      {guide.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-6 text-slate-900">
                        {guide.title[language]}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        {guide.intro[language]}
                      </span>
                    </span>

                    <span className="shrink-0 text-xl font-bold text-emerald-700">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-emerald-100 px-4 pb-5 pt-4 sm:px-6">
                      <h3 className="mb-3 font-bold text-emerald-800">
                        {text.steps}
                      </h3>

                      <ol className="space-y-3">
                        {guide.steps[language].map((step, stepIndex) => (
                          <li
                            key={`${index}-${stepIndex}`}
                            className="flex items-start gap-3 text-sm leading-7 text-slate-700"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="mb-1 text-sm font-bold text-amber-900">
                          ⚠️ {text.note}
                        </p>
                        <p className="text-sm leading-6 text-amber-900">
                          {guide.warning[language]}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenGuide(null)}
                        className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        {text.collapse}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-950">
            ⚠️ {text.warningTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-amber-900">
            {text.warning}
          </p>
        </section>

        <footer className="mt-6 rounded-2xl bg-emerald-900 p-5 text-center text-sm leading-7 text-emerald-50">
          {text.footer}
        </footer>
      </div>
    </main>
  );
}