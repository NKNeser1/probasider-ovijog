"use client";

import { WelcomeIntro } from "@/components/WelcomeIntro";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Complaint = {
  country?: string;
  city?: string;
};

type Sponsor = {
  id: string;
  name?: string;
  mediaUrl?: string;
  mediaType?: string;
  link?: string;
  startAt?: string;
  endAt?: string;
  numberAt?: string;
  active?: boolean;
  createdAt?: string;
};

export default function Home() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const bn = language === "bn";

  const [totalComplaints, setTotalComplaints] = useState(0);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);

  /*
   * ============================================================
   * COMPLAINTS
   * ============================================================
   */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "complaints"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          ...item.data(),
        })) as Complaint[];

        setComplaints(data);
        setTotalComplaints(snapshot.size);
      },
      (error) => {
        console.error("Complaints error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * ============================================================
   * SPONSORS
   * ============================================================
   */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sponsors"),
      (snapshot) => {
        const now = new Date();

        const data = snapshot.docs
          .map((item) => {
            const raw = item.data();

            return {
              id: item.id,
              ...raw,
            } as Sponsor;
          })
          .filter((sponsor) => {
            /*
             * Media না থাকলে দেখাবে না
             */
            if (!sponsor.mediaUrl) {
              return false;
            }

            /*
             * active false হলে দেখাবে না।
             *
             * active field না থাকলেও Sponsor দেখাবে।
             */
            if (sponsor.active === false) {
              return false;
            }

            /*
             * Start date
             */
            if (sponsor.startAt) {
              const start = new Date(sponsor.startAt);

              if (!Number.isNaN(start.getTime()) && now < start) {
                return false;
              }
            }

            /*
             * End date
             */
            if (sponsor.endAt) {
              const end = new Date(sponsor.endAt);

              if (!Number.isNaN(end.getTime()) && now > end) {
                return false;
              }
            }

            return true;
          })
          .sort((a, b) => {
            const getCreatedTime = (   value: string | number | { seconds?: number } | null | undefined, ) => {
              
              if (
  typeof value === "object" &&
  value !== null &&
  "seconds" in value &&
  typeof value.seconds === "number"
) {
  return value.seconds * 1000;
}
              if (typeof value === "string") {
                const time = Date.parse(value);

                return Number.isNaN(time) ? 0 : time;
              }

              if (value instanceof Date) {
                return value.getTime();
              }

              return 0;
            };

            return (
              getCreatedTime(a.createdAt) -
              getCreatedTime(b.createdAt)
            );
          });

        setSponsors(data);
      },
      (error) => {
        console.error("Sponsors error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * ============================================================
   * UNIQUE COUNTS
   * ============================================================
   */

  const countryCount = useMemo(() => {
    const countries = new Set(
      complaints
        .map((item) => item.country?.trim().toLowerCase())
        .filter(Boolean)
    );

    return countries.size;
  }, [complaints]);

  const cityCount = useMemo(() => {
    const cities = new Set(
      complaints
        .map((item) => item.city?.trim().toLowerCase())
        .filter(Boolean)
    );

    return cities.size;
  }, [complaints]);

  /*
   * ============================================================
   * SPONSOR NAVIGATION
   * ============================================================
   */

  const currentSponsor = sponsors[sponsorIndex];

  /*
   * Sponsor video কিনা নির্ধারণ
   *
   * Admin-এর mediaType video হলে video।
   * Cloudinary video URL হলেও video হিসেবে ধরবে।
   */

  const isVideoSponsor = (sponsor?: Sponsor) => {
    if (!sponsor) {
      return false;
    }

    const mediaType = String(
      sponsor.mediaType || ""
    ).toLowerCase();

    if (mediaType.includes("video")) {
      return true;
    }

    const urlBase = sponsor.mediaUrl || "";

    return (
      
      /\/video\/upload\//i.test(urlBase) ||
/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(urlBase)
    );
  };

  const goToNextSponsor = useCallback(() => {
  if (sponsors.length === 0) {
    return;
  }

  setSponsorIndex((previous) => {
    if (previous >= sponsors.length - 1) {
      return 0;
    }

    return previous + 1;
  });
}, [sponsors.length]);

  const goToPreviousSponsor = () => {
    if (sponsors.length === 0) {
      return;
    }

    setSponsorIndex((previous) => {
      if (previous <= 0) {
        return sponsors.length - 1;
      }

      return previous - 1;
    });
  };

  /*
   * Sponsor list পরিবর্তন হলে index ঠিক রাখা
   */

  

  /*
   * ============================================================
   * IMAGE AUTO CHANGE
   *
   * Image = প্রতি ৩ সেকেন্ডে পরবর্তী Sponsor
   * Video = video শেষ হলে onEnded থেকে পরবর্তী Sponsor
   * ============================================================
   */

  useEffect(() => {
    if (!currentSponsor) {
      return;
    }

    /*
     * Video হলে timer চলবে না।
     * Video নিজে শেষ হলে onEnded দিয়ে next হবে।
     */
    if (isVideoSponsor(currentSponsor)) {
      return;
    }

    const timer = window.setTimeout(() => {
      goToNextSponsor();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentSponsor, goToNextSponsor]);

  

  return (

    <>
  <WelcomeIntro />
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-xl text-white shadow-lg shadow-emerald-700/20">
              ⚖️
            </div>

            <div>
              <h1 className="text-base font-bold sm:text-lg">
                {bn ? "প্রবাসীদের অভিযোগ" : "Expatriates' Complaints"}
              </h1>

              <p className="text-[10px] text-slate-500 sm:text-xs">
                {bn ? "আপনার কথা, আপনার অধিকার" : "Your Voice, Your Rights"}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setLanguage(bn ? "en" : "bn")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 sm:px-4"
            >
              {bn ? "English" : "বাংলা"}
            </button>

            <Link
              href="/submit"
              className="hidden rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 sm:block"
            >
              {bn ? "অভিযোগ করুন" : "Submit Complaint"}
            </Link>

          </div>
        </div>
      </header>


      {/* HERO */}
      <section className="relative overflow-hidden bg-[#092c25]">

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-emerald-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              {bn
                ? "প্রবাসীদের জন্য একটি উন্মুক্ত অভিযোগ প্ল্যাটফর্ম"
                : "An open complaint platform for expatriates"}
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

              {bn ? (
                <>
                  প্রবাসে আপনার সমস্যার
                  <span className="mt-2 block text-emerald-300">
                    কথা বলুন
                  </span>
                </>
              ) : (
                <>
                  Speak up about your
                  <span className="mt-2 block text-emerald-300">
                    problems abroad
                  </span>
                </>
              )}

            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {bn
                ? "পাসপোর্ট, ভিসা, চাকরি, বেতন, নিয়োগকর্তা, দালাল বা বিদেশে জীবনের যেকোনো অনিয়মের অভিজ্ঞতা তুলে ধরুন।"
                : "Share your experience about passport, visa, employment, salary, employers, brokers, or other problems faced abroad."}
            </p>


            {/* MAIN ACTIONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* SUBMIT */}
              <Link
                href="/submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-bold text-emerald-950 shadow-xl hover:bg-emerald-300"
              >
                📝 {bn ? "অভিযোগ জমা দিন" : "Submit a Complaint"}
              </Link>


              {/* SEARCH */}
              <div className="flex flex-1 flex-col rounded-2xl border border-white/15 bg-[#0b3b31] p-3 shadow-lg">

                <div className="mb-2 px-1 text-xs font-semibold text-emerald-100">
                  {bn
                    ? "অভিযোগ নম্বর দিয়ে অভিযোগ খুঁজুন"
                    : "Find your complaint"}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <input
                    type="text"
                    placeholder={
                      bn
                        ? "যেমন: PRB-2026-000125"
                        : "e.g. PRB-2026-000125"
                    }
                    className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white/15"
                  />

                  <Link
                    href="/search"
                    className="flex h-11 items-center justify-center rounded-xl bg-emerald-400 px-5 text-xs font-extrabold text-emerald-950 transition hover:bg-emerald-300"
                  >
                    {bn ? "খুঁজুন" : "Search"}
                  </Link>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* HELP CARD */}
      <section className="relative z-10 -mt-7 px-4">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-900/20 bg-[#0b3b31] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">

          <div className="relative">

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="max-w-2xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-2xl">
                    🤝
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                      {bn ? "EXPAT HELP" : "EXPAT HELP"}
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                      {bn ? "হেল্প চাই" : "Need Help"}
                    </h3>
                  </div>

                </div>

                <p className="mt-4 text-sm leading-7 text-emerald-50/80 sm:text-base">
                  {bn
                    ? "আপনার সমস্যার কথা জানান, অভিজ্ঞ প্রবাসীদের কাছ থেকে পরামর্শ ও সহায়তার পথ খুঁজে নিন।"
                    : "Share your problem and find advice and possible support from experienced expatriates."}
                </p>

              </div>


              <Link
                href="/help"
                className="relative flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:bg-emerald-300"
              >
                🤝 {bn ? "হেল্প চাই" : "Need Help"}
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          SPONSOR / CLIENT
          ============================================================ */}

      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {currentSponsor ? (

            <div className="relative w-full overflow-hidden bg-slate-950">

              {/* MEDIA */}

              {isVideoSponsor(currentSponsor) ? (

                <div className="relative w-full">

                  <video
                    key={currentSponsor.id}
                    src={currentSponsor.mediaUrl}
                    autoPlay
                    muted={videoMuted}
                    playsInline
                    controls
                    onEnded={goToNextSponsor}
                    className="block h-auto max-h-[500px] min-h-[180px] w-full object-contain"
                  />

                  {/* MUTE / UNMUTE BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setVideoMuted((previous) => !previous)
                    }
                    aria-label={
                      videoMuted
                        ? "Unmute video"
                        : "Mute video"
                    }
                    className="absolute bottom-4 right-16 z-10 flex h-10 min-w-10 items-center justify-center rounded-full bg-black/65 px-3 text-sm font-bold text-white backdrop-blur transition hover:bg-black/85"
                  >
                    {videoMuted ? "🔇" : "🔊"}
                  </button>

                </div>

              ) : (
/* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentSponsor.id}
                  src={currentSponsor.mediaUrl}
                  alt={currentSponsor.name || "Sponsor"}
                  className="block h-auto max-h-[500px] min-h-[180px] w-full object-contain"
                />

              )}


              {/* PREVIOUS / NEXT CONTROLS */}

              {sponsors.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousSponsor}
                    aria-label={
                      bn
                        ? "আগের Sponsor"
                        : "Previous sponsor"
                    }
                    className="absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl font-bold text-white backdrop-blur transition hover:bg-black/80"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={goToNextSponsor}
                    aria-label={
                      bn
                        ? "পরের Sponsor"
                        : "Next sponsor"
                    }
                    className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl font-bold text-white backdrop-blur transition hover:bg-black/80"
                  >
                    →
                  </button>
                </>
              )}


              {/* SPONSOR INFO */}

              <div className="absolute left-3 top-3 z-10 rounded-xl bg-black/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md sm:left-4 sm:top-4">

                {currentSponsor.name || "Sponsor"}

              </div>


              {/* SPONSOR LINK */}

              {currentSponsor.link && (
                <a
                  href={currentSponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-3 z-10 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-bold text-emerald-950 shadow-lg transition hover:bg-emerald-300 sm:right-4 sm:top-4"
                >
                  {bn ? "দেখুন" : "Visit"}
                </a>
              )}


              {/* MEDIA POSITION */}

              {sponsors.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                  {sponsorIndex + 1} / {sponsors.length}
                </div>
              )}

            </div>

          ) : (

            /* NO SPONSOR */

            <div className="flex min-h-[120px] w-full items-center justify-center bg-slate-50 px-6 py-8 sm:min-h-[150px]">

              <div className="text-center">

                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Sponsor / Client
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {bn
                    ? "স্পনসর বা ক্লায়েন্ট কনটেন্ট এখানে প্রদর্শিত হবে"
                    : "Sponsor or client content will appear here"}
                </p>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {[
            [
              totalComplaints.toString(),
              bn ? "মোট অভিযোগ" : "Total Complaints",
            ],
            [
              countryCount.toString(),
              bn ? "দেশ" : "Countries",
            ],
            [
              cityCount.toString(),
              bn ? "বিভাগ" : "Locations",
            ],
            [
              "২৪/৭",
              bn ? "উন্মুক্ত প্ল্যাটফর্ম" : "Open Platform",
            ],
          ].map(([number, label]) => (

            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="text-2xl font-extrabold text-emerald-700 sm:text-3xl">
                {number}
              </div>

              <div className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
                {label}
              </div>
            </div>

          ))}

        </div>
      </section>


      {/* HOW TO COMPLAIN */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <span className="text-sm font-bold text-emerald-700">
              {bn ? "কিভাবে অভিযোগ করবেন?" : "HOW TO COMPLAIN"}
            </span>

            <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {bn ? "সহজভাবে দেখে নিন" : "See how easy it is"}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {bn
                ? "মাত্র কয়েকটি সহজ ধাপে আপনার অভিযোগ জমা দিতে পারবেন।"
                : "Submit your complaint in just a few simple steps."}
            </p>

          </div>


          <div className="mt-10 grid gap-6 lg:grid-cols-2">


            {/* CARD 1 */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f7faf8] shadow-sm">

              <div className="bg-[#092c25] p-6 text-white sm:p-8">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                      STEP BY STEP
                    </p>

                    <h4 className="mt-2 text-2xl font-extrabold">
                      {bn ? "অভিযোগ করার নিয়ম" : "How to submit"}
                    </h4>
                  </div>

                  <div className="text-4xl">
                    📖
                  </div>

                </div>

              </div>


              <div className="p-6 sm:p-8">

                <div className="space-y-5">

                  {/* STEP 1 */}
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-extrabold text-emerald-700">
                      01
                    </div>

                    <div>
                      <h5 className="font-bold">
                        {bn ? "অভিযোগ লিখুন" : "Write your complaint"}
                      </h5>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {bn
                          ? "আপনার সমস্যার বিস্তারিত তথ্য সহজ ভাষায় লিখুন।"
                          : "Describe your problem clearly in your own words."}
                      </p>
                    </div>

                  </div>


                  {/* STEP 2 */}
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 font-extrabold text-blue-700">
                      02
                    </div>

                    <div className="flex-1">

                      <h5 className="font-bold">
                        {bn ? "প্রমাণ এড করুন" : "Add evidence"}
                      </h5>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {bn
                          ? "প্রয়োজনে ছবি, নথি, রসিদ, চ্যাট, ভিডিও বা অন্যান্য প্রমাণ যুক্ত করুন।"
                          : "Optionally add screenshots, documents, receipts, chats, videos or other evidence."}
                      </p>

                      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

                        <div className="flex gap-3">

                          <span className="text-lg">
                            ⚠️
                          </span>

                          <p className="text-xs font-semibold leading-5 text-amber-900">
                            {bn
                              ? "আপনার ব্যক্তিগত সকল তথ্য বাদ দিয়ে প্রমাণ আপলোড করুন।"
                              : "Remove all personal information before uploading evidence."}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* STEP 3 */}
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 font-extrabold text-purple-700">
                      03
                    </div>

                    <div>

                      <h5 className="font-bold">
                        {bn ? "অভিযোগ সাবমিট করুন" : "Submit your complaint"}
                      </h5>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {bn
                          ? "সব তথ্য ঠিক আছে কিনা দেখে অভিযোগটি জমা দিন।"
                          : "Review your information and submit the complaint."}
                      </p>

                    </div>

                  </div>


                  {/* STEP 4 */}
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 font-extrabold text-rose-700">
                      04
                    </div>

                    <div>

                      <h5 className="font-bold">
                        {bn
                          ? "অভিযোগ নম্বর কপি করে রাখুন"
                          : "Copy your complaint number"}
                      </h5>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {bn
                          ? "সাবমিট করার পর পাওয়া ইউনিক অভিযোগ নম্বরটি অবশ্যই সংরক্ষণ করুন।"
                          : "Save the unique complaint number you receive after submission."}
                      </p>

                    </div>

                  </div>

                </div>


                {/* VISUAL GUIDE */}
                <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">

                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">

                    <span>✍️ {bn ? "লিখুন" : "Write"}</span>

                    <span>→</span>

                    <span>📎 {bn ? "প্রমাণ" : "Evidence"}</span>

                    <span>→</span>

                    <span>🚀 {bn ? "সাবমিট" : "Submit"}</span>

                    <span>→</span>

                    <span>🔢 {bn ? "নম্বর" : "Number"}</span>

                  </div>

                </div>

              </div>
            </div>


            {/* CARD 2 */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0b3b31] p-7 text-white shadow-xl sm:p-9">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-3xl">
                  📝
                </div>

                <h4 className="mt-7 text-3xl font-extrabold">
                  {bn ? "সরাসরি অভিযোগ করুন" : "Submit a complaint"}
                </h4>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                  {bn
                    ? "আপনার সমস্যা বা অভিজ্ঞতা আমাদের প্ল্যাটফর্মে তুলে ধরুন। কোনো সাধারণ অ্যাকাউন্ট খোলার প্রয়োজন নেই।"
                    : "Share your problem or experience on our platform. No regular user account is required."}
                </p>

                <div className="mt-8 space-y-3">

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      ✓
                    </span>

                    <span className="text-sm font-medium">
                      {bn ? "অ্যাকাউন্ট ছাড়াই অভিযোগ করুন" : "Submit without an account"}
                    </span>

                  </div>


                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      ✓
                    </span>

                    <span className="text-sm font-medium">
                      {bn ? "প্রমাণ চাইলে যুক্ত করুন" : "Add evidence if available"}
                    </span>

                  </div>


                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      ✓
                    </span>

                    <span className="text-sm font-medium">
                      {bn ? "ইউনিক অভিযোগ নম্বর পান" : "Receive a unique complaint number"}
                    </span>

                  </div>

                </div>


                <Link
                  href="/submit"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-extrabold text-emerald-950 transition hover:bg-emerald-300"
                >
                  📝 {bn ? "এখনই অভিযোগ করুন" : "Submit Now"}
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* CATEGORIES */}
      <section className="bg-[#f7f9f8] py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <span className="text-sm font-bold text-emerald-700">
                {bn ? "অভিযোগের ধরন" : "COMPLAINT CATEGORIES"}
              </span>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                {bn ? "কোন বিষয়ে অভিযোগ?" : "What is your complaint about?"}
              </h3>

            </div>

            <Link
              href="/search"
              className="text-sm font-bold text-emerald-700"
            >
              {bn ? "সব অভিযোগ দেখুন →" : "View all complaints →"}
            </Link>

          </div>


          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

            {[
              ["📘", bn ? "পাসপোর্ট" : "Passport"],
              ["🛂", bn ? "ভিসা" : "Visa"],
              ["🏢", bn ? "রিক্রুটিং এজেন্সি" : "Recruiting Agency"],
              ["👤", bn ? "দালাল / মধ্যস্থতাকারী" : "Broker / Middleman"],
              ["💼", bn ? "চাকরি" : "Employment"],
              ["💰", bn ? "বেতন" : "Salary"],
              ["🏠", bn ? "বাসস্থান" : "Housing"],
              ["⚒️", bn ? "কর্মক্ষেত্র" : "Workplace"],
              ["✈️", bn ? "ভ্রমণ / বিমানবন্দর" : "Travel / Airport"],
              ["🏥", bn ? "মেডিকেল / চিকিৎসা" : "Medical / Healthcare"],
              ["🚨", bn ? "প্রতারণা" : "Fraud"],
            ].map(([icon, name]) => (

              <Link
                href="/search"
                key={name}
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >

                <div className="text-2xl">
                  {icon}
                </div>

                <div className="mt-3 text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                  {name}
                </div>

              </Link>

            ))}

          </div>
        </div>
      </section>


      {/* NOTICE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">

          <div className="flex gap-4">

            <div className="text-2xl">
              ⚠️
            </div>

            <div>

              <h3 className="font-bold text-amber-950">
                {bn ? "গুরুত্বপূর্ণ তথ্য" : "Important notice"}
              </h3>

              <p className="mt-2 text-sm leading-7 text-amber-900/80">
                {bn
                  ? "এই প্ল্যাটফর্মে প্রকাশিত অভিযোগ সংশ্লিষ্ট ব্যক্তির নিজস্ব বক্তব্য। কোনো অভিযোগ প্রকাশিত হওয়া মানেই অভিযোগটি সত্য বা যাচাই করা হয়েছে—এমন নয়। প্রমাণ প্রকাশ করার আগে ব্যক্তিগত ও সংবেদনশীল তথ্য মুছে ফেলুন।"
                  : "Published complaints represent the complainant's own statements. Publication does not mean that a complaint is true or verified. Remove personal and sensitive information before publishing evidence."}
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* FINAL CTA */}
      <section className="bg-[#092c25]">

        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">

          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            {bn
              ? "আপনার অভিজ্ঞতা তুলে ধরুন"
              : "Share your experience"}
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            {bn
              ? "আপনার অভিযোগ অন্য প্রবাসীদের সচেতন হতে সাহায্য করতে পারে।"
              : "Your complaint may help other expatriates become more aware."}
          </p>

          <Link
            href="/submit"
            className="mt-7 inline-flex rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
          >
            📝 {bn ? "অভিযোগ জমা দিন" : "Submit Complaint"}
          </Link>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div>

              <h4 className="font-bold text-white">
                {bn ? "প্রবাসীদের অভিযোগ" : "Expatriates' Complaints"}
              </h4>

              <p className="mt-3 text-sm leading-7">
                {bn
                  ? "প্রবাসীদের অভিজ্ঞতা ও অভিযোগ তুলে ধরার একটি উন্মুক্ত প্ল্যাটফর্ম।"
                  : "An open platform for expatriates to share complaints and experiences."}
              </p>

            </div>


            <div>

              <h4 className="font-bold text-white">
                {bn ? "দ্রুত লিংক" : "Quick Links"}
              </h4>

              <div className="mt-3 space-y-2 text-sm">

                <Link href="/submit" className="block hover:text-white">
                  {bn ? "অভিযোগ করুন" : "Submit Complaint"}
                </Link>

                <Link href="/search" className="block hover:text-white">
                  {bn ? "অভিযোগ খুঁজুন" : "Find Complaint"}
                </Link>

                <Link href="/stats" className="block hover:text-white">
                  {bn ? "পরিসংখ্যান" : "Statistics"}
                </Link>

              </div>

            </div>


            <div>

              <h4 className="font-bold text-white">
                {bn ? "তথ্য" : "Information"}
              </h4>

              <div className="mt-3 space-y-2 text-sm">

                <Link href="/about" className="block hover:text-white">
                  {bn ? "আমাদের সম্পর্কে" : "About Us"}
                </Link>

                <Link href="/privacy" className="block hover:text-white">
                  {bn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                </Link>

                <Link href="/disclaimer" className="block hover:text-white">
                  {bn ? "দায়বদ্ধতা" : "Disclaimer"}
                </Link>

              </div>

            </div>


            <div>

              <h4 className="font-bold text-white">
                {bn ? "নিরাপদে অভিযোগ করুন" : "Report responsibly"}
              </h4>

              <p className="mt-3 text-sm leading-7">
                {bn
                  ? "প্রকাশের আগে নিজের পাসপোর্ট, NID, ব্যাংক ও ব্যক্তিগত তথ্য মুছে ফেলুন।"
                  : "Remove passport, ID, banking and personal information before publishing evidence."}
              </p>

            </div>

          </div>


          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">

            © {new Date().getFullYear()}{" "}
            {bn ? "প্রবাসীদের অভিযোগ" : "Expatriates' Complaints"}.
            {" "}
            {bn ? "সকল অধিকার সংরক্ষিত।" : "All rights reserved."}

          </div>

        </div>

      </footer>


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
              {bn ? "অভিযোগ করুন" : "Submit"}
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


      <div className="h-20 sm:hidden" />

    </main>
      </>
  );
}