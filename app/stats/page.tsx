"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { collection, doc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";

type Complaint = {
  country?: string;
  city?: string;
  district?: string;
  division?: string;
  category?: string;
  status?: string;
};

type HelpRequest = {
  id: string;
};

type SiteStats = {
  totalViews?: number;
  activeViews?: number;
};

type Sponsor = {
  id: string;
  name?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  link?: string;
  active?: boolean;
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
};

type StatItem = {
  name: string;
  count: number;
  percentage: number;
};

const categoryLabels: Record<string, string> = {
  passport: "পাসপোর্ট / Passport",
  visa: "ভিসা / Visa",
  recruiting: "রিক্রুটিং এজেন্সি / Recruiting Agency",
  broker: "দালাল / মধ্যস্থতাকারী / Broker",
  employment: "চাকরি / Employment",
  salary: "বেতন / Salary",
  company: "কোম্পানি / Company",
  person: "ব্যক্তি / Person",
  medical: "মেডিকেল / চিকিৎসা / Medical",
  housing: "বাসস্থান / Housing",
  workplace: "কর্মস্থল / Workplace",
  travel: "ভ্রমণ / এয়ারপোর্ট / Travel",
  airport: "এয়ারপোর্ট / Airport",
  fraud: "প্রতারণা / Fraud",
  other: "অন্যান্য / Other",
};

function getPercentage(count: number, total: number) {
  if (!total) return 0;

  return Number(((count / total) * 100).toFixed(1));
}

function createStats(values: string[], total: number): StatItem[] {
  const counts: Record<string, number> = {};

  values.forEach((value) => {
    const cleaned = value.trim();

    if (!cleaned) return;

    counts[cleaned] = (counts[cleaned] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: getPercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

function getCategoryLabel(category: string) {
  const key = category.trim().toLowerCase();

  return categoryLabels[key] || category;
}

/*
 * Number format
 *
 * 1,000       → 1K
 * 10,000      → 10K
 * 100,000     → 1L
 * 1,000,000   → 1M
 * 10,000,000  → 10M
 */
function formatCount(value: number = 0) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000)
      .toFixed(value >= 10_000_000 ? 0 : 1)
      .replace(/\.0$/, "")}M`;
  }

  if (value >= 100_000) {
    return `${(value / 100_000)
      .toFixed(1)
      .replace(/\.0$/, "")}L`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000)
      .toFixed(value >= 10_000 ? 0 : 1)
      .replace(/\.0$/, "")}K`;
  }

  return String(value);
}

/*
 * Get one location name from each complaint.
 *
 * Priority:
 * City → District → Division
 *
 * This means whatever location field has been filled
 * will be used for the area statistics.
 */
function getComplaintArea(complaint: Complaint) {
  return (
    complaint.city?.trim() ||
    complaint.district?.trim() ||
    complaint.division?.trim() ||
    ""
  );
}

/*
 * Sponsor creation time
 */
function getSponsorCreatedTime(sponsor: Sponsor) {
  if (!sponsor.createdAt) return 0;

  return sponsor.createdAt.seconds || 0;
}

export default function StatsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);

  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalViews: 0,
    activeViews: 0,
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  const [sponsorIndex, setSponsorIndex] = useState(0);

  const bn = language === "bn";

  /* =================================
     LOAD COMPLAINTS
  ================================== */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "complaints"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          ...item.data(),
        })) as Complaint[];

        setComplaints(data);
        setLoading(false);
      },
      (error) => {
        console.error("Stats loading error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =================================
     LOAD HELP REQUESTS
  ================================== */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "helpRequests"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
        }));

        setHelpRequests(data);
      },
      (error) => {
        console.error("Help statistics loading error:", error);
        setHelpRequests([]);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =================================
     LOAD WEBSITE VIEWS
  ================================== */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteStats", "main"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteStats;

          setSiteStats({
            totalViews: data.totalViews || 0,
            activeViews: data.activeViews || 0,
          });
        } else {
          setSiteStats({
            totalViews: 0,
            activeViews: 0,
          });
        }
      },
      (error) => {
        console.error("Website views loading error:", error);

        setSiteStats({
          totalViews: 0,
          activeViews: 0,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  /* =================================
     LOAD ACTIVE SPONSORS
  ================================== */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sponsors"),
      (snapshot) => {
        const data: Sponsor[] = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...(item.data() as Omit<Sponsor, "id">),
          }))
          .filter(
            (sponsor) =>
              sponsor.active === true &&
              !!sponsor.mediaUrl &&
              !!sponsor.mediaType
          );

        setSponsors(data);
      },
      (error) => {
        console.error("Sponsor loading error:", error);
        setSponsors([]);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =================================
     SORT SPONSORS BY CREATION ORDER
  ================================== */

  const sortedSponsors = useMemo(() => {
    return [...sponsors].sort(
      (a, b) => getSponsorCreatedTime(a) - getSponsorCreatedTime(b)
    );
  }, [sponsors]);

  /* =================================
     KEEP SPONSOR INDEX VALID
  ================================== */

 const currentSponsor = sortedSponsors[sponsorIndex];

  /* =================================
     IMAGE AUTO SLIDE
     3 SECONDS
  ================================== */

  useEffect(() => {
    if (!currentSponsor) return;

    if (currentSponsor.mediaType !== "image") return;

    if (sortedSponsors.length <= 1) return;

    const timer = window.setTimeout(() => {
      setSponsorIndex((current) =>
        current >= sortedSponsors.length - 1 ? 0 : current + 1
      );
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [currentSponsor, sortedSponsors.length]);

  /* =================================
     NEXT SPONSOR
  ================================== */

  function nextSponsor() {
    if (sortedSponsors.length === 0) return;

    setSponsorIndex((current) =>
      current >= sortedSponsors.length - 1 ? 0 : current + 1
    );
  }

  /* =================================
     PREVIOUS SPONSOR
  ================================== */

  function previousSponsor() {
    if (sortedSponsors.length === 0) return;

    setSponsorIndex((current) =>
      current <= 0 ? sortedSponsors.length - 1 : current - 1
    );
  }

  /* =================================
     TOTAL COMPLAINTS
  ================================== */

  const totalComplaints = complaints.length;

  /* =================================
     COUNTRY STATISTICS
  ================================== */

  const countryStats = useMemo(() => {
    return createStats(
      complaints.map((complaint) => complaint.country || ""),
      totalComplaints
    );
  }, [complaints, totalComplaints]);

  /* =================================
     AREA STATISTICS

     City / District / Division

     Uses whichever location field
     is available for the complaint.
  ================================== */

  const areaStats = useMemo(() => {
    return createStats(
      complaints.map((complaint) => getComplaintArea(complaint)),
      totalComplaints
    );
  }, [complaints, totalComplaints]);

  /* =================================
     CATEGORY STATISTICS
  ================================== */

  const categoryStats = useMemo(() => {
    const stats = createStats(
      complaints.map((complaint) => complaint.category || ""),
      totalComplaints
    );

    return stats.map((item) => ({
      ...item,
      name: getCategoryLabel(item.name),
    }));
  }, [complaints, totalComplaints]);

  const topCountry = countryStats[0];
  const topCategory = categoryStats[0];

  const totalViews = siteStats.totalViews || 0;
  const activeViews = siteStats.activeViews || 0;

  const totalHelpRequests = helpRequests.length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================
            TOP NAVIGATION
        ================================== */}

        <div className="mb-6 flex items-center justify-between gap-3">

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:border-emerald-400/30 hover:bg-white/10 hover:text-white"
          >
            <span className="text-base">⬅️</span>

            <span>
              {bn ? "হোমে ফিরে যান" : "Back to Home"}
            </span>
          </Link>

          {/* Language Switcher */}

          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">

            <button
              type="button"
              onClick={() => setLanguage("bn")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                bn
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              বাংলা
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                !bn
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              English
            </button>

          </div>

        </div>

        {/* =================================
            HEADER
        ================================== */}

        <header className="relative mb-8">

          <div className="pr-2">

            <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-emerald-400">
              PROBASHIDER OVIJOG
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {bn ? "পরিসংখ্যান" : "Statistics"}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {bn
                ? "জমা হওয়া অভিযোগ, হেল্প রিকোয়েস্ট এবং ওয়েবসাইটের দর্শনার্থী সম্পর্কিত গুরুত্বপূর্ণ তথ্য এখানে দেখা যাবে।"
                : "Explore complaints, help requests and important website visitor statistics here."}
            </p>

          </div>

        </header>

        {/* =================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="space-y-6">

            <div className="grid gap-4 sm:grid-cols-2">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}

            </div>

            <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/5" />

          </div>

        ) : (

          <>

            {/* =================================
                WEBSITE VIEW CARD
            ================================== */}

            <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.04] to-cyan-400/5 p-5 shadow-xl shadow-emerald-950/20 sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                  👁️
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    {bn
                      ? "ওয়েবসাইটের ভিউ"
                      : "Website Views"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {bn
                      ? "ওয়েবসাইটে মোট ও বর্তমানে সক্রিয় ভিউ"
                      : "Total and currently active website views"}
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Total Views */}

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-sm text-slate-400">
                    {bn
                      ? "মোট ভিউ"
                      : "Total Views"}
                  </p>

                  <p className="mt-2 text-4xl font-black text-emerald-400">
                    {formatCount(totalViews)}
                  </p>

                </div>

                {/* Active Views */}

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

                    <p className="text-sm text-slate-400">
                      {bn
                        ? "অ্যাক্টিভ ভিউ"
                        : "Active Views"}
                    </p>

                  </div>

                  <p className="mt-2 text-4xl font-black text-white">
                    {formatCount(activeViews)}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================
                SPONSOR CARD
            ================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-emerald-400/5 shadow-xl">

              {/* Sponsor Header */}

              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
                    🤝
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Sponsor
                    </p>

                    <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                      {currentSponsor?.name || "Sponsor"}
                    </h2>

                  </div>

                </div>

                {currentSponsor?.link ? (

                  <a
                    href={currentSponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 sm:px-5 sm:text-sm"
                  >
                    {bn ? "দেখুন" : "View"}
                  </a>

                ) : (

                  <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-500 sm:px-5 sm:text-sm">
                    {bn ? "দেখুন" : "View"}
                  </span>

                )}

              </div>

              {/* Sponsor Media */}

              <div className="relative">

                {currentSponsor?.mediaUrl ? (

                  <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-black sm:min-h-[320px]">

                    {currentSponsor.mediaType === "video" ? (

                      <video
                        key={currentSponsor.id}
                        src={currentSponsor.mediaUrl}
                        autoPlay
                        playsInline
                        onEnded={nextSponsor}
                        className="max-h-[520px] w-full object-contain"
                      />

                    ) : (

                    <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */} 
                      <img
                        key={currentSponsor.id}
                        src={currentSponsor.mediaUrl}
                        alt={currentSponsor.name || "Sponsor"}
                        className="max-h-[520px] w-full object-contain"
                      />

                      </>
                    )}

                    {/* Previous */}

                    {sortedSponsors.length > 1 && (

                      <button
                        type="button"
                        onClick={previousSponsor}
                        aria-label={
                          bn
                            ? "আগের স্পনসর"
                            : "Previous sponsor"
                        }
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        ←
                      </button>

                    )}

                    {/* Next */}

                    {sortedSponsors.length > 1 && (

                      <button
                        type="button"
                        onClick={nextSponsor}
                        aria-label={
                          bn
                            ? "পরের স্পনসর"
                            : "Next sponsor"
                        }
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        →
                      </button>

                    )}

                    {/* Counter */}

                    {sortedSponsors.length > 1 && (

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        {sponsorIndex + 1} / {sortedSponsors.length}
                      </div>

                    )}

                  </div>

                ) : (

                  <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 sm:min-h-[320px]">

                    <div className="text-center">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                        📢
                      </div>

                      <p className="mt-4 text-2xl font-black text-slate-300">
                        Sponsor
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {bn
                          ? "স্পনসর বিজ্ঞাপন এখানে প্রদর্শিত হবে"
                          : "Sponsor content will appear here"}
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </section>

            {/* =================================
                SUMMARY CARD
            ================================== */}

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                  📊
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    {bn
                      ? "পরিসংখ্যানের সারাংশ"
                      : "Statistics Summary"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {bn
                      ? "বর্তমান তথ্যের সংক্ষিপ্ত চিত্র"
                      : "A quick overview of the current data"}
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                {/* Total Complaints */}

                <SummaryMiniCard
                  icon="📊"
                  title={bn ? "মোট অভিযোগ" : "Total complaints"}
                  value={formatCount(totalComplaints)}
                  highlight
                />

                {/* Countries */}

                <SummaryMiniCard
                  icon="🌍"
                  title={bn ? "অভিযোগের দেশ" : "Countries"}
                  value={formatCount(countryStats.length)}
                />

                {/* Areas */}

                <SummaryMiniCard
                  icon="📍"
                  title={bn ? "অভিযোগের এলাকা" : "Areas"}
                  value={formatCount(areaStats.length)}
                />

                {/* Categories */}

                <SummaryMiniCard
                  icon="🏷️"
                  title={bn ? "অভিযোগের ধরন" : "Categories"}
                  value={formatCount(categoryStats.length)}
                />

                {/* Help Requests */}

                <SummaryMiniCard
                  icon="🤝"
                  title={bn ? "হেল্প চাই" : "Help requests"}
                  value={formatCount(totalHelpRequests)}
                />

              </div>

            </section>

            {/* =================================
                INSIGHT
            ================================== */}

            {totalComplaints > 0 && (

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                    💡
                  </div>

                  <div>

                    <h2 className="font-semibold">
                      {bn
                        ? "বর্তমান পরিসংখ্যানের সংক্ষিপ্ত চিত্র"
                        : "Current statistics overview"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">

                      {topCountry
                        ? bn
                          ? `${topCountry.name} থেকে ${topCountry.count}টি অভিযোগ এসেছে, যা মোট অভিযোগের ${topCountry.percentage}%।`
                          : `${topCountry.name} has ${topCountry.count} complaints, representing ${topCountry.percentage}% of all complaints.`
                        : bn
                          ? "এখনো দেশভিত্তিক পর্যাপ্ত তথ্য নেই।"
                          : "There is not enough country data yet."}

                    </p>

                    {topCategory && (

                      <p className="mt-1 text-sm leading-6 text-slate-400">

                        {bn
                          ? `সবচেয়ে বেশি রিপোর্ট হওয়া অভিযোগের ধরন: ${topCategory.name} — ${topCategory.count}টি (${topCategory.percentage}%)।`
                          : `Most reported category: ${topCategory.name} — ${topCategory.count} (${topCategory.percentage}%).`}

                      </p>

                    )}

                  </div>

                </div>

              </section>

            )}

            {/* =================================
                COUNTRY STATISTICS
            ================================== */}

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">

              <div className="mb-6">

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    🌍
                  </span>

                  <div>

                    <h2 className="text-xl font-bold">
                      {bn
                        ? "দেশভিত্তিক অভিযোগ"
                        : "Complaints by country"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {bn
                        ? "কোন দেশ থেকে কতটি অভিযোগ জমা পড়েছে এবং মোট অভিযোগের কত শতাংশ।"
                        : "Number and percentage of complaints submitted from each country."}
                    </p>

                  </div>

                </div>

              </div>

              {countryStats.length === 0 ? (

                <EmptyState
                  text={
                    bn
                      ? "এখনো কোনো দেশভিত্তিক তথ্য নেই।"
                      : "No country data available yet."
                  }
                />

              ) : (

                <div className="space-y-4">

                  {countryStats.map((item) => (

                    <StatBar
                      key={item.name}
                      item={item}
                      total={totalComplaints}
                    />

                  ))}

                </div>

              )}

            </section>

            {/* =================================
                AREA STATISTICS
            ================================== */}

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">

              <div className="mb-6">

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    📍
                  </span>

                  <div>

                    <h2 className="text-xl font-bold">
                      {bn
                        ? "এলাকাভিত্তিক অভিযোগ"
                        : "Complaints by area"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {bn
                        ? "সাবমিট ফর্মে শহর, জেলা বা বিভাগে যে নাম দেওয়া হয়েছে, সেই নাম ধরে অভিযোগের হিসাব।"
                        : "Complaint counts based on the city, district or division name entered in the submit form."}
                    </p>

                  </div>

                </div>

              </div>

              {areaStats.length === 0 ? (

                <EmptyState
                  text={
                    bn
                      ? "এখনো কোনো এলাকা-ভিত্তিক তথ্য নেই।"
                      : "No area data available yet."
                  }
                />

              ) : (

                <div className="space-y-4">

                  {areaStats.map((item) => (

                    <StatBar
                      key={item.name}
                      item={item}
                      total={totalComplaints}
                    />

                  ))}

                </div>

              )}

            </section>

            {/* =================================
                CATEGORY STATISTICS
            ================================== */}

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">

              <div className="mb-6">

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    📋
                  </span>

                  <div>

                    <h2 className="text-xl font-bold">
                      {bn
                        ? "অভিযোগের ধরনভিত্তিক পরিসংখ্যান"
                        : "Complaints by category"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {bn
                        ? "কোন ধরনের সমস্যা কত বেশি রিপোর্ট হয়েছে।"
                        : "See which types of problems are reported most often."}
                    </p>

                  </div>

                </div>

              </div>

              {categoryStats.length === 0 ? (

                <EmptyState
                  text={
                    bn
                      ? "এখনো কোনো অভিযোগের ধরন নেই।"
                      : "No complaint categories available yet."
                  }
                />

              ) : (

                <div className="grid gap-4 sm:grid-cols-2">

                  {categoryStats.map((item) => (

                    <CategoryCard
                      key={item.name}
                      item={item}
                      total={totalComplaints}
                      bn={bn}
                    />

                  ))}

                </div>

              )}

            </section>

            {/* =================================
                COUNTRY + CATEGORY
            ================================== */}

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">

              <div className="mb-6">

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    🔎
                  </span>

                  <div>

                    <h2 className="text-xl font-bold">
                      {bn
                        ? "কোন দেশে কোন সমস্যা বেশি"
                        : "Problems by country"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {bn
                        ? "প্রতিটি দেশের অভিযোগের ধরন আলাদাভাবে দেখা যাবে।"
                        : "See complaint categories separately for each country."}
                    </p>

                  </div>

                </div>

              </div>

              {countryStats.length === 0 ? (

                <EmptyState
                  text={
                    bn
                      ? "বিশ্লেষণের জন্য এখনো কোনো অভিযোগ নেই।"
                      : "There are no complaints to analyze yet."
                  }
                />

              ) : (

                <div className="space-y-6">

                  {countryStats.map((country) => {

                    const countryComplaints =
                      complaints.filter(
                        (complaint) =>
                          (complaint.country || "").trim() ===
                          country.name
                      );

                    const countryCategories =
                      createStats(
                        countryComplaints.map(
                          (complaint) =>
                            complaint.category || ""
                        ),
                        countryComplaints.length
                      ).map((item) => ({
                        ...item,
                        name: getCategoryLabel(item.name),
                      }));

                    return (

                      <div
                        key={country.name}
                        className="rounded-2xl border border-white/10 bg-black/20 p-5"
                      >

                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <h3 className="font-bold">
                            🌍 {country.name}
                          </h3>

                          <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                            {country.count}{" "}
                            {bn ? "অভিযোগ" : "complaints"} •{" "}
                            {country.percentage}%

                          </span>

                        </div>

                        {countryCategories.length === 0 ? (

                          <p className="text-sm text-slate-500">
                            {bn
                              ? "এই দেশের অভিযোগের ধরন পাওয়া যায়নি।"
                              : "No category data available for this country."}
                          </p>

                        ) : (

                          <div className="grid gap-3 sm:grid-cols-2">

                            {countryCategories.map((item) => (

                              <div
                                key={item.name}
                                className="rounded-xl border border-white/10 bg-white/5 p-4"
                              >

                                <div className="flex items-center justify-between gap-3">

                                  <span className="min-w-0 break-words text-sm text-slate-300">
                                    {item.name}
                                  </span>

                                  <span className="shrink-0 text-sm font-bold text-white">
                                    {item.percentage}%
                                  </span>

                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                                  <div
                                    className="h-full rounded-full bg-emerald-400"
                                    style={{
                                      width: `${Math.min(
                                        item.percentage,
                                        100
                                      )}%`,
                                    }}
                                  />

                                </div>

                                <p className="mt-2 text-xs text-slate-500">

                                  {item.count}{" "}
                                  {bn
                                    ? "টি অভিযোগ"
                                    : "complaints"}

                                </p>

                              </div>

                            ))}

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

              )}

            </section>

            {/* =================================
                NOTE
            ================================== */}

            <section className="mt-6 rounded-3xl border border-yellow-400/10 bg-yellow-400/5 p-5">

              <div className="flex gap-3">

                <span className="text-xl">
                  ℹ️
                </span>

                <p className="text-sm leading-6 text-slate-400">

                  {bn
                    ? "এই পরিসংখ্যান জমা দেওয়া অভিযোগের তথ্যের ওপর ভিত্তি করে তৈরি। অভিযোগের তথ্য সত্য বা মিথ্যা হিসেবে এই পেজ নিজে থেকে যাচাই করে না। এলাকা-ভিত্তিক হিসাব সাবমিট ফর্মে সংরক্ষিত শহর, জেলা বা বিভাগে দেওয়া নামের ওপর ভিত্তি করে দেখানো হয়।"
                    : "These statistics are based on submitted complaint data. This page does not independently verify whether a complaint is true or false. Area statistics are based on the city, district or division names stored in the submit form."}

                </p>

              </div>

            </section>

          </>

        )}

      </div>
    </main>
  );
}

/* =================================
   SUMMARY MINI CARD
================================== */

function SummaryMiniCard({
  icon,
  title,
  value,
  highlight = false,
}: {
  icon: string;
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-emerald-400/20 bg-emerald-400/10"
          : "border-white/10 bg-black/20"
      }`}
    >

      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
          highlight
            ? "bg-emerald-400/10"
            : "bg-white/5"
        }`}
      >
        {icon}
      </div>

      <p className="text-xs leading-5 text-slate-400">
        {title}
      </p>

      <p
        className={`mt-1 text-3xl font-black ${
          highlight
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =================================
   STAT BAR
================================== */

function StatBar({
  item,
  total,
}: {
  item: StatItem;
  total: number;
}) {
  const width =
    total > 0
      ? Math.min((item.count / total) * 100, 100)
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-4">

        <span className="min-w-0 break-words text-sm font-medium text-slate-200">
          {item.name}
        </span>

        <span className="shrink-0 text-sm font-semibold text-emerald-400">
          {item.count} • {item.percentage}%
        </span>

      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{
            width: `${width}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =================================
   CATEGORY CARD
================================== */

function CategoryCard({
  item,
  total,
  bn,
}: {
  item: StatItem;
  total: number;
  bn: boolean;
}) {
  const width =
    total > 0
      ? Math.min((item.count / total) * 100, 100)
      : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

      <div className="flex items-start justify-between gap-4">

        <h3 className="min-w-0 break-words font-semibold text-slate-200">
          {item.name}
        </h3>

        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          {item.percentage}%
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold">
        {item.count}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {bn
          ? "মোট অভিযোগের মধ্যে"
          : "Of total complaints"}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-emerald-400"
          style={{
            width: `${width}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =================================
   EMPTY STATE
================================== */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center text-sm leading-6 text-slate-500">
      {text}
    </div>
  );
}