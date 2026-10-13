
"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "bn" | "en";

type VisaCountry = {
  code: string;
  en: string;
  bn: string;
};

type OfficialVisaSource = {
  name: string;
  url: string;
  description: { bn: string; en: string };
};

const countryCodes = `
AF AL DZ AD AO AG AR AM AU AT AZ
BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA
CF TD CL CN CO KM CG CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET
FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IT JM JP
JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM
MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL
PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD
SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN
YE ZM ZW PS
`.trim().split(/\s+/);

const countryNames: Record<string, { en: string; bn: string }> = {
  AF: { en: "Afghanistan", bn: "আফগানিস্তান" },
  SA: { en: "Saudi Arabia", bn: "সৌদি আরব" },
  BD: { en: "Bangladesh", bn: "বাংলাদেশ" },
  AE: { en: "United Arab Emirates", bn: "সংযুক্ত আরব আমিরাত" },
  QA: { en: "Qatar", bn: "কাতার" },
  KW: { en: "Kuwait", bn: "কুয়েত" },
  OM: { en: "Oman", bn: "ওমান" },
  BH: { en: "Bahrain", bn: "বাহরাইন" },
  IN: { en: "India", bn: "ভারত" },
  PK: { en: "Pakistan", bn: "পাকিস্তান" },
  NP: { en: "Nepal", bn: "নেপাল" },
  LK: { en: "Sri Lanka", bn: "শ্রীলঙ্কা" },
  MY: { en: "Malaysia", bn: "মালয়েশিয়া" },
  SG: { en: "Singapore", bn: "সিঙ্গাপুর" },
  JP: { en: "Japan", bn: "জাপান" },
  KR: { en: "South Korea", bn: "দক্ষিণ কোরিয়া" },
  CN: { en: "China", bn: "চীন" },
  GB: { en: "United Kingdom", bn: "যুক্তরাজ্য" },
  US: { en: "United States", bn: "যুক্তরাষ্ট্র" },
  CA: { en: "Canada", bn: "কানাডা" },
  AU: { en: "Australia", bn: "অস্ট্রেলিয়া" },
  NZ: { en: "New Zealand", bn: "নিউজিল্যান্ড" },
  TR: { en: "Türkiye", bn: "তুরস্ক" },
  ID: { en: "Indonesia", bn: "ইন্দোনেশিয়া" },
  TH: { en: "Thailand", bn: "থাইল্যান্ড" },
  EG: { en: "Egypt", bn: "মিশর" },
  ZA: { en: "South Africa", bn: "দক্ষিণ আফ্রিকা" },
  PS: { en: "Palestine", bn: "ফিলিস্তিন" },
};

const visaCountries: VisaCountry[] = countryCodes.map((code) => {
  const regionNamesEn = new Intl.DisplayNames(["en"], { type: "region" });
  const regionNamesBn = new Intl.DisplayNames(["bn"], { type: "region" });
  const names = countryNames[code];

  return {
    code,
    en: names?.en ?? regionNamesEn.of(code) ?? code,
    bn: names?.bn ?? regionNamesBn.of(code) ?? names?.en ?? code,
  };
});

const officialVisaSources: Record<string, OfficialVisaSource[]> = {
  "Saudi Arabia": [
    {
      name: "KSA Visa",
      url: "https://ksavisa.sa/",
      description: {
        bn: "সৌদি ভিসা-সংক্রান্ত সরকারি সেবা",
        en: "Official Saudi visa services",
      },
    },
    {
      name: "Absher",
      url: "https://www.absher.sa/",
      description: {
        bn: "ইকামা ও সংশ্লিষ্ট সরকারি সেবা",
        en: "Iqama and related government services",
      },
    },
    {
      name: "Qiwa",
      url: "https://www.qiwa.sa/",
      description: {
        bn: "শ্রম ও চাকরিসংক্রান্ত সেবা",
        en: "Employment and labour services",
      },
    },
    {
      name: "HRSD",
      url: "https://www.hrsd.gov.sa/",
      description: {
        bn: "মানবসম্পদ ও সামাজিক উন্নয়ন মন্ত্রণালয়",
        en: "Ministry of Human Resources and Social Development",
      },
    },
    {
      name: "Ministry of Interior",
      url: "https://www.moi.gov.sa/",
      description: {
        bn: "সৌদি স্বরাষ্ট্র মন্ত্রণালয়",
        en: "Saudi Ministry of Interior",
      },
    },
  ],
  "United Arab Emirates": [
    {
      name: "UAE Government",
      url: "https://u.ae/en/information-and-services/visa-and-emirates-id",
      description: {
        bn: "ভিসা ও এমিরেটস আইডি-সংক্রান্ত সরকারি তথ্য",
        en: "Official visa and Emirates ID information",
      },
    },
    {
      name: "ICP",
      url: "https://icp.gov.ae/",
      description: {
        bn: "পরিচয়, নাগরিকত্ব ও আবাসন সেবা",
        en: "Identity, citizenship and residency services",
      },
    },
  ],
  Qatar: [
    {
      name: "Qatar Government",
      url: "https://hukoomi.gov.qa/",
      description: {
        bn: "কাতার সরকারের অনলাইন সেবা",
        en: "Qatar government online services",
      },
    },
    {
      name: "Qatar Ministry of Interior",
      url: "https://portal.moi.gov.qa/",
      description: {
        bn: "স্বরাষ্ট্র ও ইমিগ্রেশন-সংক্রান্ত সেবা",
        en: "Interior and immigration services",
      },
    },
  ],
  Kuwait: [
    {
      name: "Kuwait Government Online",
      url: "https://e.gov.kw/sites/kgoenglish/Pages/CitizensResidents/InfoSubPages/ImmigrationAndTravel.aspx",
      description: {
        bn: "ভিসা, ইমিগ্রেশন ও আবাসনসংক্রান্ত তথ্য",
        en: "Visa, immigration and residency information",
      },
    },
  ],
  Oman: [
    {
      name: "Royal Oman Police",
      url: "https://www.rop.gov.om/",
      description: {
        bn: "পাসপোর্ট, ভিসা ও আবাসনসংক্রান্ত সেবা",
        en: "Passport, visa and residency services",
      },
    },
  ],
  Bahrain: [
    {
      name: "Bahrain Government",
      url: "https://www.bahrain.bh/",
      description: {
        bn: "বাহরাইন সরকারের অনলাইন সেবা",
        en: "Bahrain government online services",
      },
    },
  ],
  Malaysia: [
    {
      name: "Malaysia Immigration",
      url: "https://www.imi.gov.my/",
      description: {
        bn: "ইমিগ্রেশন ও ভিসা-সংক্রান্ত সরকারি তথ্য",
        en: "Official immigration and visa information",
      },
    },
  ],
  Singapore: [
    {
      name: "Immigration & Checkpoints Authority",
      url: "https://www.ica.gov.sg/",
      description: {
        bn: "ভিসা, প্রবেশ ও পাস-সংক্রান্ত সেবা",
        en: "Visa, entry and pass services",
      },
    },
  ],
  Japan: [
    {
      name: "Japan Ministry of Foreign Affairs",
      url: "https://www.mofa.go.jp/j_info/visit/visa/",
      description: {
        bn: "জাপানের সরকারি ভিসা তথ্য",
        en: "Official Japanese visa information",
      },
    },
  ],
  "South Korea": [
    {
      name: "Korea Visa Portal",
      url: "https://www.visa.go.kr/",
      description: {
        bn: "কোরিয়ার ভিসা-সংক্রান্ত তথ্য",
        en: "Korean visa information",
      },
    },
  ],
  India: [
    {
      name: "Indian Visa Online",
      url: "https://indianvisaonline.gov.in/",
      description: {
        bn: "ভারতের সরকারি ভিসা পোর্টাল",
        en: "Official Indian visa portal",
      },
    },
  ],
  "United Kingdom": [
    {
      name: "GOV.UK Visas and Immigration",
      url: "https://www.gov.uk/browse/visas-immigration",
      description: {
        bn: "যুক্তরাজ্যের ভিসা ও ইমিগ্রেশন নির্দেশনা",
        en: "UK visa and immigration guidance",
      },
    },
  ],
  "United States": [
    {
      name: "U.S. Department of State",
      url: "https://travel.state.gov/content/travel/en/us-visas.html",
      description: {
        bn: "মার্কিন ভিসা-সংক্রান্ত সরকারি তথ্য",
        en: "Official US visa information",
      },
    },
    {
      name: "USCIS",
      url: "https://www.uscis.gov/",
      description: {
        bn: "ইমিগ্রেশন ও আবাসনসংক্রান্ত সেবা",
        en: "Immigration and residency services",
      },
    },
  ],
  Canada: [
    {
      name: "Immigration, Refugees and Citizenship Canada",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
      description: {
        bn: "কানাডার সরকারি ইমিগ্রেশন সেবা",
        en: "Official Canadian immigration services",
      },
    },
  ],
  Australia: [
    {
      name: "Australian Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/",
      description: {
        bn: "ভিসা ও ইমিগ্রেশনসংক্রান্ত সরকারি তথ্য",
        en: "Official visa and immigration information",
      },
    },
  ],
  Pakistan: [
    {
      name: "Pakistan Online Visa System",
      url: "https://visa.nadra.gov.pk/",
      description: {
        bn: "পাকিস্তানের অনলাইন ভিসা ব্যবস্থা",
        en: "Pakistan online visa system",
      },
    },
  ],
  Nepal: [
    {
      name: "Nepal Department of Immigration",
      url: "https://www.immigration.gov.np/",
      description: {
        bn: "নেপালের সরকারি ইমিগ্রেশন তথ্য",
        en: "Official Nepal immigration information",
      },
    },
  ],
  Bangladesh: [
    {
      name: "Ministry of Expatriates' Welfare",
      url: "https://probashi.gov.bd/",
      description: {
        bn: "প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়",
        en: "Ministry of Expatriates' Welfare and Overseas Employment",
      },
    },
  ],
};

type Guide = {
  icon: string;
  title: { bn: string; en: string };
  intro: { bn: string; en: string };
  steps: { bn: string[]; en: string[] };
  warning: { bn: string; en: string };
};

const guides: Guide[] = [
  {
    icon: "🛂",
    title: {
      bn: "ভিসার মেয়াদ শেষ বা শেষ হওয়ার পথে",
      en: "Visa Expired or Expiring Soon",
    },
    intro: {
      bn: "ভিসার মেয়াদ ও বর্তমান স্ট্যাটাস যাচাই করে সময়মতো প্রয়োজনীয় পদক্ষেপ নিন।",
      en: "Check your visa expiry date and current status, then take action in time.",
    },
    steps: {
      bn: [
        "ভিসার ধরন, মেয়াদ শেষ হওয়ার তারিখ ও প্রবেশের শর্ত যাচাই করুন।",
        "আপনি যে দেশে আছেন, সেই দেশের সরকারি ইমিগ্রেশন পোর্টালে স্ট্যাটাস দেখুন।",
        "নবায়ন, এক্সটেনশন বা অন্য বৈধ ব্যবস্থার সুযোগ আছে কি না জেনে নিন।",
        "প্রযোজ্য হলে নিয়োগকর্তা, স্পনসর বা অনুমোদিত কর্তৃপক্ষের সঙ্গে দ্রুত যোগাযোগ করুন।",
        "আবেদন, ফি ও যোগাযোগের রসিদ বা রেফারেন্স নম্বর সংরক্ষণ করুন।",
      ],
      en: [
        "Check your visa type, expiry date and entry conditions.",
        "Check your status through the official immigration portal of your country.",
        "Ask whether an extension, renewal or another lawful option is available.",
        "Where applicable, promptly contact your employer, sponsor or authorised authority.",
        "Keep application receipts and reference numbers.",
      ],
    },
    warning: {
      bn: "মেয়াদোত্তীর্ণ ভিসায় থাকা বা কাজ করার ফল দেশ ও ভিসার ধরন অনুযায়ী ভিন্ন হতে পারে। দ্রুত সরকারি পরামর্শ নিন।",
      en: "Consequences of overstaying or working on an expired visa vary by country and visa type. Seek official advice promptly.",
    },
  },
  {
    icon: "🪪",
    title: {
      bn: "ইকামা নবায়ন বা মেয়াদ শেষ",
      en: "Iqama Renewal or Expiry",
    },
    intro: {
      bn: "সৌদি আরবে বসবাসের অনুমতি বা ইকামার মেয়াদ যাচাই করুন এবং নবায়নসংক্রান্ত সমস্যা হলে সরকারি চ্যানেলে যোগাযোগ করুন।",
      en: "Check your Saudi residence permit (Iqama) expiry and use official channels if renewal is delayed.",
    },
    steps: {
      bn: [
        "ইকামার মেয়াদ এবং সরকারি সিস্টেমে বর্তমান অবস্থা যাচাই করুন।",
        "নিয়োগকর্তা বা HR বিভাগকে নবায়নের অবস্থা লিখিতভাবে জিজ্ঞাসা করুন।",
        "নবায়ন আটকে থাকলে কী কারণে আটকে আছে, তা জানতে চান।",
        "প্রয়োজনে সৌদি মানবসম্পদ ও সামাজিক উন্নয়ন মন্ত্রণালয় বা সংশ্লিষ্ট সরকারি কর্তৃপক্ষের সাহায্য নিন।",
        "সমস্যার প্রমাণ হিসেবে ইকামার কপি, চুক্তি ও যোগাযোগের রেকর্ড সংরক্ষণ করুন।",
      ],
      en: [
        "Check the Iqama expiry date and current official status.",
        "Ask your employer or HR department in writing about the renewal.",
        "Request the reason if renewal is delayed.",
        "If needed, contact Saudi Arabia's Ministry of Human Resources and Social Development or the relevant authority.",
        "Keep copies of your Iqama, contract and related communications.",
      ],
    },
    warning: {
      bn: "ইকামা নবায়নের দায়িত্ব, ফি ও প্রক্রিয়া পরিস্থিতি অনুযায়ী ভিন্ন হতে পারে। আপনার ক্ষেত্রে প্রযোজ্য সরকারি নিয়ম নিশ্চিত করুন।",
      en: "Renewal responsibilities, fees and procedures may depend on your circumstances. Confirm the rules applicable to you.",
    },
  },
  {
    icon: "🏢",
    title: {
      bn: "কোম্পানি ইকামা নবায়ন করছে না",
      en: "Employer Has Not Renewed the Iqama",
    },
    intro: {
      bn: "নিয়োগকর্তা নবায়ন না করলে বিষয়টি লিখিতভাবে জানান এবং নিজের আইনি অবস্থান সম্পর্কে সরকারি নির্দেশনা নিন।",
      en: "If your employer has not renewed your Iqama, document the issue and seek official guidance about your status.",
    },
    steps: {
      bn: [
        "ইকামার মেয়াদ শেষ হওয়ার তারিখ ও বর্তমান অবস্থা লিখে রাখুন।",
        "HR বা নিয়োগকর্তাকে নবায়নের অনুরোধ লিখিতভাবে পাঠান।",
        "অনুরোধের কপি, উত্তর এবং সংশ্লিষ্ট নথি সংরক্ষণ করুন।",
        "সৌদি শ্রম কর্তৃপক্ষ বা সংশ্লিষ্ট সরকারি সেবা চ্যানেলে আপনার পরিস্থিতি জানান।",
        "প্রয়োজনে অনুমোদিত আইনি সহায়তা বা বাংলাদেশ দূতাবাসের পরামর্শ নিন।",
      ],
      en: [
        "Record the Iqama expiry date and current status.",
        "Send your employer or HR department a written renewal request.",
        "Keep copies of the request, response and supporting documents.",
        "Explain your circumstances to the relevant Saudi labour authority or official service channel.",
        "If necessary, seek authorised legal advice or contact the Bangladesh Embassy.",
      ],
    },
    warning: {
      bn: "নিয়োগকর্তার দায়িত্ব ও প্রতিকার প্রযোজ্য আইন এবং কর্মীর অবস্থার ওপর নির্ভর করে। নিজে থেকে আইনি সিদ্ধান্ত নেবেন না।",
      en: "Employer obligations and remedies depend on applicable law and your circumstances. Do not rely on assumptions.",
    },
  },
  {
    icon: "🔄",
    title: {
      bn: "চাকরি পরিবর্তন বা স্পনসরশিপ ট্রান্সফার",
      en: "Job Change or Employer Transfer",
    },
    intro: {
      bn: "চাকরি পরিবর্তনের আগে আপনার ভিসা, চুক্তি ও ট্রান্সফারের যোগ্যতা সরকারি নিয়মে যাচাই করুন।",
      en: "Before changing jobs, verify your visa, contract and transfer eligibility under official rules.",
    },
    steps: {
      bn: [
        "বর্তমান চাকরির চুক্তি, নোটিশের শর্ত ও কাজের অনুমতির অবস্থা যাচাই করুন।",
        "নতুন নিয়োগকর্তার প্রস্তাব ও প্রয়োজনীয় কাগজপত্র লিখিতভাবে সংগ্রহ করুন।",
        "সরকারি সিস্টেমে ট্রান্সফারের যোগ্যতা ও অনুমোদনের শর্ত দেখুন।",
        "প্রয়োজনীয় অনুমোদন সম্পন্ন হওয়ার আগে নতুন কাজে যোগ দেওয়া যাবে কি না নিশ্চিত করুন।",
        "ট্রান্সফারের আবেদন ও অনুমোদনের প্রমাণ সংরক্ষণ করুন।",
      ],
      en: [
        "Review your current contract, notice requirements and work authorisation.",
        "Obtain the new employer's offer and required documents in writing.",
        "Check transfer eligibility and approval requirements in the official system.",
        "Confirm when you are legally permitted to start the new job.",
        "Keep evidence of the transfer application and approval.",
      ],
    },
    warning: {
      bn: "ট্রান্সফারের যোগ্যতা সবার জন্য এক নয়। চাকরি ছাড়ার আগে সরকারি নিয়ম ও আপনার চুক্তি যাচাই করুন।",
      en: "Transfer eligibility is not the same for everyone. Check official rules and your contract before leaving your job.",
    },
  },
  {
    icon: "✈️",
    title: {
      bn: "Exit/Re-entry ভিসা নিয়ে সমস্যা",
      en: "Exit/Re-entry Visa Problems",
    },
    intro: {
      bn: "সৌদি আরব থেকে সাময়িকভাবে বের হওয়া ও ফিরে আসার আগে ভিসার মেয়াদ এবং শর্ত যাচাই করুন।",
      en: "Before leaving Saudi Arabia temporarily and returning, check the visa validity and conditions.",
    },
    steps: {
      bn: [
        "সরকারি সিস্টেমে Exit/Re-entry ভিসা ইস্যু হয়েছে কি না যাচাই করুন।",
        "ভিসার মেয়াদ, অনুমোদিত ফেরার সময় এবং পাসপোর্টের মেয়াদ দেখুন।",
        "টিকিট কাটার আগে এয়ারলাইন ও সরকারি সিস্টেমে ভ্রমণের যোগ্যতা নিশ্চিত করুন।",
        "ভিসা বাতিল, মেয়াদ বাড়ানো বা ফেরার সময় পরিবর্তনের প্রয়োজন হলে অনুমোদিত প্রক্রিয়া অনুসরণ করুন।",
        "ভিসার কপি ও সংশ্লিষ্ট অনুমোদন নিজের কাছে সংরক্ষণ করুন।",
      ],
      en: [
        "Check whether the Exit/Re-entry visa has been issued in the official system.",
        "Verify its validity, permitted return period and passport expiry.",
        "Confirm travel eligibility with the airline and official system before booking.",
        "Follow authorised procedures if cancellation, extension or a change is required.",
        "Keep a copy of the visa and relevant approvals.",
      ],
    },
    warning: {
      bn: "ভিসার মেয়াদ ও ফেরার শর্ত না বুঝে ভ্রমণ করবেন না। আপনার ক্ষেত্রে প্রযোজ্য নিয়ম সরকারি কর্তৃপক্ষের কাছে নিশ্চিত করুন।",
      en: "Do not travel without understanding the visa validity and return conditions. Confirm the applicable rules with the authorities.",
    },
  },
  {
    icon: "🚪",
    title: {
      bn: "Final Exit বা স্থায়ীভাবে দেশে ফেরা",
      en: "Final Exit or Permanent Departure",
    },
    intro: {
      bn: "সৌদি আরব থেকে স্থায়ীভাবে চলে যাওয়ার আগে ভিসা, চাকরি, পাওনা ও ভ্রমণসংক্রান্ত শর্ত যাচাই করুন।",
      en: "Before permanently leaving Saudi Arabia, check exit requirements, employment matters and outstanding dues.",
    },
    steps: {
      bn: [
        "Final Exit-এর বর্তমান যোগ্যতা ও শর্ত সরকারি সিস্টেমে যাচাই করুন।",
        "বকেয়া বেতন, চূড়ান্ত পাওনা ও চাকরি শেষ করার নথি সংগ্রহ করুন।",
        "ইকামা, পাসপোর্ট ও ভ্রমণের কাগজপত্রের তথ্য মিলিয়ে নিন।",
        "কোনো মামলা, জরিমানা বা প্রশাসনিক বাধা আছে কি না, প্রযোজ্য সরকারি চ্যানেলে জেনে নিন।",
        "Final Exit ইস্যু হলে মেয়াদ ও দেশ ছাড়ার সময়সীমা নিশ্চিত করে ভ্রমণের ব্যবস্থা করুন।",
      ],
      en: [
        "Check current Final Exit eligibility and conditions in the official system.",
        "Collect unpaid salary, final settlement details and employment documents.",
        "Verify the details on your Iqama, passport and travel documents.",
        "Check through official channels whether any case, fine or administrative restriction applies.",
        "Once issued, confirm the exit validity and departure deadline before arranging travel.",
      ],
    },
    warning: {
      bn: "Final Exit-এর পর ফিরে আসা বা নতুন ভিসা পাওয়ার নিয়ম আপনার পরিস্থিতি ও প্রযোজ্য আইন অনুযায়ী নির্ধারিত হতে পারে।",
      en: "Return and future visa eligibility after Final Exit may depend on your circumstances and applicable rules.",
    },
  },
  {
    icon: "⚠️",
    title: {
      bn: "হুরুব বা অনুপস্থিতির রিপোর্ট",
      en: "Absence-from-Work Report (Huroob)",
    },
    intro: {
      bn: "কাজে অনুপস্থিতির রিপোর্ট বা সংশ্লিষ্ট স্ট্যাটাস দেখা গেলে দ্রুত সরকারি নির্দেশনা নিন।",
      en: "If an absence-from-work report or related status appears, seek official guidance promptly.",
    },
    steps: {
      bn: [
        "সরকারি সিস্টেমে আপনার বর্তমান স্ট্যাটাস যাচাই করুন।",
        "রিপোর্টের তারিখ, নিয়োগকর্তার তথ্য এবং সংশ্লিষ্ট নোটিশ সংরক্ষণ করুন।",
        "আপনার অনুপস্থিতি বা বিরোধের পক্ষে প্রাসঙ্গিক নথি সংগ্রহ করুন।",
        "সৌদি শ্রম কর্তৃপক্ষ বা প্রযোজ্য সরকারি সেবা চ্যানেলে রিপোর্টের কারণ ও প্রতিকার জানুন।",
        "প্রয়োজনে বাংলাদেশ দূতাবাস বা অনুমোদিত আইনি সহায়তার সঙ্গে যোগাযোগ করুন।",
      ],
      en: [
        "Check your current status through the official system.",
        "Keep the report date, employer details and relevant notices.",
        "Collect documents relevant to your absence or dispute.",
        "Ask the Saudi labour authority or relevant official service about the report and available remedies.",
        "If needed, contact the Bangladesh Embassy or authorised legal assistance.",
      ],
    },
    warning: {
      bn: "এ ধরনের রিপোর্টের পরিণতি ও সমাধানের সুযোগ পরিস্থিতি এবং কার্যকর নিয়ম অনুযায়ী ভিন্ন হতে পারে। দ্রুত যাচাই করুন।",
      en: "Consequences and available remedies depend on the circumstances and current rules. Verify promptly.",
    },
  },
  {
    icon: "📄",
    title: {
      bn: "ভিসা প্রত্যাখ্যান বা স্ট্যাটাস যাচাই",
      en: "Visa Rejection or Status Check",
    },
    intro: {
      bn: "আবেদন প্রত্যাখ্যান হলে কারণ ও পরবর্তী পদক্ষেপ সম্পর্কে সরকারি উৎস থেকে তথ্য নিন।",
      en: "If your application is rejected, use official sources to understand the reason and possible next steps.",
    },
    steps: {
      bn: [
        "আবেদনের নম্বর, প্রত্যাখ্যানের নোটিশ ও সংশ্লিষ্ট তারিখ সংরক্ষণ করুন।",
        "প্রত্যাখ্যানের কারণ উল্লেখ থাকলে তা মনোযোগ দিয়ে পড়ুন।",
        "ভুল তথ্য বা অনুপস্থিত নথির কারণে হলে সংশোধনের অনুমোদিত পদ্ধতি জেনে নিন।",
        "পুনরায় আবেদন বা আপিলের সুযোগ আছে কি না সরকারি কর্তৃপক্ষের কাছে নিশ্চিত করুন।",
        "ভবিষ্যৎ আবেদনে সব তথ্য সত্য ও নথির সঙ্গে সামঞ্জস্যপূর্ণ দিন।",
      ],
      en: [
        "Keep your application number, rejection notice and relevant dates.",
        "Carefully read any stated reason for rejection.",
        "If information or documents were missing, ask how to correct them through authorised procedures.",
        "Confirm with the relevant authority whether reapplication or appeal is possible.",
        "Provide truthful information consistent with your supporting documents in future applications.",
      ],
    },
    warning: {
      bn: "প্রত্যাখ্যানের কারণ না জেনে বারবার আবেদন বা ভুল তথ্য দিয়ে আবেদন করবেন না।",
      en: "Do not repeatedly reapply or submit incorrect information without understanding the rejection.",
    },
  },
  {
    icon: "🆘",
    title: {
      bn: "জরুরি ইমিগ্রেশন সমস্যা বা দেশে ফিরতে হবে",
      en: "Emergency Immigration Problem or Urgent Return",
    },
    intro: {
      bn: "পাসপোর্ট হারানো, আটক হওয়ার আশঙ্কা বা জরুরি দেশে ফেরার পরিস্থিতিতে নিরাপদ ও সরকারি সহায়তা নিন।",
      en: "If your passport is lost, detention is a concern or you need to return urgently, seek safe and official assistance.",
    },
    steps: {
      bn: [
        "তাৎক্ষণিক বিপদ থাকলে নিরাপদ স্থানে যান এবং স্থানীয় জরুরি সেবার সঙ্গে যোগাযোগ করুন।",
        "পাসপোর্ট, ভিসা বা ইকামার কপি এবং নিজের পরিচয়-তথ্য প্রস্তুত রাখুন।",
        "সংশ্লিষ্ট সরকারি ইমিগ্রেশন কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।",
        "প্রয়োজনে বাংলাদেশ দূতাবাস বা কনস্যুলেটকে পরিস্থিতি জানান।",
        "জরুরি ভ্রমণ নথি বা অন্য সমাধানের যোগ্যতা ও নিয়ম লিখিতভাবে নিশ্চিত করুন।",
      ],
      en: [
        "If you face immediate danger, move to safety and contact local emergency services.",
        "Prepare copies of your passport, visa or Iqama and your identity details.",
        "Contact the relevant government immigration authority.",
        "If necessary, explain your circumstances to the Bangladesh embassy or consulate.",
        "Confirm eligibility and procedures for emergency travel documents or other remedies in writing.",
      ],
    },
    warning: {
      bn: "কোনো দালালকে অবৈধভাবে ভিসা ঠিক করা বা মামলা মুছে দেওয়ার প্রতিশ্রুতিতে টাকা দেবেন না।",
      en: "Do not pay agents who promise illegal visa fixes or removal of cases.",
    },
  },
];

export default function VisaServicePage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [openGuide, setOpenGuide] = useState<number | null>(0);

const [countrySearch, setCountrySearch] = useState("");
const [selectedCountry, setSelectedCountry] = useState<VisaCountry | null>(null);
const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);

const countrySuggestions = countrySearch.trim().length >= 2
  ? visaCountries
      .filter((country) => {
        const query = countrySearch.trim().toLocaleLowerCase();

        return (
          country.en.toLocaleLowerCase().includes(query) ||
          country.bn.toLocaleLowerCase().includes(query)
        );
      })
      .slice(0, 10)
  : [];

const selectedVisaSources = selectedCountry
  ? officialVisaSources[selectedCountry.en] ?? []
  : [];

  const text = {
    bn: {
      back: "← সার্ভিস পেজে ফিরে যান",
      label: "ভিসা ও ইকামা সহায়তা",
      title: "ভিসা ও ইকামা বিষয়ে করণীয়",
      description:
        "ভিসার মেয়াদ, ইকামা নবায়ন, চাকরি পরিবর্তন, Exit/Re-entry ও ইমিগ্রেশন সমস্যা সম্পর্কে নির্দেশনা দেখুন।",
      officialTitle: "সরকারি সেবা ও তথ্য",
      absher: "Absher",
      qiwa: "Qiwa প্ল্যাটফর্ম",
      hr: "মানবসম্পদ মন্ত্রণালয়",
      jawazat: "সৌদি পাসপোর্ট অধিদপ্তর",
      probashi: "প্রবাসী কল্যাণ মন্ত্রণালয়",
      warningTitle: "গুরুত্বপূর্ণ সতর্কতা",
      warning:
        "এই পেজটি সাধারণ নির্দেশনার জন্য। ভিসা, ইকামা ও শ্রমসংক্রান্ত নিয়ম পরিবর্তিত হতে পারে এবং ব্যক্তির অবস্থা অনুযায়ী ভিন্ন হয়। সর্বশেষ নিয়ম সরকারি উৎস থেকে যাচাই করুন।",
      steps: "করণীয় ধাপ",
      note: "সতর্কতা",
      collapse: "নির্দেশনা বন্ধ করুন",
      footer:
        "নিজের ভিসা ও ইকামার তথ্য নিরাপদে রাখুন। জরুরি অবস্থায় সরকারি কর্তৃপক্ষের সাহায্য নিন।",
    },
    en: {
      back: "← Back to Services",
      label: "Visa and Iqama Assistance",
      title: "Visa and Iqama Guidance",
      description:
        "Find guidance on visa expiry, Iqama renewal, job transfers, Exit/Re-entry and immigration issues.",
      officialTitle: "Official Services and Information",
      absher: "Absher",
      qiwa: "Qiwa Platform",
      hr: "Ministry of Human Resources",
      jawazat: "Saudi Passport Directorate",
      probashi: "Ministry of Expatriates' Welfare",
      warningTitle: "Important Notice",
      warning:
        "This page provides general guidance. Visa, Iqama and labour rules can change and vary by individual circumstances. Verify current requirements through official sources.",
      steps: "Steps to Follow",
      note: "Important Note",
      collapse: "Hide instructions",
      footer:
        "Keep your visa and Iqama information secure. Contact official authorities when needed.",
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
      ? "দেশের নাম বাংলা বা ইংরেজিতে অন্তত ২টি অক্ষর লিখে আপনার দেশ নির্বাচন করুন।"
      : "Type at least two letters of a country name in English or Bangla and select your country."}
  </p>

  <div className="relative mt-4">
    <label
      htmlFor="visa-country-search"
      className="mb-2 block text-sm font-semibold text-slate-700"
    >
      {language === "bn" ? "দেশ নির্বাচন করুন" : "Select a country"}
    </label>

    <input
      id="visa-country-search"
      type="text"
      autoComplete="off"
      value={countrySearch}
      placeholder={
        language === "bn"
          ? "দেশের নাম লিখুন..."
          : "Type a country name..."
      }
      onChange={(event) => {
        setCountrySearch(event.target.value);
        setSelectedCountry(null);
        setShowCountrySuggestions(true);
      }}
      onFocus={() => setShowCountrySuggestions(true)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setShowCountrySuggestions(false);
        }
      }}
      className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    />

    {showCountrySuggestions &&
      !selectedCountry &&
      countrySearch.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          {countrySuggestions.length > 0 ? (
            countrySuggestions.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  setSelectedCountry(country);
                  setCountrySearch(
                    language === "bn" ? country.bn : country.en
                  );
                  setShowCountrySuggestions(false);
                }}
                className="block w-full rounded-lg px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                <span className="font-semibold">
                  {country.bn}
                </span>
                <span className="ml-2 text-slate-500">
                  {country.en}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-slate-500">
              {language === "bn"
                ? "কোনো মিল পাওয়া যায়নি। অন্য বানানে চেষ্টা করুন।"
                : "No matching country found. Try another spelling."}
            </p>
          )}
        </div>
      )}
  </div>

  {selectedCountry && (
    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-700">
            {language === "bn" ? "নির্বাচিত দেশ" : "Selected country"}
          </p>
          <p className="mt-1 font-bold text-emerald-900">
            {language === "bn"
              ? selectedCountry.bn
              : selectedCountry.en}
          </p>
          <p className="text-sm text-emerald-800">
            {language === "bn"
              ? selectedCountry.en
              : selectedCountry.bn}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCountry(null);
            setCountrySearch("");
            setShowCountrySuggestions(true);
          }}
          className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          {language === "bn" ? "দেশ পরিবর্তন" : "Change country"}
        </button>
      </div>
    </div>
  )}

  {selectedCountry && (
    <div className="mt-5">
      <h3 className="font-bold text-slate-900">
        {language === "bn"
          ? `${selectedCountry.bn} — সরকারি ভিসা ও ইমিগ্রেশন সেবা`
          : `${selectedCountry.en} — Official Visa and Immigration Services`}
      </h3>

      {selectedVisaSources.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedVisaSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
            >
              <span className="block font-bold text-emerald-800">
                🌐 {source.name}
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {source.description[language]}
              </span>
              <span className="mt-3 block break-all text-xs text-emerald-700">
                {source.url}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-900">
            ⚠️ {language === "bn"
              ? "যাচাইকৃত সরকারি লিংক এখনো যোগ করা হয়নি"
              : "Verified official links have not been added yet"}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            {language === "bn"
              ? "এই দেশের ভিসা বা ইমিগ্রেশন লিংক এখনো এই পেজে যাচাই করা হয়নি। সঠিক তথ্যের জন্য সংশ্লিষ্ট দেশের সরকারি ওয়েবসাইট বা দূতাবাসের ওয়েবসাইট খুঁজে নিশ্চিত করুন।"
              : "Visa or immigration links for this country have not yet been verified for this page. Check the relevant government's official website or embassy website before using a service."}
          </p>
        </div>
      )}
    </div>
  )}

  {!selectedCountry && (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <a
        href="https://www.absher.sa/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        🪪
        <span className="mt-2 block text-sm">{text.absher}</span>
      </a>

      <a
        href="https://www.qiwa.sa/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        💼
        <span className="mt-2 block text-sm">{text.qiwa}</span>
      </a>

      <a
        href="https://www.hrsd.gov.sa/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        ⚖️
        <span className="mt-2 block text-sm">{text.hr}</span>
      </a>

      <a
        href="https://www.moi.gov.sa/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        🏛️
        <span className="mt-2 block text-sm">{text.jawazat}</span>
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
    </div>
  )}
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
                    onClick={() => setOpenGuide(isOpen ? null : index)}
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