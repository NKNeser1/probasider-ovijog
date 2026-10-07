"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  where,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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

  // 🌎 অন্যান্য দেশ
  "🇦🇫 আফগানিস্তান — Afghanistan",
  "🇦🇱 আলবেনিয়া — Albania",
  "🇩🇿 আলজেরিয়া — Algeria",
  "🇦🇩 অ্যান্ডোরা — Andorra",
  "🇦🇴 অ্যাঙ্গোলা — Angola",
  "🇦🇬 অ্যান্টিগুয়া ও বারবুডা — Antigua and Barbuda",
  "🇦🇷 আর্জেন্টিনা — Argentina",
  "🇦🇲 আর্মেনিয়া — Armenia",
  "🇦🇹 অস্ট্রিয়া — Austria",
  "🇦🇿 আজারবাইজান — Azerbaijan",

  "🇧🇸 বাহামাস — Bahamas",
  "🇧🇧 বার্বাডোস — Barbados",
  "🇧🇾 বেলারুশ — Belarus",
  "🇧🇪 বেলজিয়াম — Belgium",
  "🇧🇿 বেলিজ — Belize",
  "🇧🇯 বেনিন — Benin",
  "🇧🇹 ভুটান — Bhutan",
  "🇧🇴 বলিভিয়া — Bolivia",
  "🇧🇦 বসনিয়া ও হার্জেগোভিনা — Bosnia and Herzegovina",
  "🇧🇼 বতসোয়ানা — Botswana",
  "🇧🇷 ব্রাজিল — Brazil",
  "🇧🇬 বুলগেরিয়া — Bulgaria",
  "🇧🇫 বুরকিনা ফাসো — Burkina Faso",
  "🇧🇮 বুরুন্ডি — Burundi",

  "🇨🇻 কাবো ভার্দে — Cabo Verde",
  "🇰🇭 কম্বোডিয়া — Cambodia",
  "🇨🇲 ক্যামেরুন — Cameroon",
  "🇨🇫 মধ্য আফ্রিকান প্রজাতন্ত্র — Central African Republic",
  "🇹🇩 চাদ — Chad",
  "🇨🇱 চিলি — Chile",
  "🇨🇳 চীন — China",
  "🇨🇴 কলম্বিয়া — Colombia",
  "🇰🇲 কমোরোস — Comoros",
  "🇨🇬 কঙ্গো — Republic of the Congo",
  "🇨🇩 কঙ্গো গণতান্ত্রিক প্রজাতন্ত্র — Democratic Republic of the Congo",
  "🇨🇷 কোস্টারিকা — Costa Rica",
  "🇨🇮 কোত দিভোয়ার — Côte d'Ivoire",
  "🇭🇷 ক্রোয়েশিয়া — Croatia",
  "🇨🇺 কিউবা — Cuba",
  "🇨🇿 চেকিয়া — Czechia",

  "🇩🇯 জিবুতি — Djibouti",
  "🇩🇲 ডোমিনিকা — Dominica",
  "🇩🇴 ডোমিনিকান প্রজাতন্ত্র — Dominican Republic",

  "🇪🇨 ইকুয়েডর — Ecuador",
  "🇪🇬 মিশর — Egypt",
  "🇸🇻 এল সালভাদর — El Salvador",
  "🇬🇶 নিরক্ষীয় গিনি — Equatorial Guinea",
  "🇪🇷 ইরিত্রিয়া — Eritrea",
  "🇪🇪 এস্তোনিয়া — Estonia",
  "🇸🇿 এসওয়াতিনি — Eswatini",
  "🇪🇹 ইথিওপিয়া — Ethiopia",

  "🇫🇯 ফিজি — Fiji",

  "🇬🇦 গ্যাবন — Gabon",
  "🇬🇲 গাম্বিয়া — Gambia",
  "🇬🇪 জর্জিয়া — Georgia",
  "🇬🇭 ঘানা — Ghana",
  "🇬🇩 গ্রেনাডা — Grenada",
  "🇬🇹 গুয়াতেমালা — Guatemala",
  "🇬🇳 গিনি — Guinea",
  "🇬🇼 গিনি-বিসাউ — Guinea-Bissau",
  "🇬🇾 গায়ানা — Guyana",

  "🇭🇹 হাইতি — Haiti",
  "🇭🇳 হন্ডুরাস — Honduras",
  "🇭🇺 হাঙ্গেরি — Hungary",

  "🇮🇸 আইসল্যান্ড — Iceland",
  "🇮🇩 ইন্দোনেশিয়া — Indonesia",
  "🇮🇷 ইরান — Iran",

  "🇯🇲 জ্যামাইকা — Jamaica",

  "🇰🇿 কাজাখস্তান — Kazakhstan",
  "🇰🇪 কেনিয়া — Kenya",
  "🇰🇮 কিরিবাতি — Kiribati",
  "🇰🇵 উত্তর কোরিয়া — North Korea",
  "🇰🇬 কিরগিজস্তান — Kyrgyzstan",

  "🇱🇦 লাওস — Laos",
  "🇱🇻 লাটভিয়া — Latvia",
  "🇱🇸 লেসোথো — Lesotho",
  "🇱🇷 লাইবেরিয়া — Liberia",
  "🇱🇮 লিচেনস্টাইন — Liechtenstein",
  "🇱🇹 লিথুয়ানিয়া — Lithuania",
  "🇱🇺 লুক্সেমবার্গ",

  "🇲🇬 মাদাগাস্কার — Madagascar",
  "🇲🇼 মালাউই — Malawi",
  "🇲🇱 মালি — Mali",
  "🇲🇹 মাল্টা — Malta",
  "🇲🇭 মার্শাল দ্বীপপুঞ্জ — Marshall Islands",
  "🇲🇷 মৌরিতানিয়া — Mauritania",
  "🇲🇺 মরিশাস — Mauritius",
  "🇲🇽 মেক্সিকো — Mexico",
  "🇫🇲 মাইক্রোনেশিয়া — Micronesia",
  "🇲🇩 মলদোভা — Moldova",
  "🇲🇨 মোনাকো — Monaco",
  "🇲🇳 মঙ্গোলিয়া — Mongolia",
  "🇲🇪 মন্টেনেগ্রো — Montenegro",
  "🇲🇦 মরক্কো — Morocco",
  "🇲🇿 মোজাম্বিক — Mozambique",
  "🇲🇲 মিয়ানমার — Myanmar",

  "🇳🇦 নামিবিয়া — Namibia",
  "🇳🇷 নাউরু — Nauru",
  "🇳🇮 নিকারাগুয়া — Nicaragua",
  "🇳🇪 নাইজার — Niger",
  "🇳🇬 নাইজেরিয়া — Nigeria",
  "🇲🇰 উত্তর মেসিডোনিয়া — North Macedonia",

  "🇵🇼 পালাউ — Palau",
  "🇵🇸 ফিলিস্তিন — Palestine",
  "🇵🇦 পানামা — Panama",
  "🇵🇬 পাপুয়া নিউ গিনি — Papua New Guinea",
  "🇵🇾 প্যারাগুয়ে — Paraguay",
  "🇵🇪 পেরু — Peru",
  "🇵🇭 ফিলিপাইন — Philippines",

  "🇷🇼 রুয়ান্ডা — Rwanda",

  "🇰🇳 সেন্ট কিটস ও নেভিস — Saint Kitts and Nevis",
  "🇱🇨 সেন্ট লুসিয়া — Saint Lucia",
  "🇻🇨 সেন্ট ভিনসেন্ট ও গ্রেনাডাইনস — Saint Vincent and the Grenadines",
  "🇼🇸 সামোয়া — Samoa",
  "🇸🇲 সান মারিনো — San Marino",
  "🇸🇹 সাও টোমে ও প্রিন্সিপে — Sao Tome and Principe",
  "🇸🇳 সেনেগাল — Senegal",
  "🇷🇸 সার্বিয়া — Serbia",
  "🇸🇨 সেশেলস — Seychelles",
  "🇸🇱 সিয়েরা লিওন — Sierra Leone",
  "🇸🇰 স্লোভাকিয়া — Slovakia",
  "🇸🇮 স্লোভেনিয়া — Slovenia",
  "🇸🇧 সলোমন দ্বীপপুঞ্জ — Solomon Islands",
  "🇸🇴 সোমালিয়া — Somalia",
  "🇸🇸 দক্ষিণ সুদান — South Sudan",
  "🇸🇷 সুরিনাম — Suriname",
  "🇸🇾 সিরিয়া — Syria",

  "🇹🇯 তাজিকিস্তান — Tajikistan",
  "🇹🇿 তানজানিয়া — Tanzania",
  "🇹🇭 থাইল্যান্ড — Thailand",
  "🇹🇱 তিমুর-লেস্তে — Timor-Leste",
  "🇹🇬 টোগো — Togo",
  "🇹🇴 টোঙ্গা — Tonga",
  "🇹🇹 ত্রিনিদাদ ও টোবাগো — Trinidad and Tobago",
  "🇹🇳 তিউনিসিয়া — Tunisia",
  "🇹🇷 তুরস্ক — Türkiye",
  "🇹🇲 তুর্কমেনিস্তান — Turkmenistan",
  "🇹🇻 টুভালু — Tuvalu",

  "🇺🇬 উগান্ডা — Uganda",
  "🇺🇦 ইউক্রেন — Ukraine",
  "🇺🇾 উরুগুয়ে — Uruguay",
  "🇺🇿 উজবেকিস্তান — Uzbekistan",

  "🇻🇺 ভানুয়াতু — Vanuatu",
  "🇻🇦 ভ্যাটিকান সিটি — Vatican City",
  "🇻🇪 ভেনেজুয়েলা — Venezuela",
  "🇻🇳 ভিয়েতনাম — Vietnam",

  "🇾🇪 ইয়েমেন — Yemen",
  "🇿🇲 জাম্বিয়া — Zambia",
  "🇿🇼 জিম্বাবুয়ে — Zimbabwe"
];

const categories = [
  "পাসপোর্ট",
  "ভিসা",
  "রিক্রুটিং এজেন্সি",
  "দালাল / মধ্যস্বত্বভোগী",
  "চাকরি / নিয়োগ",
  "বেতন",
  "নিয়োগকর্তা",
  "ইকামা / রেসিডেন্সি",
  "বাসস্থান",
  "কর্মক্ষেত্র",
  "নির্যাতন / হয়রানি",
  "মেডিকেল / চিকিৎসা",
  "বিমানবন্দর / ভ্রমণ / ইমিগ্রেশন",
  "দেশে ফেরত আসা",
  "আর্থিক প্রতারণা",
  "অন্যান্য",
];

export default function SubmitComplaintPage() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [countrySearch, setCountrySearch] = useState("");
const [selectedCountry, setSelectedCountry] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showName, setShowName] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const bn = language === "bn";

  type Sponsor = {
  id: string;
  name?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  link?: string;
  active?: boolean;
  createdAt?: unknown;
};

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
  if (!currentSponsor) {
    return;
  }

  if (sortedSponsors.length <= 1) {
    return;
  }

  if (currentSponsor.mediaType !== "image") {
    return;
  }

  const timer = setTimeout(() => {
    setSponsorIndex(
      (previous) => (previous + 1) % sortedSponsors.length
    );
  }, 3000);

  return () => clearTimeout(timer);
}, [currentSponsor, sortedSponsors]);



const nextSponsorMedia = () => {
  if (sortedSponsors.length <= 1) {
    return;
  }

  setSponsorIndex(
    (previous) => (previous + 1) % sortedSponsors.length
  );
};

const previousSponsorMedia = () => {
  if (sortedSponsors.length <= 1) {
    return;
  }

  setSponsorIndex(
    (previous) =>
      (previous - 1 + sortedSponsors.length) %
      sortedSponsors.length
  );
};

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files) {
    return;
  }

  const selectedFiles = Array.from(event.target.files);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (selectedFiles.length > MAX_FILES) {
    alert(
      bn
        ? `সর্বোচ্চ ${MAX_FILES}টি ফাইল আপলোড করা যাবে।`
        : `You can upload a maximum of ${MAX_FILES} files.`
    );

    event.target.value = "";
    return;
  }

  const invalidFile = selectedFiles.find(
    (file) => !ALLOWED_FILE_TYPES.includes(file.type)
  );

  if (invalidFile) {
    alert(
      bn
        ? `"${invalidFile.name}" ফাইলের ধরন অনুমোদিত নয়। শুধু ছবি, ভিডিও, PDF বা DOC/DOCX ফাইল আপলোড করুন।`
        : `"${invalidFile.name}" is not an allowed file type. Please upload only images, videos, PDF, DOC, or DOCX files.`
    );

    event.target.value = "";
    return;
  }

  const oversizedFile = selectedFiles.find(
    (file) => file.size > MAX_FILE_SIZE
  );

  if (oversizedFile) {
    alert(
      bn
        ? `"${oversizedFile.name}" ফাইলটি 10 MB-এর বেশি। সর্বোচ্চ 10 MB-এর ফাইল আপলোড করা যাবে।`
        : `"${oversizedFile.name}" is larger than 10 MB. The maximum file size is 10 MB.`
    );

    event.target.value = "";
    return;
  }

  setFiles(selectedFiles);
};
  

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!accepted) {
      alert(
        bn
          ? "দয়া করে শর্তাবলি ও ঘোষণা গ্রহণ করুন।"
          : "Please accept the terms and declaration."
      );
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(form);

      const uploadedEvidence = [];
      
      

for (const file of files) {
  const uploadData = new FormData();

  uploadData.append("file", file);
  uploadData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  if (!uploadResponse.ok) {
  const errorText = await uploadResponse.text();

  console.error(
    "Cloudinary upload error:",
    errorText
  );

  throw new Error(
    `Evidence upload failed: ${errorText}`
  );
}
  const uploadResult = await uploadResponse.json();

  uploadedEvidence.push({
    name: file.name,
    url: uploadResult.secure_url,
    type: file.type,
    size: file.size,
    publicId: uploadResult.public_id,
  });
}

      const complaintId = `PRB-${new Date().getFullYear()}-${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`;

      const complaintData = {
        complaintNumber: complaintId,

        country: formData.get("country")?.toString() || "",
        city: formData.get("city")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        company: formData.get("company")?.toString() || "",

        title: formData.get("title")?.toString() || "",
        details: formData.get("details")?.toString() || "",

        amount: formData.get("amount")?.toString() || "",
        incidentDate:
          formData.get("incidentDate")?.toString() || "",

        anonymous,

        name: anonymous
          ? ""
          : formData.get("name")?.toString() || "",

        showName: anonymous ? false : showName,

        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",

        evidenceCount: files.length,
        evidence: uploadedEvidence,

                // Complaint interaction counters
        views: 0,
        truthVotes: 0,
        falseVotes: 0,
        commentCount: 0,

        status: "published",

        createdAt: serverTimestamp(),

      };

      await addDoc(
        collection(db, "complaints"),
        complaintData
      );
window.location.href = `/success?complaint=${encodeURIComponent(complaintId)}`;
      alert(
        bn
          ? `অভিযোগ সফলভাবে জমা হয়েছে।\n\nআপনার অভিযোগ নম্বর:\n${complaintId}\n\nএই নম্বরটি কপি করে নিরাপদে সংরক্ষণ করুন।`
          : `Complaint submitted successfully.\n\nYour complaint number:\n${complaintId}\n\nPlease copy and save this number safely.`
      );

      form.reset();

      setFiles([]);
      setAnonymous(true);
      setShowName(false);
      setAccepted(false);
    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      alert(
        bn
          ? "দুঃখিত, অভিযোগ জমা দেওয়া যায়নি।\n\nআবার চেষ্টা করুন।"
          : "Sorry, the complaint could not be submitted.\n\nPlease try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-[#17211d]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-[#08251d]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              ⚖️
            </div>

            <div>
              <h1 className="text-base font-bold leading-tight sm:text-lg">
                {bn
                  ? "প্রবাসীদের অভিযোগ"
                  : "PROBASHIDER OVIJOG"}
              </h1>

              <p className="text-[11px] text-emerald-200 sm:text-xs">
                {bn
                  ? "আপনার কথা, আপনার অধিকার"
                  : "Your Voice, Your Rights"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() =>
              setLanguage(bn ? "en" : "bn")
            }
            className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20"
          >
            {bn ? "English" : "বাংলা"}
          </button>
        </div>
      </header>

      {/* Page Heading */}
      <section className="bg-[#08251d] px-4 pb-10 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm text-emerald-200 transition hover:text-white"
          >
            ← {bn ? "হোমে ফিরে যান" : "Back to Home"}
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-medium text-emerald-100">
            📝{" "}
            {bn
              ? "অভিযোগ জমা দিন"
              : "Submit a Complaint"}
          </div>

          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            {bn
              ? "আপনার সমস্যার কথা বলুন"
              : "Tell Us About Your Problem"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/80 sm:text-base">
            {bn
              ? "আপনার অভিযোগ পরিষ্কারভাবে লিখুন। প্রয়োজন হলে প্রমাণ সংযুক্ত করুন এবং ব্যক্তিগত তথ্য প্রকাশের আগে সতর্ক থাকুন।"
              : "Describe your complaint clearly. Add evidence if necessary and be careful before publishing any personal information."}
          </p>
        </div>
      </section>

            {/* SPONSOR CARD */}
<section className="mx-auto max-w-3xl px-4 pt-6">
  <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-[#07101f] shadow-lg">

    {/* Sponsor Name + View Button */}
    <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
      
      {/* Sponsor Name */}
      <div className="rounded-2xl bg-black/75 px-4 py-3 text-white shadow-lg backdrop-blur-md">
        <p className="text-sm font-black sm:text-base">
          {currentSponsor?.name || "Sponsor"}
        </p>
      </div>

      {/* View Button */}
      {currentSponsor?.link ? (
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
          {bn ? "Sponsor" : "Sponsor"}
        </div>
      )}
    </div>

    {/* Sponsor Media */}
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
          <img
            key={currentSponsor.id}
            src={currentSponsor.mediaUrl}
            alt={currentSponsor.name || "Sponsor"}
            className="block max-h-[75vh] w-full object-contain"
          />
        )}

        {/* Previous */}
        {sortedSponsors.length > 1 && (
          <button
            type="button"
            onClick={previousSponsorMedia}
            aria-label={bn ? "আগের স্পন্সর" : "Previous sponsor"}
            className="absolute bottom-5 left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-2xl font-black text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 active:scale-95"
          >
            ←
          </button>
        )}

        {/* Next */}
        {sortedSponsors.length > 1 && (
          <button
            type="button"
            onClick={nextSponsorMedia}
            aria-label={bn ? "পরের স্পন্সর" : "Next sponsor"}
            className="absolute bottom-5 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-2xl font-black text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 active:scale-95"
          >
            →
          </button>
        )}

        {/* Counter */}
        {sortedSponsors.length > 1 && (
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/75 px-5 py-2 text-sm font-black text-white backdrop-blur-md">
            {sponsorIndex + 1} / {sortedSponsors.length}
          </div>
        )}
      </div>
    ) : (
      /* No Active Sponsor */
      <div className="flex min-h-[220px] items-center justify-center px-5 py-12 text-center">
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

      {/* Important Notice */}
      <section className="mx-auto mt-6 max-w-3xl px-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-md">
          <div className="flex gap-3">
            <div className="text-2xl">⚠️</div>

            <div>
              <h3 className="font-bold text-amber-900">
                {bn
                  ? "গুরুত্বপূর্ণ সতর্কতা"
                  : "Important Warning"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                {bn
                  ? "অভিযোগ প্রকাশ করা মানেই অভিযোগটি সত্য বা যাচাই করা হয়েছে—এমন নয়। এটি অভিযোগকারীর বক্তব্য হিসেবে প্রকাশিত হবে।"
                  : "Publishing a complaint does not mean that the complaint is true or verified. It is published as the complainant's statement."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-4 py-8 pb-28">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                01
              </p>

              <h3 className="mt-1 text-xl font-black">
                {bn
                  ? "অভিযোগের তথ্য"
                  : "Complaint Information"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {bn
                  ? "আপনার সমস্যাটি কোন দেশ ও বিভাগের সাথে সম্পর্কিত তা জানান।"
                  : "Tell us which country and category your complaint belongs to."}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn ? "দেশ" : "Country"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
  <input
    id="country"
    type="text"
    value={countrySearch}
    onChange={(e) => {
      setCountrySearch(e.target.value);
      setSelectedCountry("");
    }}
    placeholder={
      bn
        ? "দেশের নাম লিখুন..."
        : "Type country name..."
    }
    autoComplete="off"
    required
    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
  />

  {/* Search results */}
  {!selectedCountry &&
    countrySearch.trim() !== "" && (
      <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
        {countries
          .filter((country) =>
            country
              .toLowerCase()
              .includes(countrySearch.toLowerCase())
          )
          .slice(0, 10)
          .map((country) => (
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

        {countries.filter((country) =>
          country
            .toLowerCase()
            .includes(countrySearch.toLowerCase())
        ).length === 0 && (
          <div className="px-4 py-4 text-center text-sm text-gray-500">
            {bn
              ? "কোনো দেশ পাওয়া যায়নি"
              : "No country found"}
          </div>
        )}
      </div>
    )}
</div>

<input
  type="hidden"
  name="country"
  value={selectedCountry}
/>
                
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "শহর / এলাকা"
                    : "City / Area"}
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder={
                    bn
                      ? "যেমন: রিয়াদ"
                      : "e.g. Riyadh"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Category */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "অভিযোগের বিভাগ"
                    : "Complaint Category"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    {bn
                      ? "বিভাগ নির্বাচন করুন"
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "ব্যক্তি / কোম্পানি / এজেন্সির নাম"
                    : "Person / Company / Agency Name"}
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder={
                    bn
                      ? "যার বিরুদ্ধে অভিযোগ"
                      : "Name of the person or organization"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "অভিযোগের শিরোনাম"
                    : "Complaint Title"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={150}
                  placeholder={
                    bn
                      ? "সংক্ষেপে আপনার অভিযোগের বিষয় লিখুন"
                      : "Briefly describe your complaint"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                02
              </p>

              <h3 className="mt-1 text-xl font-black">
                {bn
                  ? "বিস্তারিত অভিযোগ"
                  : "Complaint Details"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {bn
                  ? "ঘটনাটি কীভাবে ঘটেছে তা যতটা সম্ভব পরিষ্কারভাবে লিখুন।"
                  : "Describe what happened as clearly as possible."}
              </p>
            </div>

            <div className="space-y-5">
              {/* Details */}
              <div>
                <label
                  htmlFor="details"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "ঘটনার বিস্তারিত"
                    : "Detailed Description"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="details"
                  name="details"
                  required
                  rows={8}
                  maxLength={5000}
                  placeholder={
                    bn
                      ? "কী ঘটেছে, কখন ঘটেছে, কার সাথে ঘটেছে এবং আপনি কী সমস্যার সম্মুখীন হয়েছেন—বিস্তারিত লিখুন..."
                      : "Explain what happened, when it happened, who was involved, and what problem you faced..."
                  }
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-bold"
                  >
                    {bn
                      ? "আর্থিক ক্ষতির পরিমাণ"
                      : "Financial Loss Amount"}
                  </label>

                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder={
                      bn
                        ? "যেমন: ৫০,০০০ টাকা"
                        : "e.g. BDT 50,000"
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="incidentDate"
                    className="mb-2 block text-sm font-bold"
                  >
                    {bn
                      ? "ঘটনার তারিখ"
                      : "Incident Date"}
                  </label>

                  <input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                03
              </p>

              <h3 className="mt-1 text-xl font-black">
                {bn
                  ? "প্রমাণ সংযুক্ত করুন"
                  : "Add Evidence"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {bn
                  ? "প্রমাণ দেওয়া ঐচ্ছিক। আপনার কাছে থাকা প্রাসঙ্গিক ছবি, ভিডিও বা ডকুমেন্ট দিতে পারেন।"
                  : "Evidence is optional. You can add relevant images, videos, or documents."}
              </p>
            </div>

            {/* Privacy Warning */}
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <div className="text-xl">🔒</div>

                <div>
                  <h4 className="font-bold text-red-800">
                    {bn
                      ? "ব্যক্তিগত তথ্য প্রকাশ করবেন না"
                      : "Do not publish private information"}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    {bn
                      ? "পাসপোর্ট নম্বর, জাতীয় পরিচয়পত্র, ব্যাংক/কার্ডের তথ্য, OTP, পাসওয়ার্ড, ব্যক্তিগত ঠিকানা বা অন্য কোনো সংবেদনশীল তথ্য থাকা প্রমাণ আপলোড করার আগে অবশ্যই মুছে বা ঢেকে দিন।"
                      : "Before uploading evidence, remove or hide passport numbers, national ID numbers, bank/card details, OTPs, passwords, private addresses, or other sensitive information."}
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <label
              htmlFor="evidence"
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                📎
              </div>

              <h4 className="font-bold text-gray-800">
                {bn
                  ? "প্রমাণ নির্বাচন করতে এখানে চাপুন"
                  : "Tap here to select evidence"}
              </h4>

              <p className="mt-2 text-xs text-gray-500">
                {bn
                  ? "ছবি, ভিডিও, PDF বা ডকুমেন্ট"
                  : "Images, videos, PDF or documents"}
              </p>

              <input
                id="evidence"
                name="evidence"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-sm font-bold text-gray-700">
                  {bn
                    ? `${files.length}টি ফাইল নির্বাচিত`
                    : `${files.length} file(s) selected`}
                </p>

                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="text-lg">📄</div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-700">
                          {file.name}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFile(index)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      {bn ? "মুছুন" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                04
              </p>

              <h3 className="mt-1 text-xl font-black">
                {bn
                  ? "আপনার পরিচয়"
                  : "Your Identity"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {bn
                  ? "আপনি চাইলে আপনার নাম প্রকাশ করতে পারেন।"
                  : "You can choose whether your name is publicly displayed."}
              </p>
            </div>

            <div className="space-y-4">
              {/* Anonymous */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => {
                    setAnonymous(
                      e.target.checked
                    );

                    if (e.target.checked) {
                      setShowName(false);
                    }
                  }}
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />

                <div>
                  <p className="text-sm font-bold">
                    {bn
                      ? "বেনামে অভিযোগ করতে চাই"
                      : "Submit anonymously"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {bn
                      ? "আপনার নাম অভিযোগের সাথে প্রকাশ করা হবে না।"
                      : "Your name will not be publicly displayed with the complaint."}
                  </p>
                </div>
              </label>

              {!anonymous && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold"
                  >
                    {bn
                      ? "আপনার নাম"
                      : "Your Name"}
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={
                      bn
                        ? "আপনার নাম লিখুন"
                        : "Enter your name"
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />

                  <label className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={showName}
                      onChange={(e) =>
                        setShowName(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 accent-emerald-700"
                    />

                    {bn
                      ? "আমি চাই আমার নাম প্রকাশ করা হোক"
                      : "I want my name to be publicly displayed"}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                05
              </p>

              <h3 className="mt-1 text-xl font-black">
                {bn
                  ? "যোগাযোগের তথ্য"
                  : "Contact Information"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {bn
                  ? "এটি ঐচ্ছিক। আপনার যোগাযোগের তথ্য প্রকাশ করা হবে না।"
                  : "Optional. Your contact information will not be publicly displayed."}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn ? "ইমেইল" : "Email"}
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold"
                >
                  {bn
                    ? "মোবাইল নম্বর"
                    : "Mobile Number"}
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={
                    bn ? "ঐচ্ছিক" : "Optional"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <input
                id="accepted"
                type="checkbox"
                checked={accepted}
                onChange={(e) =>
                  setAccepted(e.target.checked)
                }
                className="mt-1 h-5 w-5 accent-emerald-700"
              />

              <label
                htmlFor="accepted"
                className="cursor-pointer"
              >
                <p className="text-sm font-bold text-emerald-950">
                  {bn
                    ? "আমি ঘোষণা করছি যে উপরের তথ্য আমার জ্ঞাতসারে সঠিক।"
                    : "I declare that the information above is accurate to the best of my knowledge."}
                </p>

                <p className="mt-2 text-xs leading-5 text-emerald-800">
                  {bn
                    ? "আমি বুঝতে পারছি যে আমার অভিযোগ একটি প্রকাশ্য প্ল্যাটফর্মে প্রকাশিত হতে পারে এবং মিথ্যা, বিভ্রান্তিকর বা বেআইনি তথ্য প্রকাশ করা উচিত নয়।"
                    : "I understand that my complaint may be published on a public platform and that I should not submit false, misleading, or unlawful information."}
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#087443] px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#065d35] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              {submitting ? "⏳" : "🚀"}
            </span>

            {submitting
              ? bn
                ? "অভিযোগ জমা হচ্ছে..."
                : "Submitting..."
              : bn
                ? "অভিযোগ জমা দিন"
                : "Submit Complaint"}

            {!submitting && (
              <span className="transition group-hover:translate-x-1">
                →
              </span>
            )}
          </button>

          <p className="text-center text-xs leading-5 text-gray-500">
            {bn
              ? "অভিযোগ জমা দেওয়ার পর আপনার জন্য একটি ইউনিক অভিযোগ নম্বর তৈরি হবে।"
              : "After submission, a unique complaint number will be generated for you."}
          </p>
        </form>
      </section>

     {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-1.5 py-2 shadow-2xl backdrop-blur-xl sm:hidden">

        <div className="grid grid-cols-5 gap-1">

          <Link
            href="/"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-emerald-700"
          >
            🏠
            <span className="mt-1 block">
              {bn ? "হোম" : "Home"}
            </span>
          </Link>


          <Link
            href="/search"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            🔎
            <span className="mt-1 block">
              {bn ? "অভিযোগ খুঁজুন" : "Search"}
            </span>
          </Link>


          <Link
            href="/submit"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            📝
            <span className="mt-1 block">
              {bn ? "অভিযোগ করুন " : "Submit"}
            </span>
          </Link>


          {/* HELP */}
          <Link
            href="/help"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            🤝
            <span className="mt-1 block">
              {bn ? "হেল্প চাই" : "Need Help"}
            </span>
          </Link>


          <Link
            href="/stats"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            📊
            <span className="mt-1 block">
              {bn ? "পরিসংখ্যান" : "Stats"}
            </span>
          </Link>

        </div>

      </div>

    </main>
  );
}