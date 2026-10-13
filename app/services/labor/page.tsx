
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
    icon: "💰",
    title: {
      bn: "বেতন না পাওয়া বা বেতন আটকে রাখা",
      en: "Unpaid or Withheld Salary",
    },
    intro: {
      bn: "নির্ধারিত সময়ে বেতন না পেলে নিজের পাওনা ও প্রমাণ সংরক্ষণ করে পদক্ষেপ নিন।",
      en: "If your salary is delayed, document the amount owed and take appropriate steps.",
    },
    steps: {
      bn: [
        "কোন মাসের কত টাকা বকেয়া আছে, তার হিসাব তৈরি করুন।",
        "চাকরির চুক্তি, বেতন স্লিপ, ব্যাংক স্টেটমেন্ট ও বেতন চাওয়ার মেসেজ সংরক্ষণ করুন।",
        "নিরাপদ হলে নিয়োগকর্তা বা HR বিভাগকে লিখিতভাবে বকেয়া বেতনের কথা জানান।",
        "সমাধান না হলে সংশ্লিষ্ট দেশের শ্রম মন্ত্রণালয় বা সরকারি শ্রম অভিযোগ ব্যবস্থায় যোগাযোগ করুন।",
        "অভিযোগ নম্বর, জমা দেওয়ার তারিখ এবং পাওয়া উত্তর সংরক্ষণ করুন।",
      ],
      en: [
        "List the unpaid amounts and the months concerned.",
        "Keep your contract, payslips, bank statements and salary request messages.",
        "If safe, contact your employer or HR department in writing.",
        "If unresolved, contact the country's labour ministry or official labour complaint service.",
        "Keep your complaint reference, submission date and responses.",
      ],
    },
    warning: {
      bn: "বেতন পাওয়ার প্রমাণ নষ্ট করবেন না এবং বুঝে না নিয়ে পাওনা মিটে গেছে—এমন কাগজে স্বাক্ষর করবেন না।",
      en: "Do not destroy salary evidence or sign a settlement stating that you have been paid unless it is accurate.",
    },
  },
  {
    icon: "📝",
    title: {
      bn: "চাকরির চুক্তি ও শর্ত পরিবর্তন",
      en: "Employment Contract and Changes",
    },
    intro: {
      bn: "চুক্তিতে লেখা বেতন, কাজ, কর্মঘণ্টা বা অন্যান্য শর্ত বাস্তব কাজের সঙ্গে না মিললে নথি যাচাই করুন।",
      en: "If your actual pay, duties, hours or other terms differ from the contract, review your documents.",
    },
    steps: {
      bn: [
        "চুক্তির কপি এবং নিয়োগের সময় দেওয়া লিখিত প্রতিশ্রুতি সংগ্রহ করুন।",
        "চুক্তি ও বাস্তব কাজের পার্থক্যগুলো তারিখসহ লিখে রাখুন।",
        "নতুন চুক্তি বা পরিবর্তিত শর্তের কপি চাইুন।",
        "চাপের মুখে না বুঝে কোনো নতুন শর্তে সম্মতি দেবেন না।",
        "সমাধান না হলে শ্রম কর্তৃপক্ষ বা অনুমোদিত আইনি সহায়তার সঙ্গে যোগাযোগ করুন।",
      ],
      en: [
        "Collect your contract and written recruitment promises.",
        "Record differences between the contract and actual work, including dates.",
        "Request a copy of any revised contract or terms.",
        "Do not agree to unfamiliar terms under pressure.",
        "If unresolved, contact the labour authority or an authorised legal support service.",
      ],
    },
    warning: {
      bn: "চুক্তি পরিবর্তনের বৈধতা ও সম্মতির নিয়ম দেশভেদে আলাদা।",
      en: "Rules on contract changes and consent vary by country.",
    },
  },
  {
    icon: "⏰",
    title: {
      bn: "অতিরিক্ত কাজ, ওভারটাইম ও ছুটি",
      en: "Overtime, Working Hours and Leave",
    },
    intro: {
      bn: "কাজের সময়, সাপ্তাহিক বিশ্রাম বা ছুটি নিয়ে সমস্যা হলে নিজের কাজের সময়ের রেকর্ড রাখুন।",
      en: "If you have issues with working hours, weekly rest or leave, keep a record of your hours.",
    },
    steps: {
      bn: [
        "প্রতিদিন কাজ শুরু ও শেষের সময় লিখে রাখুন।",
        "ডিউটি রোস্টার, হাজিরার রেকর্ড ও সুপারভাইজারের নির্দেশ সংরক্ষণ করুন।",
        "ওভারটাইমের সময় ও প্রাপ্য পারিশ্রমিকের হিসাব করুন।",
        "কোম্পানির HR বিভাগ বা সংশ্লিষ্ট দায়িত্বশীল ব্যক্তিকে লিখিতভাবে বিষয়টি জানান।",
        "প্রয়োজনে সরকারি শ্রম কর্তৃপক্ষের কাছে প্রমাণসহ অভিযোগ করুন।",
      ],
      en: [
        "Record your daily start and finish times.",
        "Keep duty rosters, attendance records and supervisor instructions.",
        "Calculate overtime hours and any payment due.",
        "Raise the issue in writing with HR or the responsible manager.",
        "If necessary, submit supporting evidence to the official labour authority.",
      ],
    },
    warning: {
      bn: "কর্মঘণ্টা, ওভারটাইম ও ছুটির অধিকার স্থানীয় আইন এবং চাকরির ধরন অনুযায়ী নির্ধারিত হয়।",
      en: "Working-hour, overtime and leave entitlements depend on local law and employment type.",
    },
  },
  {
    icon: "🏢",
    title: {
      bn: "কোম্পানির হয়রানি, হুমকি বা অন্যায় আচরণ",
      en: "Workplace Harassment, Threats or Mistreatment",
    },
    intro: {
      bn: "কর্মক্ষেত্রে হয়রানি, অপমান, হুমকি বা অন্যায় আচরণের শিকার হলে নিজের নিরাপত্তাকে অগ্রাধিকার দিন।",
      en: "If you face harassment, insults, threats or mistreatment at work, prioritise your safety.",
    },
    steps: {
      bn: [
        "ঘটনার তারিখ, সময়, স্থান এবং কী ঘটেছে তা লিখে রাখুন।",
        "নিরাপদ ও আইনসম্মত হলে মেসেজ, ইমেইল, সাক্ষীর তথ্য বা অন্যান্য প্রমাণ রাখুন।",
        "বিশ্বস্ত ব্যক্তি, HR বা প্রতিষ্ঠানের অভিযোগ ব্যবস্থাকে জানান—যদি তা নিরাপদ হয়।",
        "হুমকি, সহিংসতা বা তাৎক্ষণিক বিপদ থাকলে স্থানীয় জরুরি সেবার সাহায্য নিন।",
        "শ্রম কর্তৃপক্ষ বা প্রাসঙ্গিক সরকারি সংস্থার কাছে অভিযোগের ব্যবস্থা জেনে নিন।",
      ],
      en: [
        "Record the date, time, location and details of each incident.",
        "Keep messages, emails, witness details or other evidence when safe and lawful.",
        "Contact a trusted person, HR or the workplace complaint channel if safe.",
        "If there is violence, a threat or immediate danger, contact local emergency services.",
        "Ask the labour authority or relevant government agency how to report the issue.",
      ],
    },
    warning: {
      bn: "প্রমাণ সংগ্রহ করতে গিয়ে নিজের নিরাপত্তা ঝুঁকিতে ফেলবেন না। গোপনে রেকর্ড করার আগে স্থানীয় আইন জেনে নিন।",
      en: "Do not risk your safety to collect evidence. Check local law before making secret recordings.",
    },
  },
  {
    icon: "🚪",
    title: {
      bn: "অন্যায়ভাবে চাকরি থেকে বাদ দেওয়া বা চাকরি ছাড়তে চাওয়া",
      en: "Dismissal or Leaving a Job",
    },
    intro: {
      bn: "চাকরি শেষ করা, পদত্যাগ বা চাকরি থেকে বাদ দেওয়ার ঘটনায় চুক্তি ও স্থানীয় শ্রম আইন যাচাই করুন।",
      en: "If you are dismissed or want to resign, review your contract and local labour law.",
    },
    steps: {
      bn: [
        "চাকরি শেষ করার নোটিশ, চুক্তি ও সংশ্লিষ্ট মেসেজ সংরক্ষণ করুন।",
        "চাকরি শেষ হওয়ার তারিখ, বকেয়া বেতন ও অন্যান্য পাওনার হিসাব করুন।",
        "নোটিশের সময়, চুক্তি শেষ করার শর্ত এবং প্রযোজ্য ক্ষতিপূরণের নিয়ম যাচাই করুন।",
        "চূড়ান্ত পাওনা ও চাকরির অভিজ্ঞতা-সংক্রান্ত নথি সম্পর্কে লিখিতভাবে জানতে চান।",
        "বিরোধ হলে সরকারি শ্রম কর্তৃপক্ষের কাছে অভিযোগ বা পরামর্শ নিন।",
      ],
      en: [
        "Keep termination notices, your contract and related messages.",
        "Calculate the end date, unpaid salary and other amounts owed.",
        "Check notice periods, termination conditions and any applicable compensation rules.",
        "Request written details about final settlement and employment records.",
        "If a dispute arises, contact the official labour authority for guidance.",
      ],
    },
    warning: {
      bn: "পদত্যাগ, চাকরি পরিবর্তন ও ক্ষতিপূরণের নিয়ম দেশ এবং চুক্তি অনুযায়ী ভিন্ন হতে পারে।",
      en: "Resignation, job transfer and compensation rules vary by country and contract.",
    },
  },
  {
    icon: "🪪",
    title: {
      bn: "ইকামা, ওয়ার্ক পারমিট বা চাকরি পরিবর্তন",
      en: "Residence Permit, Work Permit or Job Transfer",
    },
    intro: {
      bn: "কাজের অনুমতি বা বসবাসের কাগজপত্র নিয়ে সমস্যা হলে সংশ্লিষ্ট দেশের সরকারি নিয়ম যাচাই করুন।",
      en: "If you have problems with work authorisation or residence documents, check official local requirements.",
    },
    steps: {
      bn: [
        "ইকামা, ওয়ার্ক পারমিট, ভিসা ও চাকরির চুক্তির মেয়াদ পরীক্ষা করুন।",
        "নিয়োগকর্তার সঙ্গে কাগজপত্র নবায়ন বা সংশোধনের যোগাযোগ লিখিতভাবে রাখুন।",
        "চাকরি পরিবর্তনের ক্ষেত্রে সরকারি অনুমোদন, যোগ্যতা ও প্রয়োজনীয় প্রক্রিয়া যাচাই করুন।",
        "নিজের আবেদন বা অনুমতির বর্তমান অবস্থা সরকারি পোর্টালে দেখুন, যদি সুবিধাটি থাকে।",
        "অবস্থা জটিল হলে শ্রম মন্ত্রণালয় বা অভিবাসন কর্তৃপক্ষের নির্দেশনা নিন।",
      ],
      en: [
        "Check the expiry dates of your residence permit, work permit, visa and contract.",
        "Keep written communication about renewals or corrections.",
        "Before changing jobs, verify official approvals, eligibility and procedures.",
        "Check your application or permit status through the official portal if available.",
        "If the situation is complicated, contact the labour ministry or immigration authority.",
      ],
    },
    warning: {
      bn: "অনুমতি ও যোগ্যতা নিশ্চিত না করে চাকরি পরিবর্তন বা কাজ বন্ধ করার সিদ্ধান্ত নিলে আইনি সমস্যা হতে পারে।",
      en: "Changing jobs or stopping work without confirming your status may have legal consequences.",
    },
  },
  {
    icon: "🛂",
    title: {
      bn: "নিয়োগকর্তা পাসপোর্ট আটকে রাখলে",
      en: "Employer Withholding Your Passport",
    },
    intro: {
      bn: "নিয়োগকর্তা পাসপোর্ট ফেরত না দিলে পরিস্থিতি অনুযায়ী নিরাপদভাবে সহায়তা চান।",
      en: "If your employer refuses to return your passport, seek assistance appropriate to your situation.",
    },
    steps: {
      bn: [
        "পাসপোর্ট কখন, কাকে এবং কী কারণে দিয়েছেন, তার তথ্য লিখে রাখুন।",
        "নিরাপদ হলে লিখিতভাবে পাসপোর্ট ফেরত চান এবং যোগাযোগের প্রমাণ রাখুন।",
        "হুমকি বা জোরজবরদস্তি থাকলে একা মুখোমুখি সংঘাতে যাবেন না।",
        "সংশ্লিষ্ট দেশের শ্রম কর্তৃপক্ষ বা পুলিশকে যোগাযোগের উপায় জেনে নিন।",
        "প্রয়োজনে বাংলাদেশ দূতাবাস বা কনস্যুলেটের সহায়তা চান।",
      ],
      en: [
        "Record when, to whom and why you handed over your passport.",
        "If safe, request its return in writing and keep evidence of the request.",
        "Avoid confronting the employer alone if threats or coercion are involved.",
        "Ask the labour authority or police in the relevant country how to seek help.",
        "Contact the Bangladesh embassy or consulate if needed.",
      ],
    },
    warning: {
      bn: "পাসপোর্ট আটকে রাখা সংক্রান্ত আইন দেশভেদে আলাদা। তাৎক্ষণিক বিপদ থাকলে আগে নিরাপদ স্থানে যান।",
      en: "Laws on passport retention vary by country. If you are in immediate danger, seek safety first.",
    },
  },
  {
    icon: "📂",
    title: {
      bn: "শ্রম অভিযোগ কীভাবে করবেন",
      en: "How to File a Labour Complaint",
    },
    intro: {
      bn: "বেতন, চুক্তি বা কর্মক্ষেত্রের বিরোধের অভিযোগ করার আগে তথ্য ও প্রমাণ গুছিয়ে নিন।",
      en: "Organise your facts and evidence before filing a complaint about pay, contract or workplace disputes.",
    },
    steps: {
      bn: [
        "সমস্যাটি কী, কখন শুরু হয়েছে এবং কী সমাধান চান তা সংক্ষেপে লিখুন।",
        "পাসপোর্টের প্রয়োজনীয় পরিচয়-তথ্য, চুক্তি, বেতন স্লিপ ও যোগাযোগের প্রমাণ প্রস্তুত রাখুন।",
        "সংশ্লিষ্ট দেশের সরকারি শ্রম মন্ত্রণালয় বা অভিযোগ পোর্টাল খুঁজুন।",
        "অভিযোগ জমা দিলে রেফারেন্স নম্বর ও জমা দেওয়ার প্রমাণ সংরক্ষণ করুন।",
        "প্রতিক্রিয়া না পেলে সরকারি নির্দেশনা অনুযায়ী পরবর্তী পদক্ষেপ বা আইনি সহায়তা নিন।",
      ],
      en: [
        "Briefly describe the issue, when it began and what resolution you seek.",
        "Prepare relevant identification details, contract, payslips and communication evidence.",
        "Find the official labour ministry or complaint portal for your country.",
        "Keep the reference number and proof of submission.",
        "If you receive no response, follow official escalation procedures or seek legal advice.",
      ],
    },
    warning: {
      bn: "শুধু সরকারি ওয়েবসাইট বা যাচাই করা যোগাযোগমাধ্যম ব্যবহার করুন। অভিযোগে অপ্রয়োজনীয় ব্যক্তিগত তথ্য প্রকাশ করবেন না।",
      en: "Use official websites or verified contact channels. Do not disclose unnecessary personal information in a complaint.",
    },
  },
];

export default function LaborServicePage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [openGuide, setOpenGuide] = useState<number | null>(0);

  const text = {
    bn: {
      back: "← সার্ভিস পেজে ফিরে যান",
      label: "শ্রম অধিকার ও চাকরি",
      title: "আপনার শ্রম অধিকার জানুন",
      description:
        "বেতন, চাকরির চুক্তি, কর্মক্ষেত্রের সমস্যা ও শ্রম অভিযোগ সম্পর্কে প্রয়োজনীয় করণীয় ধাপে ধাপে দেখুন।",
      officialTitle: "সরকারি সহায়তা ও তথ্য",
      bangladesh: "বাংলাদেশ শ্রম অধিদপ্তর",
      probashi: "প্রবাসী কল্যাণ মন্ত্রণালয়",
      mofa: "বাংলাদেশ পররাষ্ট্র মন্ত্রণালয়",
      warningTitle: "গুরুত্বপূর্ণ সতর্কতা",
      warning:
        "এই নির্দেশনাগুলো সাধারণ তথ্যের জন্য। শ্রম আইন, অভিযোগের নিয়ম ও কর্মীর অধিকার দেশভেদে আলাদা। আপনার কর্মস্থলের দেশের সরকারি নিয়ম যাচাই করুন।",
      steps: "করণীয় ধাপ",
      note: "সতর্কতা",
      collapse: "নির্দেশনা বন্ধ করুন",
      footer:
        "আপনার চুক্তি ও প্রমাণ সংরক্ষণ করুন। জরুরি বিপদে স্থানীয় জরুরি সেবার সাহায্য নিন।",
    },
    en: {
      back: "← Back to Services",
      label: "Labour Rights and Employment",
      title: "Know Your Labour Rights",
      description:
        "Explore practical steps for salary issues, employment contracts, workplace problems and labour complaints.",
      officialTitle: "Official Information and Support",
      bangladesh: "Department of Labour, Bangladesh",
      probashi: "Ministry of Expatriates' Welfare",
      mofa: "Bangladesh Ministry of Foreign Affairs",
      warningTitle: "Important Notice",
      warning:
        "This is general information. Labour laws, complaint procedures and worker rights vary by country. Check the official rules of the country where you work.",
      steps: "Steps to Follow",
      note: "Important Note",
      collapse: "Hide instructions",
      footer:
        "Keep your contract and evidence safe. Contact local emergency services if you are in immediate danger.",
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
            ⚖️
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
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a
              href="https://dol.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              ⚖️
              <span className="mt-2 block text-sm">{text.bangladesh}</span>
            </a>
            <a
              href="https://probashi.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              🌍
              <span className="mt-2 block text-sm">{text.probashi}</span>
            </a>
            <a
              href="https://mofa.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              🏛️
              <span className="mt-2 block text-sm">{text.mofa}</span>
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