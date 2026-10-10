"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Language = "bn" | "en";

type HelpRequest = {
  id: string;
  requestNumber?: string;
  name?: string;
  title: string;
  details: string;
  country: string;
  city: string;
  createdAt?: {
    seconds: number;
  };
  status?: string;
};

type Advice = {
  id: string;
  name?: string;
  text: string;
  createdAt?: {
    seconds: number;
  };
};



type Sponsor = {
  id: string;
  name?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  link?: string;
  active?: boolean;
  createdAt?: unknown;
};

const countries = [
  "🇧🇩 বাংলাদেশ — Bangladesh",
  "🇸🇦 সৌদি আরব — Saudi Arabia",
  "🇦🇪 সংযুক্ত আরব আমিরাত — United Arab Emirates",
  "🇮🇹 ইতালি — Italy",
  "🇲🇾 মালয়েশিয়া — Malaysia",
  "🇴🇲 ওমান — Oman",
  "🇶🇦 কাতার — Qatar",
  "🇰🇼 কুয়েত — Kuwait",
  "🇧🇭 বাহরাইন — Bahrain",
  "🇸🇬 সিঙ্গাপুর — Singapore",
  "🇺🇸 যুক্তরাষ্ট্র — United States",
  "🇬🇧 যুক্তরাজ্য — United Kingdom",
  "🇨🇦 কানাডা — Canada",
  "🇦🇺 অস্ট্রেলিয়া — Australia",
  "🇯🇵 জাপান — Japan",
  "🇰🇷 দক্ষিণ কোরিয়া — South Korea",
  "🇵🇹 পর্তুগাল — Portugal",
  "🇬🇷 গ্রিস — Greece",
  "🇫🇷 ফ্রান্স — France",
  "🇩🇪 জার্মানি — Germany",
  "🇪🇸 স্পেন — Spain",
  "🇮🇪 আয়ারল্যান্ড — Ireland",
  "🇳🇱 নেদারল্যান্ডস — Netherlands",
  "🇸🇪 সুইডেন — Sweden",
  "🇩🇰 ডেনমার্ক — Denmark",
  "🇳🇴 নরওয়ে — Norway",
  "🇫🇮 ফিনল্যান্ড — Finland",
  "🇷🇺 রাশিয়া — Russia",
  "🇵🇱 পোল্যান্ড — Poland",
  "🇷🇴 রোমানিয়া — Romania",
  "🇨🇾 সাইপ্রাস — Cyprus",
  "🇧🇳 ব্রুনাই — Brunei",
  "🇲🇻 মালদ্বীপ — Maldives",
  "🇯🇴 জর্ডান — Jordan",
  "🇱🇧 লেবানন — Lebanon",
  "🇮🇶 ইরাক — Iraq",
  "🇱🇾 লিবিয়া — Libya",
  "🇿🇦 দক্ষিণ আফ্রিকা — South Africa",
  "🇮🇳 ভারত — India",
  "🇵🇰 পাকিস্তান — Pakistan",
  "🇳🇵 নেপাল — Nepal",
  "🇱🇰 শ্রীলঙ্কা — Sri Lanka",
  "🇹🇭 থাইল্যান্ড — Thailand",
  "🇻🇳 ভিয়েতনাম — Vietnam",
  "🇮🇩 ইন্দোনেশিয়া — Indonesia",
  "🇵🇭 ফিলিপাইন — Philippines",
  "🇨🇳 চীন — China",
  "🇭🇰 হংকং — Hong Kong",
  "🇹🇼 তাইওয়ান — Taiwan",
  "🇳🇿 নিউজিল্যান্ড — New Zealand",
  "🇹🇷 তুরস্ক — Turkey",
  "🇮🇷 ইরান — Iran",
  "🇪🇬 মিশর — Egypt",
  "🇲🇦 মরক্কো — Morocco",
  "🇩🇿 আলজেরিয়া — Algeria",
  "🇹🇳 তিউনিসিয়া — Tunisia",
  "🇸🇩 সুদান — Sudan",
  "🇪🇹 ইথিওপিয়া — Ethiopia",
  "🇰🇪 কেনিয়া — Kenya",
  "🇹🇿 তানজানিয়া — Tanzania",
  "🇺🇬 উগান্ডা — Uganda",
  "🇳🇬 নাইজেরিয়া — Nigeria",
  "🇬🇭 ঘানা — Ghana",
  "🇸🇳 সেনেগাল — Senegal",
  "🇸🇱 সিয়েরা লিওন — Sierra Leone",
  "🇱🇷 লাইবেরিয়া — Liberia",
  "🇿🇲 জাম্বিয়া — Zambia",
  "🇿🇼 জিম্বাবুয়ে — Zimbabwe",
  "🇧🇼 বতসোয়ানা — Botswana",
  "🇳🇦 নামিবিয়া — Namibia",
  "🇲🇺 মরিশাস — Mauritius",
  "🇸🇨 সেশেলস — Seychelles",
  "🇷🇼 রুয়ান্ডা — Rwanda",
  "🇧🇮 বুরুন্ডি — Burundi",
  "🇸🇴 সোমালিয়া — Somalia",
  "🇩🇯 জিবুতি — Djibouti",
  "🇪🇷 ইরিত্রিয়া — Eritrea",
  "🇾🇪 ইয়েমেন — Yemen",
  "🇴🇲 ওমান — Oman",
  "🇵🇸 ফিলিস্তিন — Palestine",
  "🇱🇾 লিবিয়া — Libya",
  "🇦🇫 আফগানিস্তান — Afghanistan",
  "🇺🇿 উজবেকিস্তান — Uzbekistan",
  "🇰🇿 কাজাখস্তান — Kazakhstan",
  "🇰🇬 কিরগিজস্তান — Kyrgyzstan",
  "🇹🇯 তাজিকিস্তান — Tajikistan",
  "🇹🇲 তুর্কমেনিস্তান — Turkmenistan",
  "🇦🇿 আজারবাইজান — Azerbaijan",
  "🇬🇪 জর্জিয়া — Georgia",
  "🇦🇲 আর্মেনিয়া — Armenia",
  "🇺🇦 ইউক্রেন — Ukraine",
  "🇧🇾 বেলারুশ — Belarus",
  "🇧🇬 বুলগেরিয়া — Bulgaria",
  "🇭🇺 হাঙ্গেরি — Hungary",
  "🇨🇿 চেকিয়া — Czechia",
  "🇸🇰 স্লোভাকিয়া — Slovakia",
  "🇸🇮 স্লোভেনিয়া — Slovenia",
  "🇭🇷 ক্রোয়েশিয়া — Croatia",
  "🇷🇸 সার্বিয়া — Serbia",
  "🇧🇦 বসনিয়া ও হার্জেগোভিনা — Bosnia and Herzegovina",
  "🇲🇪 মন্টেনিগ্রো — Montenegro",
  "🇲🇰 উত্তর মেসিডোনিয়া — North Macedonia",
  "🇦🇱 আলবেনিয়া — Albania",
  "🇽🇰 কসোভো — Kosovo",
  "🇲🇹 মাল্টা — Malta",
  "🇱🇺 লুক্সেমবার্গ — Luxembourg",
  "🇧🇪 বেলজিয়াম — Belgium",
  "🇦🇹 অস্ট্রিয়া — Austria",
  "🇨🇭 সুইজারল্যান্ড — Switzerland",
  "🇮🇸 আইসল্যান্ড — Iceland",
  "🇪🇪 এস্তোনিয়া — Estonia",
  "🇱🇻 লাটভিয়া — Latvia",
  "🇱🇹 লিথুয়ানিয়া — Lithuania",
  "🇲🇩 মলদোভা — Moldova",
  "🇬🇧 যুক্তরাজ্য — United Kingdom",
  "🇲🇽 মেক্সিকো — Mexico",
  "🇧🇷 ব্রাজিল — Brazil",
  "🇦🇷 আর্জেন্টিনা — Argentina",
  "🇨🇱 চিলি — Chile",
  "🇵🇪 পেরু — Peru",
  "🇨🇴 কলম্বিয়া — Colombia",
  "🇪🇨 ইকুয়েডর — Ecuador",
  "🇧🇴 বলিভিয়া — Bolivia",
  "🇵🇾 প্যারাগুয়ে — Paraguay",
  "🇺🇾 উরুগুয়ে — Uruguay",
  "🇻🇪 ভেনেজুয়েলা — Venezuela",
  "🇵🇦 পানামা — Panama",
  "🇨🇷 কোস্টারিকা — Costa Rica",
  "🇳🇮 নিকারাগুয়া — Nicaragua",
  "🇭🇳 হন্ডুরাস — Honduras",
  "🇬🇹 গুয়াতেমালা — Guatemala",
  "🇸🇻 এল সালভাদর — El Salvador",
  "🇧🇿 বেলিজ — Belize",
  "🇨🇺 কিউবা — Cuba",
  "🇯🇲 জ্যামাইকা — Jamaica",
  "🇭🇹 হাইতি — Haiti",
  "🇩🇴 ডোমিনিকান প্রজাতন্ত্র — Dominican Republic",
  "🇧🇸 বাহামাস — Bahamas",
  "🇧🇧 বার্বাডোস — Barbados",
  "🇹🇹 ত্রিনিদাদ ও টোবাগো — Trinidad and Tobago",
  "🇬🇾 গায়ানা — Guyana",
  "🇸🇷 সুরিনাম — Suriname",
  "🇫🇯 ফিজি — Fiji",
  "🇵🇬 পাপুয়া নিউগিনি — Papua New Guinea",
  "🇸🇧 সলোমন দ্বীপপুঞ্জ — Solomon Islands",
  "🇻🇺 ভানুয়াতু — Vanuatu",
  "🇼🇸 সামোয়া — Samoa",
  "🇹🇴 টোঙ্গা — Tonga",
  "🇹🇻 টুভালু — Tuvalu",
  "🇰🇮 কিরিবাতি — Kiribati",
  "🇳🇷 নাউরু — Nauru",
  "🇵🇼 পালাউ — Palau",
  "🇲🇭 মার্শাল দ্বীপপুঞ্জ — Marshall Islands",
  "🇫🇲 মাইক্রোনেশিয়া — Micronesia",
  "🇲🇳 মঙ্গোলিয়া — Mongolia",
  "🇰🇵 উত্তর কোরিয়া — North Korea",
  "🇱🇦 লাওস — Laos",
  "🇰🇭 কম্বোডিয়া — Cambodia",
  "🇲🇲 মিয়ানমার — Myanmar",
  "🇧🇹 ভুটান — Bhutan",
  "🇹🇱 তিমুর-লেস্তে — Timor-Leste",
  "🇲🇴 ম্যাকাও — Macao",
  "🇰🇵 উত্তর কোরিয়া — North Korea",
  "🇧🇦 বসনিয়া ও হার্জেগোভিনা — Bosnia and Herzegovina",
  "🇻🇦 ভ্যাটিকান সিটি — Vatican City",
  "🇸🇲 সান মারিনো — San Marino",
  "🇲🇨 মোনাকো — Monaco",
  "🇱🇮 লিশটেনস্টাইন — Liechtenstein",
  "🇦🇩 আন্দোরা — Andorra",
  "🇲🇦 মরক্কো — Morocco",
  "🇸🇸 দক্ষিণ সুদান — South Sudan",
  "🇨🇫 মধ্য আফ্রিকান প্রজাতন্ত্র — Central African Republic",
  "🇨🇲 ক্যামেরুন — Cameroon",
  "🇬🇦 গ্যাবন — Gabon",
  "🇨🇬 কঙ্গো — Republic of the Congo",
  "🇨🇩 কঙ্গো গণতান্ত্রিক প্রজাতন্ত্র — DR Congo",
  "🇦🇴 অ্যাঙ্গোলা — Angola",
  "🇲🇿 মোজাম্বিক — Mozambique",
  "🇲🇬 মাদাগাস্কার — Madagascar",
  "🇲🇼 মালাউই — Malawi",
  "🇱🇸 লেসোথো — Lesotho",
  "🇸🇿 এসওয়াতিনি — Eswatini",
  "🇬🇲 গাম্বিয়া — Gambia",
  "🇬🇳 গিনি — Guinea",
  "🇬🇼 গিনি-বিসাউ — Guinea-Bissau",
  "🇲🇱 মালি — Mali",
  "🇳🇪 নাইজার — Niger",
  "🇧🇫 বুরকিনা ফাসো — Burkina Faso",
  "🇹🇬 টোগো — Togo",
  "🇧🇯 বেনিন — Benin",
  "🇨🇮 কোত দিভোয়ার — Côte d'Ivoire",
  "🇲🇷 মৌরিতানিয়া — Mauritania",
  "🇨🇻 কেপ ভার্দে — Cape Verde",
  "🇬🇶 নিরক্ষীয় গিনি — Equatorial Guinea",
  "🇸🇹 সাও টোমে ও প্রিন্সিপে — São Tomé and Príncipe",
  "🇰🇲 কোমোরোস — Comoros",
  "🇲🇽 মেক্সিকো — Mexico",
  "🇳🇱 নেদারল্যান্ডস — Netherlands",
  "🇵🇭 ফিলিপাইন — Philippines",
  "🇲🇾 মালয়েশিয়া — Malaysia",
  "🇮🇩 ইন্দোনেশিয়া — Indonesia",
  "🇸🇬 সিঙ্গাপুর — Singapore",
  "🇻🇳 ভিয়েতনাম — Vietnam",
  "🇯🇵 জাপান — Japan",
  "🇰🇷 দক্ষিণ কোরিয়া — South Korea",
];

const uniqueCountries = Array.from(new Set(countries));

function makeRequestNumber() {
  const year = new Date().getFullYear();

  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `HLP-${year}-${window.crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  return `HLP-${year}-${Math.random()
    .toString(36)
    .slice(2, 10)
    .toUpperCase()}`;
}

function formatDate(value?: { seconds: number }) {
  if (!value?.seconds) return "";

  return new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value.seconds * 1000));
}

export default function HelpPage() {
  const [language, setLanguage] = useState<Language>("bn");
  const bn = language === "bn";

  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [advices, setAdvices] = useState<Record<string, Advice[]>>({});
  const [helperCounts, setHelperCounts] = useState<Record<string, number>>({});

  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successNumber, setSuccessNumber] = useState("");

  const [openAdvice, setOpenAdvice] = useState<string | null>(null);
  const [openHelper, setOpenHelper] = useState<string | null>(null);

  /* =========================
     SPONSOR
  ========================= */

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    const sponsorQuery = query(
      collection(db, "sponsors"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      sponsorQuery,
      (snapshot) => {
        const sponsorList: Sponsor[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Sponsor, "id">),
        }));

        setSponsors(sponsorList);
      },
      (error) => {
        console.error("Sponsor loading error:", error);
        setSponsors([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const sortedSponsors = useMemo(() => {
    const getCreatedTime = (sponsor: Sponsor) => {
      const createdAt = sponsor.createdAt;

      if (
        createdAt &&
        typeof createdAt === "object" &&
        "toMillis" in createdAt &&
        typeof (createdAt as { toMillis?: unknown }).toMillis === "function"
      ) {
        return (createdAt as { toMillis: () => number }).toMillis();
      }

      if (typeof createdAt === "string") {
        const time = new Date(createdAt).getTime();
        return Number.isNaN(time) ? 0 : time;
      }

      if (typeof createdAt === "number") {
        return createdAt;
      }

      return 0;
    };

    return [...sponsors].sort(
      (a, b) => getCreatedTime(a) - getCreatedTime(b)
    );
  }, [sponsors]);

  const currentSponsor =
    sortedSponsors.length > 0
      ? sortedSponsors[sponsorIndex % sortedSponsors.length]
      : null;

  useEffect(() => {
    if (!currentSponsor) return;
    if (sortedSponsors.length <= 1) return;
    if (currentSponsor.mediaType !== "image") return;

    const timer = setTimeout(() => {
      setSponsorIndex(
        (previous) => (previous + 1) % sortedSponsors.length
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSponsor, sortedSponsors]);

  
  const nextSponsorMedia = () => {
    if (sortedSponsors.length <= 1) return;

    setSponsorIndex(
      (previous) => (previous + 1) % sortedSponsors.length
    );
  };

  const previousSponsorMedia = () => {
    if (sortedSponsors.length <= 1) return;

    setSponsorIndex(
      (previous) =>
        (previous - 1 + sortedSponsors.length) %
        sortedSponsors.length
    );
  };

  /* =========================
     COUNTRY SEARCH
  ========================= */

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return [];

    return uniqueCountries
      .filter((country) =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
      )
      .slice(0, 10);
  }, [countrySearch]);

  /* =========================
     HELP REQUESTS
  ========================= */

  useEffect(() => {
    const helpQuery = query(
      collection(db, "helpRequests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      helpQuery,
      (snapshot) => {
        const data: HelpRequest[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<HelpRequest, "id">),
        }));

        setRequests(data);
      },
      () => {
        setRequests([]);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    requests.forEach((request) => {
      const adviceQuery = query(
        collection(db, "helpRequests", request.id, "advice"),
        orderBy("createdAt", "asc")
      );

      const unsubscribeAdvice = onSnapshot(
        adviceQuery,
        (snapshot) => {
          const list: Advice[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Advice, "id">),
          }));

          setAdvices((previous) => ({
            ...previous,
            [request.id]: list,
          }));
        },
        () => {
          setAdvices((previous) => ({
            ...previous,
            [request.id]: [],
          }));
        }
      );

      unsubscribers.push(unsubscribeAdvice);

      const helperQuery = collection(
        db,
        "helpRequests",
        request.id,
        "helpOffers"
      );

      const unsubscribeHelpers = onSnapshot(
        helperQuery,
        (snapshot) => {
          setHelperCounts((previous) => ({
            ...previous,
            [request.id]: snapshot.size,
          }));
        },
        () => {
          setHelperCounts((previous) => ({
            ...previous,
            [request.id]: 0,
          }));
        }
      );

      unsubscribers.push(unsubscribeHelpers);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [requests]);

  async function handleHelpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCountry) {
      alert(
        bn
          ? "অনুগ্রহ করে আপনার দেশ নির্বাচন করুন।"
          : "Please select your country."
      );
      return;
    }

    if (!title.trim() || !details.trim() || !name.trim() || !phone.trim()) {
      alert(
        bn
          ? "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।"
          : "Please complete the required information."
      );
      return;
    }

    setSubmitting(true);

    try {
      const requestNumber = makeRequestNumber();

      await addDoc(collection(db, "helpRequests"), {
        requestNumber,
        title: title.trim(),
        details: details.trim(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        country: selectedCountry,
        city: city.trim(),
        status: "open",
        createdAt: serverTimestamp(),
      });

      setSuccessNumber(requestNumber);

      setTitle("");
      setName("");
      setPhone("");
      setEmail("");
      setCity("");
      setDetails("");
      setCountrySearch("");
      setSelectedCountry("");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);

      alert(
        bn
          ? "সমস্যাটি জমা দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          : "The request could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitAdvice(
    event: FormEvent<HTMLFormElement>,
    requestId: string
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const adviceText = String(formData.get("advice") || "").trim();
    const adviceName = String(formData.get("adviceName") || "").trim();

    if (!adviceText) {
      alert(bn ? "আপনার পরামর্শ লিখুন।" : "Please write your advice.");
      return;
    }

    try {
      await addDoc(collection(db, "helpRequests", requestId, "advice"), {
        name: adviceName || (bn ? "একজন প্রবাসী" : "An expatriate"),
        text: adviceText,
        createdAt: serverTimestamp(),
      });

      form.reset();
      setOpenAdvice(null);
    } catch (error) {
      console.error(error);

      alert(
        bn
          ? "পরামর্শ জমা দেওয়া যায়নি।"
          : "The advice could not be submitted."
      );
    }
  }

  async function submitHelpOffer(
    event: FormEvent<HTMLFormElement>,
    requestId: string
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const helperName = String(formData.get("helperName") || "").trim();
    const helperPhone = String(formData.get("helperPhone") || "").trim();
    const helperEmail = String(formData.get("helperEmail") || "").trim();
    const helperDetails = String(
      formData.get("helperDetails") || ""
    ).trim();

    if (!helperName || !helperPhone || !helperDetails) {
      alert(
        bn
          ? "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।"
          : "Please complete the required information."
      );
      return;
    }

    try {
      await addDoc(
        collection(db, "helpRequests", requestId, "helpOffers"),
        {
          name: helperName,
          phone: helperPhone,
          email: helperEmail,
          details: helperDetails,
          createdAt: serverTimestamp(),
        }
      );

      form.reset();
      setOpenHelper(null);

      alert(
        bn
          ? "আপনার সাহায্যের আগ্রহ সফলভাবে জানানো হয়েছে। Admin প্রয়োজন অনুযায়ী যোগাযোগ করবেন।"
          : "Your offer to help has been submitted. Admin may contact you when necessary."
      );
    } catch (error) {
      console.error(error);

      alert(
        bn
          ? "সাহায্যের আগ্রহ জমা দেওয়া যায়নি।"
          : "The offer to help could not be submitted."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#092c25] text-xl text-white shadow-sm">
              ⚖️
            </div>

            <div>
              <div className="text-sm font-extrabold text-[#092c25] sm:text-base">
                {bn ? "প্রবাসীদের অভিযোগ" : "PROBASHIDER OVIJOG"}
              </div>

              <div className="text-[10px] text-slate-500 sm:text-xs">
                {bn ? "আপনার কথা, আপনার অধিকার " : "For expatriates"}
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(bn ? "en" : "bn")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#092c25] shadow-sm transition hover:bg-emerald-50"
          >
            {bn ? "English" : "বাংলা"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#092c25]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              🤝 {bn ? "প্রবাসী সহায়তা" : "Expatriate Help"}
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              🤝 {bn ? "সমস্যায় আছেন" : "Need Help?"}
            </h1>

            <p className="mt-4 text-lg font-semibold text-emerald-50">
              {bn
                ? "আপনি একা নন। আপনার সমস্যার কথা আমাদের জানান।"
                : "You are not alone. Tell us about your problem."}
            </p>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-emerald-100/90 sm:text-base">
              {bn
                ? "আপনি প্রবাসে এমন কোনো সমস্যার মধ্যে থাকলে, যার সমাধান কীভাবে করবেন বা কার কাছে যাবেন তা জানেন না—আপনার পরিস্থিতি বিস্তারিতভাবে আমাদের জানান। আপনার অভিজ্ঞতা শুনে অন্য প্রবাসীরা তাদের জানা তথ্য, অভিজ্ঞতা ও পরামর্শের মাধ্যমে আপনাকে সহযোগিতা করার চেষ্টা করতে পারবেন।"
                : "If you are facing a problem abroad and do not know how to solve it or whom to contact, tell us about your situation. Experienced expatriates may share useful information, experience and advice that could help you find a possible way forward."}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* SUCCESS */}
        {successNumber && (
          <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="text-2xl font-black text-emerald-800">
              ✅{" "}
              {bn
                ? "আপনার সমস্যাটি সফলভাবে জমা হয়েছে"
                : "Your help request was submitted successfully"}
            </div>

            <p className="mt-2 text-sm text-emerald-700">
              {bn
                ? "আপনার Request Number সংরক্ষণ করে রাখুন।"
                : "Please save your Request Number."}
            </p>

            <div className="mt-4 rounded-2xl bg-white p-4 text-center">
              <div className="text-xs font-semibold text-slate-500">
                {bn ? "Request Number" : "Request Number"}
              </div>

              <div className="mt-1 break-all text-xl font-black tracking-wider text-[#092c25]">
                {successNumber}
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY NOTICE */}
        <section className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-7">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              ⚠️
            </div>

            <div>
              <h2 className="text-xl font-black text-[#092c25]">
                {bn
                  ? "আপনার ব্যক্তিগত তথ্য নিরাপদ থাকবে"
                  : "Your personal information will remain private"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {bn
                  ? "আপনার নাম, WhatsApp/মোবাইল নম্বর, ইমেইল ঠিকানা এবং অন্যান্য ব্যক্তিগত তথ্য নিরাপদে সংরক্ষণ করা হবে। এই তথ্য সাধারণ ব্যবহারকারীরা দেখতে পারবেন না। শুধুমাত্র অনুমোদিত Admin প্রয়োজন অনুযায়ী এসব তথ্য দেখতে পারবেন।"
                  : "Your name, WhatsApp/mobile number, email address and other personal information will be stored privately. General users will not be able to see this information. Only authorized Admin access may view it when necessary."}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {bn
                  ? "কেউ আপনার সমস্যায় সাহায্য করতে আগ্রহী হলে তার ব্যক্তিগত তথ্যও প্রকাশ্যে দেখানো হবে না। যোগাযোগের প্রয়োজন হলে Admin উভয় পক্ষের সঙ্গে যোগাযোগ করে এবং উভয়ের সম্মতি নিয়ে যোগাযোগের ব্যবস্থা করবেন।"
                  : "A person's private information will not be publicly displayed if they offer to help. If contact is needed, Admin may contact both sides and arrange communication only with mutual consent."}
              </p>
            </div>
          </div>
        </section>

        {/* IMPORTANT NOTICE */}
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
          <h2 className="text-lg font-black text-amber-900">
            ⚠️ {bn ? "গুরুত্বপূর্ণ" : "Important"}
          </h2>

          <p className="mt-3 text-sm leading-7 text-amber-900/80">
            {bn
              ? "এই প্ল্যাটফর্মের উদ্দেশ্য হলো সমস্যায় থাকা প্রবাসীদের নিজেদের অভিজ্ঞতা জানানো এবং পারস্পরিক সহযোগিতার সুযোগ তৈরি করা। এখানে প্রকাশিত কোনো পরামর্শকে সরকারি, আইনি বা পেশাদার সেবার বিকল্প হিসেবে বিবেচনা করা উচিত নয়। জরুরি বা জীবন-ঝুঁকির পরিস্থিতিতে সংশ্লিষ্ট দেশের জরুরি সেবা, পুলিশ, হাসপাতাল বা সংশ্লিষ্ট সরকারি কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।"
              : "This platform is intended to allow expatriates to share problems and create opportunities for mutual support. Advice published here should not be treated as a substitute for official, legal or professional services. In an emergency or life-threatening situation, contact local emergency services, police, hospitals or relevant government authorities."}
          </p>

          <p className="mt-3 text-sm font-semibold leading-7 text-amber-900/80">
            {bn
              ? "কোনো ব্যক্তির ব্যক্তিগত তথ্য, অপমানজনক বক্তব্য, মিথ্যা তথ্য বা অন্যের ক্ষতি করতে পারে এমন তথ্য প্রকাশ করা যাবে না।"
              : "Do not publish personal information, abusive statements, false information or content that may harm another person."}
          </p>
        </section>

        {/* SPONSOR */}
        <section className="mb-8">
          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-[#07101f] shadow-lg">
            {currentSponsor && (
              <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-black/75 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                  <p className="text-sm font-black sm:text-base">
                    {currentSponsor.name || "Sponsor"}
                  </p>
                </div>

                {currentSponsor.link ? (
                  <a
                    href={currentSponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-600 active:scale-95"
                  >
                    {bn ? "দেখুন" : "View"}
                  </a>
                ) : (
                  <div className="rounded-2xl bg-emerald-500/40 px-5 py-3 text-sm font-black text-white">
                    Sponsor
                  </div>
                )}
              </div>
            )}

            {currentSponsor ? (
              <div className="relative flex min-h-[220px] items-center justify-center bg-black">
                {currentSponsor.mediaType === "video" ? (
                  <video
                    key={currentSponsor.id}
                    src={currentSponsor.mediaUrl}
                    controls
                    playsInline
                    autoPlay
                    onEnded={nextSponsorMedia}
                    className="block max-h-[75vh] w-full object-contain"
                  />
                ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={currentSponsor.id}
                    src={currentSponsor.mediaUrl}
                    alt={currentSponsor.name || "Sponsor"}
                    className="block max-h-[75vh] w-full object-contain"
                  />
                )}

                {sortedSponsors.length > 1 && (
                  <button
                    type="button"
                    onClick={previousSponsorMedia}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl font-black text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 active:scale-95"
                    aria-label="Previous sponsor"
                  >
                    ←
                  </button>
                )}

                {sortedSponsors.length > 1 && (
                  <button
                    type="button"
                    onClick={nextSponsorMedia}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl font-black text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 active:scale-95"
                    aria-label="Next sponsor"
                  >
                    →
                  </button>
                )}

                {sortedSponsors.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                    {sponsorIndex + 1} / {sortedSponsors.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex min-h-[180px] items-center justify-center px-5 py-10 text-center">
                <div>
                  <p className="text-2xl font-black text-white">
                    Sponsor
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {bn
                      ? "এখানে ভবিষ্যতে স্পন্সরের বিজ্ঞাপন প্রদর্শিত হবে"
                      : "Sponsor media will appear here in the future"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FORM */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="text-sm font-bold text-emerald-700">
              {bn ? "সহায়তার জন্য প্রথম ধাপ" : "First step"}
            </div>

            <h2 className="mt-1 text-2xl font-black text-[#092c25] sm:text-3xl">
              📝 {bn ? "আপনার সমস্যাটি জানান" : "Tell us your problem"}
            </h2>
          </div>

          <form onSubmit={handleHelpSubmit} className="space-y-5">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn ? "আপনার সমস্যা কী?" : "What is your problem?"}
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={180}
                placeholder={
                  bn
                    ? "যেমন: বেতন পাচ্ছি না / পাসপোর্ট আটকে আছে / চিকিৎসা সমস্যা"
                    : "Example: Salary unpaid / Passport withheld / Medical problem"
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn ? "আপনার নাম" : "Your name"}
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={
                  bn ? "আপনার পূর্ণ নাম লিখুন" : "Enter your full name"
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* PHONE + EMAIL */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn
                    ? "WhatsApp / মোবাইল নম্বর"
                    : "WhatsApp / Mobile number"}
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  placeholder={
                    bn
                      ? "WhatsApp যুক্ত মোবাইল নম্বর"
                      : "WhatsApp mobile number"
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn ? "ইমেইল ঠিকানা" : "Email address"}
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder={
                    bn ? "আপনার ইমেইল ঠিকানা" : "Your email address"
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* COUNTRY + CITY */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn ? "বর্তমান দেশ" : "Current country"}
                </label>

                <div className="relative">
                  <input
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setSelectedCountry("");
                    }}
                    required
                    autoComplete="off"
                    placeholder={
                      bn ? "দেশের নাম লিখুন..." : "Type country name..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />

                  {!selectedCountry && countrySearch.trim() !== "" && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountrySearch(country);
                          }}
                          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:bg-emerald-50"
                        >
                          {country}
                        </button>
                      ))}

                      {filteredCountries.length === 0 && (
                        <div className="px-4 py-4 text-center text-sm text-slate-500">
                          {bn
                            ? "কোনো দেশ পাওয়া যায়নি"
                            : "No country found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn ? "বর্তমান শহর" : "Current city"}
                </label>

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={bn ? "যেমন: Tabuk" : "Example: Tabuk"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* DETAILS */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn ? "সমস্যার বিস্তারিত" : "Problem details"}
              </label>

              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                rows={9}
                maxLength={6000}
                placeholder={
                  bn
                    ? "কী সমস্যা হয়েছে, কতদিন ধরে চলছে, বর্তমানে কী অবস্থায় আছেন এবং কী ধরনের সাহায্য প্রয়োজন—বিস্তারিত লিখুন।"
                    : "Explain what happened, how long the problem has continued, your current situation and what kind of help you need."
                }
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-7 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                {bn
                  ? "ব্যক্তিগত পাসওয়ার্ড, OTP বা অপ্রয়োজনীয় গোপন তথ্য লিখবেন না।"
                  : "Do not include passwords, OTPs or unnecessary sensitive information."}
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#092c25] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#0b3b31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? bn
                  ? "জমা হচ্ছে..."
                  : "Submitting..."
                : `📩 ${bn ? "সমস্যাটি জানান" : "Submit your problem"}`}
            </button>
          </form>
        </section>

        {/* PUBLIC HELP POSTS */}
        <section className="mt-12">
          <div className="mb-6">
            <div className="text-sm font-bold text-emerald-700">
              🤝 {bn ? "প্রবাসীদের পারস্পরিক সহযোগিতা" : "Community support"}
            </div>

            <h2 className="mt-1 text-2xl font-black text-[#092c25] sm:text-3xl">
              {bn ? "হেল্প চাই পোস্টগুলো" : "Help requests"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {bn
                ? "আপনার জানা কার্যকর তথ্য বা বাস্তব অভিজ্ঞতা থাকলে অন্য প্রবাসীকে সহযোগিতা করুন।"
                : "Share useful information or real experience when you can help another expatriate."}
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="text-4xl">🤝</div>

              <h3 className="mt-4 text-lg font-black text-[#092c25]">
                {bn
                  ? "এখনও কোনো হেল্প চাই পোস্ট নেই"
                  : "No help requests yet"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {bn
                  ? "আপনার সমস্যাটি জানিয়ে প্রথম পোস্টটি তৈরি করতে পারেন।"
                  : "You can create the first help request by sharing your problem."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => {
                const adviceList = advices[request.id] || [];
                const adviceCount = adviceList.length;
                const helpers = helperCounts[request.id] || 0;

                const commentCount = adviceCount;
                const noCommentCount = adviceCount === 0 ? 1 : 0;

                const total =
                  commentCount + noCommentCount + helpers || 1;

                const commentWidth =
                  (commentCount / total) * 100;

                const noCommentWidth =
                  (noCommentCount / total) * 100;

                const helperWidth =
                  (helpers / total) * 100;

                return (
                  <article
                    key={request.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* CARD HEADER */}
                    <div className="border-b border-slate-100 bg-[#092c25] p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                          🤝 {bn ? "হেল্প চাই" : "Help request"}
                        </div>

                        <div className="text-xs text-emerald-100/70">
                          {formatDate(request.createdAt)}
                        </div>
                      </div>

                      <h3 className="mt-5 text-xl font-black leading-8 text-white sm:text-2xl">
                        {request.title}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {request.country && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-50">
                            🌍 {request.country}
                          </span>
                        )}

                        {request.city && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-50">
                            📍 {request.city}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* PUBLIC PERSON + DETAILS */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-lg">
                          👤
                        </div>

                        <div>
                          <div className="text-xs text-slate-400">
                            {bn ? "প্রবাসী" : "Expatriate"}
                          </div>

                          <div className="font-black text-[#092c25]">
                            {request.name ||
                              (bn ? "একজন প্রবাসী" : "An expatriate")}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {request.details}
                      </div>

                      {/* PRIVACY NOTE */}
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
                        ⚠️{" "}
                        {bn
                          ? "যোগাযোগের ব্যক্তিগত তথ্য Public করা হয়নি। প্রয়োজন হলে Admin উভয় পক্ষের সম্মতি নিয়ে যোগাযোগের ব্যবস্থা করবেন।"
                          : "Private contact information is not publicly displayed. If needed, Admin may arrange contact with mutual consent."}
                      </div>

                      {/* ADVICE */}
                      <div className="mt-6 border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h4 className="font-black text-[#092c25]">
                              💡{" "}
                              {bn
                                ? "আপনার অভিজ্ঞতা জানান"
                                : "Share your experience"}
                            </h4>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {bn
                                ? "এই ধরনের সমস্যা সম্পর্কে বাস্তব অভিজ্ঞতা থাকলে কার্যকর পরামর্শ দিন।"
                                : "Share practical advice if you have real experience with this type of problem."}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenAdvice(
                                openAdvice === request.id
                                  ? null
                                  : request.id
                              )
                            }
                            className="shrink-0 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-800 transition hover:bg-emerald-100"
                          >
                            💬{" "}
                            {bn ? "মন্তব্য করুন" : "Comment"}
                          </button>
                        </div>

                        {openAdvice === request.id && (
                          <form
                            onSubmit={(event) =>
                              submitAdvice(event, request.id)
                            }
                            className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
                          >
                            <input
                              name="adviceName"
                              placeholder={
                                bn
                                  ? "আপনার নাম (ঐচ্ছিক)"
                                  : "Your name (optional)"
                              }
                              className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                            />

                            <textarea
                              name="advice"
                              required
                              rows={5}
                              placeholder={
                                bn
                                  ? "আপনার অভিজ্ঞতা বা কার্যকর পরামর্শ লিখুন..."
                                  : "Write your experience or practical advice..."
                              }
                              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600"
                            />

                            <button
                              type="submit"
                              className="mt-3 rounded-xl bg-[#092c25] px-5 py-3 text-xs font-black text-white"
                            >
                              💡{" "}
                              {bn
                                ? "পরামর্শ জানান"
                                : "Submit advice"}
                            </button>
                          </form>
                        )}

                        {adviceList.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {adviceList.map((advice) => (
                              <div
                                key={advice.id}
                                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-xs font-black text-[#092c25]">
                                    👤{" "}
                                    {advice.name ||
                                      (bn
                                        ? "একজন প্রবাসী"
                                        : "An expatriate")}
                                  </div>

                                  <div className="text-[10px] text-slate-400">
                                    {formatDate(advice.createdAt)}
                                  </div>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {advice.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* HELP OFFER */}
                      <div className="mt-6 border-t border-slate-100 pt-6">
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                          <h4 className="font-black text-amber-900">
                            🤝{" "}
                            {bn
                              ? "আপনি কি তাকে সাহায্য করতে পারবেন?"
                              : "Can you help this person?"}
                          </h4>

                          <p className="mt-2 text-xs leading-6 text-amber-800/80">
                            {bn
                              ? "আপনার অভিজ্ঞতা, জ্ঞান বা পরিচিত যোগাযোগের মাধ্যমে এই ব্যক্তিকে সাহায্য করতে পারলে এখানে সাহায্যের আগ্রহ জানাতে পারেন।"
                              : "If your experience, knowledge or contacts may help this person, you can offer your help here."}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenHelper(
                                openHelper === request.id
                                  ? null
                                  : request.id
                              )
                            }
                            className="mt-4 rounded-xl bg-amber-500 px-5 py-3 text-xs font-black text-white shadow-sm transition hover:bg-amber-600"
                          >
                            🤝{" "}
                            {bn
                              ? "আমি সাহায্য করতে চাই"
                              : "I want to help"}
                          </button>
                        </div>

                        {openHelper === request.id && (
                          <form
                            onSubmit={(event) =>
                              submitHelpOffer(event, request.id)
                            }
                            className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
                          >
                            <div className="mb-4 text-sm font-black text-amber-900">
                              ⚠️{" "}
                              {bn
                                ? "আপনার তথ্য Admin-এর কাছে গোপন থাকবে"
                                : "Your information will remain private with Admin"}
                            </div>

                            <div className="space-y-3">
                              <input
                                name="helperName"
                                required
                                placeholder={
                                  bn ? "আপনার নাম" : "Your name"
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
                              />

                              <input
                                name="helperPhone"
                                required
                                type="tel"
                                placeholder={
                                  bn
                                    ? "WhatsApp যুক্ত মোবাইল নম্বর"
                                    : "WhatsApp mobile number"
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
                              />

                              <input
                                name="helperEmail"
                                type="email"
                                placeholder={
                                  bn
                                    ? "ইমেইল ঠিকানা"
                                    : "Email address"
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
                              />

                              <textarea
                                name="helperDetails"
                                required
                                rows={5}
                                placeholder={
                                  bn
                                    ? "আপনি কীভাবে সাহায্য করতে পারবেন?"
                                    : "How can you help?"
                                }
                                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-amber-500"
                              />
                            </div>

                            <button
                              type="submit"
                              className="mt-4 rounded-xl bg-[#092c25] px-5 py-3 text-xs font-black text-white"
                            >
                              🤝{" "}
                              {bn
                                ? "সাহায্যের আগ্রহ জানান"
                                : "Offer to help"}
                            </button>
                          </form>
                        )}
                      </div>

                      {/* CARD STATS */}
                      <div className="mt-7 border-t border-slate-100 pt-6">
                        <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>
                            {bn
                              ? "এই পোস্টের সহায়তার অবস্থা"
                              : "Support activity"}
                          </span>
                        </div>

                        {/* AUTO COLOR BAR */}
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                          {commentWidth > 0 && (
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{
                                width: `${commentWidth}%`,
                              }}
                            />
                          )}

                          {noCommentWidth > 0 && (
                            <div
                              className="h-full bg-amber-400 transition-all duration-500"
                              style={{
                                width: `${noCommentWidth}%`,
                              }}
                            />
                          )}

                          {helperWidth > 0 && (
                            <div
                              className="h-full bg-sky-500 transition-all duration-500"
                              style={{
                                width: `${helperWidth}%`,
                              }}
                            />
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-xl bg-emerald-50 px-2 py-3">
                            <div className="text-lg font-black text-emerald-700">
                              {commentCount}
                            </div>

                            <div className="text-[10px] font-bold text-emerald-700">
                              🟢{" "}
                              {bn
                                ? "মন্তব্য করেছেন"
                                : "Commented"}
                            </div>
                          </div>

                          <div className="rounded-xl bg-amber-50 px-2 py-3">
                            <div className="text-lg font-black text-amber-700">
                              {noCommentCount}
                            </div>

                            <div className="text-[10px] font-bold text-amber-700">
                              🟡{" "}
                              {bn
                                ? "কোনো মন্তব্য নেই"
                                : "No comment "}
                            </div>
                          </div>

                          <div className="rounded-xl bg-sky-50 px-2 py-3">
                            <div className="text-lg font-black text-sky-700">
                              {helpers}
                            </div>

                            <div className="text-[10px] font-bold text-sky-700">
                              🔵{" "}
                              {bn
                                ? "সাহায্য করতে চান"
                                : "Want to help"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ADMIN PRIVACY NOTICE */}
        <section className="mt-8 rounded-3xl bg-[#092c25] p-6 text-white shadow-sm sm:p-8">
          <h2 className="text-xl font-black">
            ⚠️{" "}
            {bn
              ? "সাহায্যকারীর ব্যক্তিগত তথ্য Admin-এর কাছে গোপন থাকবে"
              : "Helper information remains private with Admin"}
          </h2>

          <p className="mt-3 text-sm leading-7 text-emerald-100/90">
            {bn
              ? "ভুক্তভোগী ও সাহায্য করতে আগ্রহী ব্যক্তির ব্যক্তিগত যোগাযোগের তথ্য Public Page-এ প্রকাশ করা হবে না। প্রয়োজন হলে Admin উভয় পক্ষের সঙ্গে যোগাযোগ করবেন এবং উভয়ের সম্মতি থাকলেই তাদের মধ্যে যোগাযোগের ব্যবস্থা করা হবে।"
              : "Private contact information of the person seeking help and the person offering help will not be displayed publicly. If necessary, Admin may contact both sides and arrange communication only with mutual consent."}
          </p>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6">
          <div className="text-sm font-black text-[#092c25]">
            🤝 {bn ? "প্রবাসীদের পাশে" : "Standing with expatriates"}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            {bn ? "প্রবাসীদের অভিযোগ" : "PROBASHIDER OVIJOG"}
          </p>

          <div className="mt-4 flex justify-center gap-5 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-emerald-700">
              {bn ? "হোম" : "Home"}
            </Link>

            <Link href="/submit" className="hover:text-emerald-700">
              {bn ? "অভিযোগ করুন" : "Submit Complaint"}
            </Link>

            <Link href="/search" className="hover:text-emerald-700">
              {bn ? "অভিযোগ খুঁজুন" : "Find Complaint"}
            </Link>
          </div>
        </div>
      </footer>

      {/* MOBILE NAV */}
      <nav className="sticky bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-5">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold text-slate-500"
          >
            <span className="text-lg">🏠</span>
            {bn ? "হোম" : "Home"}
          </Link>

          <Link
            href="/search"
            className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold text-slate-500"
          >
            <span className="text-lg">🔎</span>
            {bn ? "অভিযোগ খুঁজুন" : "search"}
          </Link>

          <Link
            href="/submit"
            className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold text-slate-500"
          >
            <span className="text-lg">📝</span>
            {bn ? "অভিযোগ করুন" : "Submit"}
          </Link>

          <Link
            href="/help"
            className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-black text-emerald-700"
          >
            <span className="text-lg">🤝</span>
            {bn ? "হেল্প চাই" : "Help"}
          </Link>

          <Link
            href="/stats"
            className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold text-slate-500"
          >
            <span className="text-lg">📊</span>
            {bn ? "পরিসংখ্যান" : "Stats"}
          </Link>
        </div>
      </nav>
    </main>
  );
}