
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Country = {
  bn: string;
  en: string;
};

type Source = {
  title: string;
  description: string;
  url: string;
  category: string;
};

const countryRows = `
আফগানিস্তান|Afghanistan
আলবেনিয়া|Albania
আলজেরিয়া|Algeria
অ্যান্ডোরা|Andorra
অ্যাঙ্গোলা|Angola
অ্যান্টিগুয়া ও বারবুডা|Antigua and Barbuda
আর্জেন্টিনা|Argentina
আর্মেনিয়া|Armenia
অস্ট্রেলিয়া|Australia
অস্ট্রিয়া|Austria
আজারবাইজান|Azerbaijan
বাহামাস|Bahamas
বাহরাইন|Bahrain
বাংলাদেশ|Bangladesh
বার্বাডোস|Barbados
বেলারুশ|Belarus
বেলজিয়াম|Belgium
বেলিজ|Belize
বেনিন|Benin
ভুটান|Bhutan
বলিভিয়া|Bolivia
বসনিয়া ও হার্জেগোভিনা|Bosnia and Herzegovina
বতসোয়ানা|Botswana
ব্রাজিল|Brazil
ব্রুনাই|Brunei
বুলগেরিয়া|Bulgaria
বুরকিনা ফাসো|Burkina Faso
বুরুন্ডি|Burundi
কাবো ভার্দে|Cabo Verde
কম্বোডিয়া|Cambodia
ক্যামেরুন|Cameroon
কানাডা|Canada
মধ্য আফ্রিকান প্রজাতন্ত্র|Central African Republic
চাদ|Chad
চিলি|Chile
চীন|China
কলম্বিয়া|Colombia
কমোরোস|Comoros
কঙ্গো প্রজাতন্ত্র|Congo
কোস্টারিকা|Costa Rica
কোত দিভোয়ার|Côte d’Ivoire
ক্রোয়েশিয়া|Croatia
কিউবা|Cuba
সাইপ্রাস|Cyprus
চেকিয়া|Czechia
উত্তর কোরিয়া|North Korea
গণতান্ত্রিক কঙ্গো প্রজাতন্ত্র|Democratic Republic of the Congo
ডেনমার্ক|Denmark
জিবুতি|Djibouti
ডোমিনিকা|Dominica
ডোমিনিকান প্রজাতন্ত্র|Dominican Republic
ইকুয়েডর|Ecuador
মিশর|Egypt
এল সালভাদর|El Salvador
নিরক্ষীয় গিনি|Equatorial Guinea
ইরিত্রিয়া|Eritrea
এস্তোনিয়া|Estonia
এসওয়াতিনি|Eswatini
ইথিওপিয়া|Ethiopia
ফিজি|Fiji
ফিনল্যান্ড|Finland
ফ্রান্স|France
গ্যাবন|Gabon
গাম্বিয়া|Gambia
জর্জিয়া|Georgia
জার্মানি|Germany
ঘানা|Ghana
গ্রিস|Greece
গ্রেনাডা|Grenada
গুয়াতেমালা|Guatemala
গিনি|Guinea
গিনি-বিসাউ|Guinea-Bissau
গায়ানা|Guyana
হাইতি|Haiti
হন্ডুরাস|Honduras
হাঙ্গেরি|Hungary
আইসল্যান্ড|Iceland
ভারত|India
ইন্দোনেশিয়া|Indonesia
ইরান|Iran
ইরাক|Iraq
আয়ারল্যান্ড|Ireland
ইতালি|Italy
জ্যামাইকা|Jamaica
জাপান|Japan
জর্ডান|Jordan
কাজাখস্তান|Kazakhstan
কেনিয়া|Kenya
কিরিবাতি|Kiribati
কুয়েত|Kuwait
কিরগিজস্তান|Kyrgyzstan
লাওস|Laos
লাটভিয়া|Latvia
লেবানন|Lebanon
লেসোথো|Lesotho
লাইবেরিয়া|Liberia
লিবিয়া|Libya
লিশটেনস্টাইন|Liechtenstein
লিথুয়ানিয়া|Lithuania
লুক্সেমবার্গ|Luxembourg
মাদাগাস্কার|Madagascar
মালাউই|Malawi
মালয়েশিয়া|Malaysia
মালদ্বীপ|Maldives
মালি|Mali
মাল্টা|Malta
মার্শাল দ্বীপপুঞ্জ|Marshall Islands
মৌরিতানিয়া|Mauritania
মরিশাস|Mauritius
মেক্সিকো|Mexico
মাইক্রোনেশিয়া|Micronesia
মোনাকো|Monaco
মঙ্গোলিয়া|Mongolia
মন্টেনেগ্রো|Montenegro
মরক্কো|Morocco
মোজাম্বিক|Mozambique
মিয়ানমার|Myanmar
নামিবিয়া|Namibia
নাউরু|Nauru
নেপাল|Nepal
নেদারল্যান্ডস|Netherlands
নিউজিল্যান্ড|New Zealand
নিকারাগুয়া|Nicaragua
নাইজার|Niger
নাইজেরিয়া|Nigeria
উত্তর মেসিডোনিয়া|North Macedonia
নরওয়ে|Norway
ওমান|Oman
পাকিস্তান|Pakistan
পালাউ|Palau
ফিলিস্তিন|Palestine
পানামা|Panama
পাপুয়া নিউ গিনি|Papua New Guinea
প্যারাগুয়ে|Paraguay
পেরু|Peru
ফিলিপাইন|Philippines
পোল্যান্ড|Poland
পর্তুগাল|Portugal
কাতার|Qatar
দক্ষিণ কোরিয়া|South Korea
মলদোভা|Moldova
রোমানিয়া|Romania
রাশিয়া|Russia
রুয়ান্ডা|Rwanda
সেন্ট কিটস ও নেভিস|Saint Kitts and Nevis
সেন্ট লুসিয়া|Saint Lucia
সেন্ট ভিনসেন্ট ও গ্রেনাডিনস|Saint Vincent and the Grenadines
সামোয়া|Samoa
সান মারিনো|San Marino
সাও টোমে ও প্রিন্সিপে|Sao Tome and Principe
সৌদি আরব|Saudi Arabia
সেনেগাল|Senegal
সার্বিয়া|Serbia
সেশেলস|Seychelles
সিয়েরা লিওন|Sierra Leone
সিঙ্গাপুর|Singapore
স্লোভাকিয়া|Slovakia
স্লোভেনিয়া|Slovenia
সলোমন দ্বীপপুঞ্জ|Solomon Islands
সোমালিয়া|Somalia
দক্ষিণ আফ্রিকা|South Africa
দক্ষিণ সুদান|South Sudan
স্পেন|Spain
শ্রীলঙ্কা|Sri Lanka
সুদান|Sudan
সুরিনাম|Suriname
সুইডেন|Sweden
সুইজারল্যান্ড|Switzerland
সিরিয়া|Syria
তাজিকিস্তান|Tajikistan
থাইল্যান্ড|Thailand
তিমুর-লেস্তে|Timor-Leste
টোগো|Togo
টোঙ্গা|Tonga
ত্রিনিদাদ ও টোবাগো|Trinidad and Tobago
তিউনিসিয়া|Tunisia
তুরস্ক|Türkiye
তুর্কমেনিস্তান|Turkmenistan
টুভালু|Tuvalu
উগান্ডা|Uganda
ইউক্রেন|Ukraine
সংযুক্ত আরব আমিরাত|United Arab Emirates
যুক্তরাজ্য|United Kingdom
তানজানিয়া|Tanzania
যুক্তরাষ্ট্র|United States
উরুগুয়ে|Uruguay
উজবেকিস্তান|Uzbekistan
ভানুয়াতু|Vanuatu
ভ্যাটিকান সিটি|Vatican City
ভেনেজুয়েলা|Venezuela
ভিয়েতনাম|Vietnam
ইয়েমেন|Yemen
জাম্বিয়া|Zambia
জিম্বাবুয়ে|Zimbabwe
`.trim();

const countries: Country[] = countryRows.split("\n").map((row) => {
  const [bn, en] = row.split("|");
  return { bn, en };
});

const bangladeshSources: Source[] = [
  {
    title: "প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়",
    description: "প্রবাসী কর্মীদের কল্যাণ, সরকারি ঘোষণা ও বৈদেশিক কর্মসংস্থান-সংক্রান্ত তথ্য।",
    url: "https://probashi.gov.bd/",
    category: "welfare",
  },
  {
    title: "বাংলাদেশ পররাষ্ট্র মন্ত্রণালয়",
    description: "বাংলাদেশের দূতাবাস, কনস্যুলার সেবা ও পররাষ্ট্র মন্ত্রণালয়ের সরকারি তথ্য।",
    url: "https://mofa.gov.bd/",
    category: "embassy",
  },
  {
    title: "বাংলাদেশ ই-পাসপোর্ট",
    description: "পাসপোর্ট আবেদন, নির্দেশনা ও সরকারি নোটিশের তথ্য।",
    url: "https://www.epassport.gov.bd/landing/notices",
    category: "passport",
  },
  {
    title: "বাংলাদেশের অভিবাসন ও পাসপোর্ট অধিদপ্তর",
    description: "পাসপোর্ট ও ইমিগ্রেশন-সম্পর্কিত সরকারি তথ্য ও বিজ্ঞপ্তি।",
    url: "https://dip.gov.bd/",
    category: "passport",
  },
];

const countrySources: Record<string, Source[]> = {
  "Saudi Arabia": [
    {
      title: "Absher",
      description: "সৌদি আরবের সরকারি ইলেকট্রনিক সেবা।",
      url: "https://www.absher.sa/",
      category: "visa",
    },
    {
      title: "Qiwa",
      description: "কর্মসংস্থান ও শ্রম-সম্পর্কিত ডিজিটাল সেবা।",
      url: "https://www.qiwa.sa/",
      category: "labor",
    },
    {
      title: "সৌদি মানবসম্পদ ও সামাজিক উন্নয়ন মন্ত্রণালয়",
      description: "শ্রম আইন, কর্মসংস্থান ও শ্রমিকদের অধিকার-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.hrsd.gov.sa/",
      category: "labor",
    },
    {
      title: "সৌদি স্বরাষ্ট্র মন্ত্রণালয়",
      description: "ইমিগ্রেশন ও অভ্যন্তরীণ বিষয়ক সরকারি তথ্য।",
      url: "https://www.moi.gov.sa/",
      category: "visa",
    },
  ],
  "United Arab Emirates": [
    {
      title: "UAE Government Portal",
      description: "আমিরাতের সরকারি সেবা ও ঘোষণা।",
      url: "https://u.ae/",
      category: "general",
    },
    {
      title: "ICP",
      description: "পরিচয়পত্র, বসবাস ও প্রবেশ-সংক্রান্ত সরকারি সেবা।",
      url: "https://icp.gov.ae/",
      category: "visa",
    },
    {
      title: "MOHRE",
      description: "কর্মসংস্থান ও শ্রম-সংক্রান্ত সরকারি সেবা।",
      url: "https://www.mohre.gov.ae/",
      category: "labor",
    },
  ],
  Qatar: [
    {
      title: "Hukoomi",
      description: "কাতারের সরকারি সেবা ও তথ্য।",
      url: "https://hukoomi.gov.qa/",
      category: "general",
    },
    {
      title: "কাতার শ্রম মন্ত্রণালয়",
      description: "শ্রম ও কর্মসংস্থান-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.mol.gov.qa/",
      category: "labor",
    },
  ],
  Kuwait: [
    {
      title: "Kuwait Government Online",
      description: "কুয়েতের সরকারি সেবা ও ঘোষণা।",
      url: "https://e.gov.kw/",
      category: "general",
    },
    {
      title: "Public Authority for Manpower",
      description: "শ্রম ও কর্মসংস্থান-সংক্রান্ত সরকারি সেবা।",
      url: "https://www.manpower.gov.kw/",
      category: "labor",
    },
  ],
  Oman: [
    {
      title: "Royal Oman Police",
      description: "ভিসা, বসবাস ও সংশ্লিষ্ট সরকারি সেবা।",
      url: "https://www.rop.gov.om/",
      category: "visa",
    },
    {
      title: "ওমান শ্রম মন্ত্রণালয়",
      description: "শ্রম ও কর্মসংস্থান-সংক্রান্ত তথ্য।",
      url: "https://www.mol.gov.om/",
      category: "labor",
    },
  ],
  Bahrain: [
    {
      title: "Bahrain National Portal",
      description: "বাহরাইনের সরকারি সেবা ও ঘোষণা।",
      url: "https://www.bahrain.bh/",
      category: "general",
    },
    {
      title: "Labour Market Regulatory Authority",
      description: "কর্মসংস্থান ও শ্রমবাজার-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.lmra.gov.bh/",
      category: "labor",
    },
  ],
  Malaysia: [
    {
      title: "Malaysia Immigration Department",
      description: "ইমিগ্রেশন ও পাস-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.imi.gov.my/",
      category: "visa",
    },
    {
      title: "Malaysia Ministry of Human Resources",
      description: "শ্রম ও কর্মসংস্থান-সংক্রান্ত তথ্য।",
      url: "https://www.mohr.gov.my/",
      category: "labor",
    },
  ],
  Singapore: [
    {
      title: "Ministry of Manpower",
      description: "বিদেশি কর্মী, ওয়ার্ক পাস ও শ্রম-সংক্রান্ত তথ্য।",
      url: "https://www.mom.gov.sg/",
      category: "labor",
    },
    {
      title: "Immigration & Checkpoints Authority",
      description: "ইমিগ্রেশন ও পাস-সংক্রান্ত সরকারি সেবা।",
      url: "https://www.ica.gov.sg/",
      category: "visa",
    },
  ],
  "United Kingdom": [
    {
      title: "GOV.UK",
      description: "ভিসা, ইমিগ্রেশন, কাজ ও সরকারি নির্দেশনা।",
      url: "https://www.gov.uk/",
      category: "general",
    },
  ],
  "United States": [
    {
      title: "USA.gov",
      description: "যুক্তরাষ্ট্রের সরকারি তথ্য ও সেবা।",
      url: "https://www.usa.gov/",
      category: "general",
    },
    {
      title: "USCIS",
      description: "ইমিগ্রেশন ও অভিবাসন-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.uscis.gov/",
      category: "visa",
    },
  ],
  Canada: [
    {
      title: "Government of Canada",
      description: "কানাডার সরকারি সেবা ও নির্দেশনা।",
      url: "https://www.canada.ca/",
      category: "general",
    },
  ],
  Australia: [
    {
      title: "Department of Home Affairs",
      description: "ভিসা, ইমিগ্রেশন ও সীমান্ত-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.homeaffairs.gov.au/",
      category: "visa",
    },
  ],
  Japan: [
    {
      title: "Immigration Services Agency of Japan",
      description: "ইমিগ্রেশন ও বসবাস-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.moj.go.jp/isa/",
      category: "visa",
    },
  ],
  "South Korea": [
    {
      title: "Hi Korea",
      description: "বিদেশিদের ইমিগ্রেশন ও বসবাস-সংক্রান্ত সেবা।",
      url: "https://www.hikorea.go.kr/",
      category: "visa",
    },
  ],
  India: [
    {
      title: "ভারতীয় পররাষ্ট্র মন্ত্রণালয়",
      description: "ভারতের সরকারি পররাষ্ট্র ও কনস্যুলার তথ্য।",
      url: "https://www.mea.gov.in/",
      category: "embassy",
    },
  ],
  Pakistan: [
    {
      title: "Pakistan Ministry of Foreign Affairs",
      description: "পাকিস্তানের সরকারি পররাষ্ট্র ও কনস্যুলার তথ্য।",
      url: "https://mofa.gov.pk/",
      category: "embassy",
    },
  ],
  Nepal: [
    {
      title: "Nepal Department of Immigration",
      description: "নেপালের ইমিগ্রেশন-সংক্রান্ত সরকারি তথ্য।",
      url: "https://www.immigration.gov.np/",
      category: "visa",
    },
  ],

  Germany: [
{
title: "German Federal Office for Migration and Refugees",
description: "জার্মানিতে অভিবাসন ও শরণার্থীসংক্রান্ত সরকারি তথ্য।",
url: "https://www.bamf.de/",
category: "general",
},
],
France: [
{
title: "French Ministry of the Interior",
description: "ফ্রান্সের অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.interieur.gouv.fr/",
category: "visa",
},
],
Ireland: [
{
title: "Irish Immigration Service",
description: "আয়ারল্যান্ডের অভিবাসন ও ইমিগ্রেশনসংক্রান্ত সরকারি তথ্য।",
url: "https://www.irishimmigration.ie/",
category: "visa",
},
],
Netherlands: [
{
title: "Dutch Immigration and Naturalisation Service",
description: "নেদারল্যান্ডসে ভিসা ও বসবাসের সরকারি তথ্য।",
url: "https://ind.nl/en",
category: "visa",
},
],
"New Zealand": [
{
title: "Immigration New Zealand",
description: "নিউজিল্যান্ডের ভিসা ও অভিবাসনসংক্রান্ত সরকারি তথ্য।",
url: "https://www.immigration.govt.nz/",
category: "visa",
},
],
Norway: [
{
title: "Norwegian Directorate of Immigration",
description: "নরওয়ের অভিবাসন ও বসবাসের সরকারি তথ্য।",
url: "https://www.udi.no/en/",
category: "visa",
},
],
"South Africa": [
{
title: "South African Department of Home Affairs",
description: "দক্ষিণ আফ্রিকার অভিবাসন ও পরিচয়পত্রসংক্রান্ত সরকারি তথ্য।",
url: "https://www.dha.gov.za/",
category: "general",
},
],
Spain: [
{
title: "Spanish Ministry of Inclusion, Social Security and Migration",
description: "স্পেনে অভিবাসন ও সামাজিক সুরক্ষাসংক্রান্ত সরকারি তথ্য।",
url: "https://www.inclusion.gob.es/",
category: "general",
},
],
Sweden: [
{
title: "Swedish Migration Agency",
description: "সুইডেনের ভিসা, কাজ ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.migrationsverket.se/English.html",
category: "visa",
},
],
Switzerland: [
{
title: "Swiss State Secretariat for Migration",
description: "সুইজারল্যান্ডের অভিবাসনসংক্রান্ত সরকারি তথ্য।",
url: "https://www.sem.admin.ch/sem/en/home.html",
category: "general",
},
],
Belgium: [
{
title: "Belgian Immigration Office",
description: "বেলজিয়ামের ভিসা ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://dofi.ibz.be/en",
category: "visa",
},
],
Denmark: [
{
title: "Danish Immigration Service",
description: "ডেনমার্কের অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.nyidanmark.dk/en-GB",
category: "visa",
},
],
Finland: [
{
title: "Finnish Immigration Service",
description: "ফিনল্যান্ডের অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://migri.fi/en/home",
category: "visa",
},
],
Austria: [
{
title: "Austrian Migration and Residence",
description: "অস্ট্রিয়ায় অভিবাসন ও বসবাসের সরকারি তথ্য।",
url: "https://www.migration.gv.at/en/",
category: "visa",
},
],
Greece: [
{
title: "Greek Ministry of Migration and Asylum",
description: "গ্রিসের অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://migration.gov.gr/en/",
category: "visa",
},
],
Poland: [
{
title: "Polish Office for Foreigners",
description: "পোল্যান্ডে বিদেশিদের বসবাস ও অভিবাসনসংক্রান্ত তথ্য।",
url: "https://www.gov.pl/web/udsc-en",
category: "visa",
},
],
Portugal: [
{
title: "Portuguese Government",
description: "পর্তুগালের সরকারি সেবা ও অভিবাসনসংক্রান্ত তথ্য খুঁজুন।",
url: "https://www.gov.pt/",
category: "general",
},
],
Luxembourg: [
{
title: "Luxembourg Government — Immigration",
description: "লুক্সেমবার্গের ভিসা ও অভিবাসনসংক্রান্ত সরকারি তথ্য।",
url: "https://maint.gouvernement.lu/en/visa-immigration.html",
category: "visa",
},
],
Cyprus: [
{
title: "Cyprus Civil Registry and Migration Department",
description: "সাইপ্রাসে অভিবাসন ও বসবাসের সরকারি তথ্য।",
url: "https://www.moi.gov.cy/",
category: "visa",
},
],
Malta: [
{
title: "Identità Malta",
description: "মাল্টার পরিচয়, বসবাস ও অভিবাসনসংক্রান্ত সরকারি সেবা।",
url: "https://identita.gov.mt/",
category: "general",
},
],
Romania: [
{
title: "Romanian General Inspectorate for Immigration",
description: "রোমানিয়ায় বিদেশিদের ভিসা ও বসবাসসংক্রান্ত তথ্য।",
url: "https://igi.mai.gov.ro/en/",
category: "visa",
},
],
Bulgaria: [
{
title: "Bulgarian Ministry of Interior",
description: "বুলগেরিয়ার অভিবাসন ও বিদেশিদের অবস্থানসংক্রান্ত সরকারি তথ্য।",
url: "https://www.mvr.bg/en",
category: "general",
},
],
Croatia: [
{
title: "Croatian Ministry of the Interior",
description: "ক্রোয়েশিয়ায় বিদেশিদের বসবাস ও কাজের সরকারি তথ্য।",
url: "https://mup.gov.hr/",
category: "general",
},
],
Estonia: [
{
title: "Estonian Police and Border Guard Board",
description: "এস্তোনিয়ার অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.politsei.ee/en",
category: "visa",
},
],
Latvia: [
{
title: "Latvian Office of Citizenship and Migration Affairs",
description: "লাটভিয়ায় অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.pmlp.gov.lv/en",
category: "visa",
},
],
Lithuania: [
{
title: "Lithuanian Migration Department",
description: "লিথুয়ানিয়ায় অভিবাসন ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://www.migracija.lt/",
category: "visa",
},
],
Hungary: [
{
title: "Hungarian National Directorate-General for Aliens Policing",
description: "হাঙ্গেরিতে বিদেশিদের অবস্থান ও অভিবাসনসংক্রান্ত তথ্য।",
url: "https://oif.gov.hu/",
category: "visa",
},
],
Slovenia: [
{
title: "Slovenian Government",
description: "স্লোভেনিয়ার সরকারি সেবা ও অভিবাসনসংক্রান্ত তথ্য খুঁজুন।",
url: "https://www.gov.si/en/",
category: "general",
},
],
Slovakia: [
{
title: "Slovak Ministry of Interior",
description: "স্লোভাকিয়ায় বিদেশিদের অবস্থান ও অভিবাসনসংক্রান্ত সরকারি তথ্য।",
url: "https://www.minv.sk/?startovacia-mvsr-en=",
category: "general",
},
],

  Afghanistan: [
{
title: "Afghanistan Government Portal",
description: "আফগানিস্তানের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.af/",
category: "general",
},
],
Albania: [
{
title: "Albanian Government",
description: "আলবেনিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.kryeministria.al/",
category: "general",
},
],
Algeria: [
{
title: "Algerian Government",
description: "আলজেরিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.el-mouradia.dz/",
category: "general",
},
],
Andorra: [
{
title: "Government of Andorra",
description: "অ্যান্ডোরার সরকারি তথ্য ও সেবা।",
url: "https://www.govern.ad/",
category: "general",
},
],
Angola: [
{
title: "Government of Angola",
description: "অ্যাঙ্গোলার সরকারি তথ্য ও সেবা।",
url: "https://governo.gov.ao/",
category: "general",
},
],
"Antigua and Barbuda": [
{
title: "Government of Antigua and Barbuda",
description: "অ্যান্টিগুয়া ও বারবুডার সরকারি তথ্য ও সেবা।",
url: "https://ab.gov.ag/",
category: "general",
},
],
Argentina: [
{
title: "Argentina Government — Migration",
description: "আর্জেন্টিনার অভিবাসন ও বিদেশিদের প্রবেশসংক্রান্ত তথ্য।",
url: "https://www.argentina.gob.ar/migraciones",
category: "visa",
},
],
Armenia: [
{
title: "Government of Armenia",
description: "আর্মেনিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.gov.am/",
category: "general",
},
],
Azerbaijan: [
{
title: "State Migration Service of Azerbaijan",
description: "ভিসা, কাজের অনুমতি ও বসবাসসংক্রান্ত সরকারি তথ্য।",
url: "https://migration.gov.az/en",
category: "visa",
},
],
Bahamas: [
{
title: "Government of The Bahamas",
description: "বাহামাসের সরকারি তথ্য ও সেবা।",
url: "https://www.bahamas.gov.bs/",
category: "general",
},
],
Bangladesh: [
{
title: "Bangladesh National Portal",
description: "বাংলাদেশের সরকারি তথ্য ও সেবা।",
url: "https://bangladesh.gov.bd/",
category: "general",
},
],
Barbados: [
{
title: "Government of Barbados",
description: "বার্বাডোসের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.bb/",
category: "general",
},
],
Belarus: [
{
title: "Government of Belarus",
description: "বেলারুশের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.by/",
category: "general",
},
],
Belize: [
{
title: "Government of Belize",
description: "বেলিজের সরকারি তথ্য ও সেবা।",
url: "https://www.belize.gov.bz/",
category: "general",
},
],
Bhutan: [
{
title: "Royal Government of Bhutan",
description: "ভুটানের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.bt/",
category: "general",
},
],
Brazil: [
{
title: "Brazilian Government Portal",
description: "ব্রাজিলের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.br/",
category: "general",
},
],
Chile: [
{
title: "Government of Chile",
description: "চিলির সরকারি তথ্য ও সেবা।",
url: "https://www.gob.cl/",
category: "general",
},
],
China: [
{
title: "Chinese Government Portal",
description: "চীনের সরকারি তথ্য ও সেবা।",
url: "https://english.www.gov.cn/",
category: "general",
},
],
Colombia: [
{
title: "Government of Colombia",
description: "কলম্বিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.gov.co/",
category: "general",
},
],
Czechia: [
{
title: "Czech Government Portal",
description: "চেকিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.vlada.cz/en/",
category: "general",
},
],
Egypt: [
{
title: "Egyptian Government Portal",
description: "মিশরের সরকারি তথ্য ও সেবা।",
url: "https://www.egypt.gov.eg/",
category: "general",
},
],
Indonesia: [
{
title: "Indonesian Government Portal",
description: "ইন্দোনেশিয়ার সরকারি তথ্য ও সেবা।",
url: "https://indonesia.go.id/",
category: "general",
},
],
Jordan: [
{
title: "Jordan Government Portal",
description: "জর্ডানের সরকারি তথ্য ও সেবা।",
url: "https://portal.jordan.gov.jo/",
category: "general",
},
],
Kenya: [
{
title: "Kenya Government Portal",
description: "কেনিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.mygov.go.ke/",
category: "general",
},
],
Maldives: [
{
title: "Government of Maldives",
description: "মালদ্বীপের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.mv/",
category: "general",
},
],
Mexico: [
{
title: "Mexican Government Portal",
description: "মেক্সিকোর সরকারি তথ্য ও সেবা।",
url: "https://www.gob.mx/",
category: "general",
},
],
Nigeria: [
{
title: "Nigerian Government Portal",
description: "নাইজেরিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.gov.ng/",
category: "general",
},
],
Philippines: [
{
title: "Philippine Government Portal",
description: "ফিলিপাইনের সরকারি তথ্য ও সেবা।",
url: "https://www.gov.ph/",
category: "general",
},
],
Russia: [
{
title: "Russian Government Portal",
description: "রাশিয়ার সরকারি তথ্য ও সেবা।",
url: "https://government.ru/en/",
category: "general",
},
],
Serbia: [
{
title: "Government of Serbia",
description: "সার্বিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.srbija.gov.rs/",
category: "general",
},
],
Thailand: [
{
title: "Thai Government Portal",
description: "থাইল্যান্ডের সরকারি তথ্য ও সেবা।",
url: "https://www.thaigov.go.th/",
category: "general",
},
],
Türkiye: [
{
title: "Turkish Government Portal",
description: "তুরস্কের সরকারি তথ্য ও সেবা।",
url: "https://www.turkiye.gov.tr/",
category: "general",
},
],
Ukraine: [
{
title: "Government of Ukraine",
description: "ইউক্রেনের সরকারি তথ্য ও সেবা।",
url: "https://www.kmu.gov.ua/en",
category: "general",
},
],
Vietnam: [
{
title: "Vietnam Government Portal",
description: "ভিয়েতনামের সরকারি তথ্য ও সেবা।",
url: "https://en.baochinhphu.vn/",
category: "general",
},
],
Zambia: [
{
title: "Government of Zambia",
description: "জাম্বিয়ার সরকারি তথ্য ও সেবা।",
url: "https://www.zambia.gov.zm/",
category: "general",
},
],
Zimbabwe: [
{
title: "Government of Zimbabwe",
description: "জিম্বাবুয়ের সরকারি তথ্য ও সেবা।",
url: "https://www.zim.gov.zw/",
category: "general",
},
],

};

const categoryLabels: Record<string, { bn: string; en: string }> = {
  general: { bn: "সাধারণ সরকারি তথ্য", en: "Government information" },
  passport: { bn: "পাসপোর্ট", en: "Passport" },
  visa: { bn: "ভিসা ও ইমিগ্রেশন", en: "Visa & Immigration" },
  labor: { bn: "শ্রম ও কর্মসংস্থান", en: "Labour & Employment" },
  embassy: { bn: "দূতাবাস ও কনস্যুলার সেবা", en: "Embassy & Consular" },
  welfare: { bn: "প্রবাসী কল্যাণ", en: "Expatriate Welfare" },
};

export default function NoticesPage() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [category, setCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isBn = language === "bn";

  const suggestions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (query.length < 2) return [];

    return countries
      .filter(
        (country) =>
          country.bn.toLocaleLowerCase().includes(query) ||
          country.en.toLocaleLowerCase().includes(query),
      )
      .slice(0, 12);
  }, [search]);

  const localSources = selectedCountry
    ? countrySources[selectedCountry.en] ?? []
    : [];

  const allSources = [...localSources, ...bangladeshSources];

  const filteredSources =
    category === "all"
      ? allSources
      : allSources.filter((source) => source.category === category);

  function chooseCountry(country: Country) {
    setSelectedCountry(country);
    setSearch("");
    setShowSuggestions(false);
    setCategory("all");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
          >
            <span aria-hidden="true">←</span>
            {isBn ? "সার্ভিস পেইজে যান" : "Back to Services"}
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(isBn ? "en" : "bn")}
            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800"
          >
            {isBn ? "English" : "বাংলা"}
          </button>
        </div>

        <header className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 to-green-600 p-6 text-white shadow-lg sm:p-9">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
            📢
          </div>
          <p className="mb-2 text-sm font-semibold text-green-100">
            {isBn ? "প্রবাসীদের অভিযোগ" : "Probasider Ovijog"}
          </p>
          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            {isBn ? "নোটিশ ও আপডেট" : "Notices & Updates"}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
            {isBn
              ? "আপনার দেশের নাম লিখে নির্বাচন করুন। এরপর সংশ্লিষ্ট দেশের সরকারি উৎস ও বাংলাদেশের প্রাসঙ্গিক সরকারি লিংক দেখুন।"
              : "Search for your country to access its available official sources and relevant Bangladesh government links."}
          </p>
        </header>

        <section className="relative z-20 mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="country-search"
            className="mb-2 block text-sm font-bold text-slate-800"
          >
            🌍 {isBn ? "আপনার দেশের নাম লিখুন" : "Search for your country"}
          </label>

          <input
            id="country-search"
            type="text"
            value={
              selectedCountry
                ? isBn
                  ? selectedCountry.bn
                  : selectedCountry.en
                : search
            }
            placeholder={
              isBn
                ? "যেমন: সৌদি আরব বা Saudi Arabia"
                : "e.g. Saudi Arabia or সৌদি আরব"
            }
            autoComplete="off"
            onFocus={() => {
              if (!selectedCountry) setShowSuggestions(true);
            }}
            onChange={(event) => {
              setSelectedCountry(null);
              setSearch(event.target.value);
              setShowSuggestions(true);
              setCategory("all");
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          {showSuggestions && !selectedCountry && search.trim().length >= 2 && (
            <div className="absolute left-5 right-5 top-[108px] max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
              {suggestions.length > 0 ? (
                suggestions.map((country) => (
                  <button
                    key={country.en}
                    type="button"
                    onClick={() => chooseCountry(country)}
                    className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-green-50"
                  >
                    <span className="font-semibold text-slate-800">
                      {isBn ? country.bn : country.en}
                    </span>
                    <span className="ml-2 text-slate-500">
                      {isBn ? country.en : country.bn}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-slate-500">
                  {isBn
                    ? "এই নামে কোনো দেশ পাওয়া যায়নি। অন্য বানানে চেষ্টা করুন।"
                    : "No matching country found. Try another spelling."}
                </p>
              )}
            </div>
          )}

          {selectedCountry && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <div>
                <p className="text-xs text-green-700">
                  {isBn ? "নির্বাচিত দেশ" : "Selected country"}
                </p>
                <p className="font-bold text-green-900">
                  {isBn ? selectedCountry.bn : selectedCountry.en}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCountry(null);
                  setSearch("");
                  setCategory("all");
                  setShowSuggestions(true);
                }}
                className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
              >
                {isBn ? "দেশ পরিবর্তন" : "Change country"}
              </button>
            </div>
          )}

          {!selectedCountry && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {isBn
                ? "কমপক্ষে ২টি অক্ষর লিখুন, তারপর তালিকা থেকে একটি দেশ নির্বাচন করুন।"
                : "Type at least 2 characters, then select a country from the list."}
            </p>
          )}
        </section>

        {!selectedCountry ? (
          <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="mb-2 font-bold text-blue-950">
              {isBn ? "দেশ নির্বাচন করুন" : "Select a country"}
            </h2>
            <p className="text-sm leading-6 text-blue-900">
              {isBn
                ? "দেশ নির্বাচন করার পর নিচে সেই দেশের জন্য যুক্ত করা সরকারি উৎস এবং বাংলাদেশের সরকারি মন্ত্রণালয়ের লিংক দেখা যাবে।"
                : "After selecting a country, available official sources for that country and Bangladesh government links will appear below."}
            </p>
          </section>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                {isBn ? "বিষয় অনুযায়ী খুঁজুন" : "Browse by category"}
              </h2>

              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", bn: "সব", en: "All" },
                  { value: "passport", bn: "পাসপোর্ট", en: "Passport" },
                  { value: "visa", bn: "ভিসা ও ইমিগ্রেশন", en: "Visa" },
                  { value: "labor", bn: "শ্রম ও বেতন", en: "Labour" },
                  { value: "embassy", bn: "দূতাবাস", en: "Embassy" },
                  { value: "welfare", bn: "প্রবাসী কল্যাণ", en: "Welfare" },
                  { value: "general", bn: "সাধারণ তথ্য", en: "General" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      category === item.value
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-green-500 hover:text-green-800"
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {isBn
                    ? `${selectedCountry.bn} ও বাংলাদেশের সরকারি উৎস`
                    : `Official sources for ${selectedCountry.en} and Bangladesh`}
                </h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  {filteredSources.length} {isBn ? "টি লিংক" : "links"}
                </span>
              </div>

              {localSources.length === 0 && category === "all" && (
                <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                  <h3 className="mb-1 font-bold text-amber-950">
                    {isBn
                      ? "এই দেশের সরাসরি সরকারি লিংক এখনো যুক্ত করা হয়নি"
                      : "Country-specific official links are not added yet"}
                  </h3>
                  <p className="text-sm leading-6 text-amber-950">
                    {isBn
                      ? "নিচে বাংলাদেশের সরকারি উৎসগুলো দেওয়া আছে। নির্বাচিত দেশের জন্য যাচাই করা সরকারি নোটিশের লিংক যুক্ত না হওয়া পর্যন্ত এই বার্তাটি দেখানো হবে।"
                      : "Bangladesh government sources are listed below. This notice will remain until verified official links for the selected country are added."}
                  </p>
                </div>
              )}

              {filteredSources.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredSources.map((source) => (
                    <article
                      key={source.url}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl">
                          {source.category === "passport"
                            ? "🛂"
                            : source.category === "visa"
                              ? "🪪"
                              : source.category === "labor"
                                ? "⚖️"
                                : source.category === "embassy"
                                  ? "🏛️"
                                  : source.category === "welfare"
                                    ? "🤝"
                                    : "🌐"}
                        </div>
                        <div>
                          <span className="mb-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {categoryLabels[source.category]?.[language] ??
                              (isBn ? "সরকারি উৎস" : "Official source")}
                          </span>
                          <h3 className="font-bold leading-6 text-slate-900">
                            {source.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
                        {source.description}
                      </p>

                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                      >
                        {isBn
                          ? "সরকারি ওয়েবসাইটে দেখুন"
                          : "Visit official website"}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                  {isBn
                    ? "এই বিষয়ের কোনো লিংক এখনো যুক্ত করা হয়নি। অন্য বিষয় নির্বাচন করুন।"
                    : "No links have been added for this category yet. Select another category."}
                </div>
              )}
            </section>
          </>
        )}

        <section className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              ⚠️
            </span>
            <div>
              <h2 className="mb-2 font-extrabold text-amber-950">
                {isBn ? "সতর্কতা বার্তা" : "Important Warning"}
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-amber-950">
                <li>
                  {isBn
                    ? "সরকারি ওয়েবসাইটের ঠিকানা ভালোভাবে যাচাই করে প্রবেশ করুন।"
                    : "Check the website address carefully before opening it."}
                </li>
                <li>
                  {isBn
                    ? "অপরিচিত ওয়েবসাইটে পাসপোর্ট, ইকামা, ব্যাংক তথ্য বা OTP দেবেন না।"
                    : "Never share passport, residency, banking details or OTPs on unfamiliar websites."}
                </li>
                <li>
                  {isBn
                    ? "এই পেজে সরকারি ওয়েবসাইটের লিংক দেওয়া হয়। নতুন নোটিশ স্বয়ংক্রিয়ভাবে এখানে আসে না; সর্বশেষ তথ্য সংশ্লিষ্ট সরকারি ওয়েবসাইটে যাচাই করুন।"
                    : "This page provides government website links. New notices are not automatically imported; check the relevant official website for the latest information."}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <h2 className="mb-2 text-lg font-extrabold text-green-900">
            {isBn ? "আরও সার্ভিস প্রয়োজন?" : "Need more services?"}
          </h2>
          <p className="mb-4 text-sm leading-6 text-green-900">
            {isBn
              ? "পাসপোর্ট, জরুরি সহায়তা, শ্রম, ভিসা ও অন্যান্য প্রবাসী সেবা দেখতে সার্ভিস পেইজে যান।"
              : "Visit the Services page for passport, emergency assistance, labour, visa and other expatriate services."}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
          >
            {isBn ? "সার্ভিস পেইজে যান" : "Go to Services"}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="pb-4 text-center text-xs leading-5 text-slate-500">
          {isBn
            ? "প্রবাসীদের অভিযোগ — প্রবাসীদের সরকারি তথ্য খুঁজে পেতে সহায়ক একটি প্ল্যাটফর্ম।"
            : "Probasider Ovijog — Helping expatriates find useful official information."}
        </p>
      </div>
    </main>
  );
}