"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Complaint = {
  id: string;
  complaintNumber: string;
  country: string;
  city?: string;
  category: string;
  company?: string;
  title: string;
  details: string;

  views?: number;
  truthVotes?: number;
  falseVotes?: number;
  commentCount?: number;
};

type Sponsor = {
  id: string;
  name?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  link?: string;
  active: boolean;
  createdAt?: {
    toMillis?: () => number;
  } | string | number;
};

export default function SearchPage() {
  const [language, setLanguage] =
    useState<"bn" | "en">("bn");

  const [complaints, setComplaints] =
    useState<Complaint[]>([]);

  const [sponsors, setSponsors] =
    useState<Sponsor[]>([]);

  const [search, setSearch] =
    useState("");

  const [votedComplaints, setVotedComplaints] =
    useState<
      Record<string, "truth" | "false">
    >({});

  const [sponsorIndex, setSponsorIndex] =
    useState(0);

  const bn = language === "bn";


  /* ================================
     LOAD COMPLAINTS
  ================================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "complaints"),
      (snapshot) => {
        const data = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        ) as Complaint[];

        setComplaints(data);
      },
      (error) => {
        console.error(
          "Complaint loading error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);


  /* ================================
     LOAD ACTIVE SPONSORS
  ================================= */

  useEffect(() => {
    const sponsorQuery = query(
      collection(db, "sponsors"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      sponsorQuery,
      (snapshot) => {
        const data = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        ) as Sponsor[];

        setSponsors(data);
      },
      (error) => {
        console.error(
          "Sponsor loading error:",
          error
        );

        setSponsors([]);
      }
    );

    return () => unsubscribe();
  }, []);


  /* ================================
     SORT ALL SPONSOR MEDIA
  ================================= */

  const sortedSponsors = useMemo(() => {
    const getCreatedTime = (
      sponsor: Sponsor
    ) => {
      if (!sponsor.createdAt) {
        return 0;
      }

      if (
        typeof sponsor.createdAt ===
          "object" &&
        typeof sponsor.createdAt.toMillis ===
          "function"
      ) {
        return sponsor.createdAt.toMillis();
      }

      if (
        typeof sponsor.createdAt ===
          "string"
      ) {
        const time = new Date(
          sponsor.createdAt
        ).getTime();

        return Number.isNaN(time)
          ? 0
          : time;
      }

      if (
        typeof sponsor.createdAt ===
          "number"
      ) {
        return sponsor.createdAt;
      }

      return 0;
    };

    return [...sponsors].sort(
      (a, b) =>
        getCreatedTime(a) -
        getCreatedTime(b)
    );
  }, [sponsors]);


  /* ================================
     CURRENT SPONSOR MEDIA
  ================================= */

  const currentSponsor =
    sortedSponsors.length > 0
      ? sortedSponsors[
          sponsorIndex %
            sortedSponsors.length
        ]
      : null;


  /* ================================
     AUTO CHANGE IMAGE
  ================================= */

  useEffect(() => {
    if (
      sortedSponsors.length <= 1 ||
      !currentSponsor
    ) {
      return;
    }

    if (
      currentSponsor.mediaType !==
      "image"
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setSponsorIndex(
        (previous) =>
          (previous + 1) %
          sortedSponsors.length
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    sponsorIndex,
    sortedSponsors,
    currentSponsor,
  ]);


  /* ================================
     NEXT SPONSOR MEDIA
  ================================= */

  const nextSponsorMedia = () => {
    if (sortedSponsors.length <= 1) {
      return;
    }

    setSponsorIndex(
      (previous) =>
        (previous + 1) %
        sortedSponsors.length
    );
  };


  /* ================================
     LOAD VOTE HISTORY
  ================================= */

  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    try {
      const savedVotes =
        localStorage.getItem(
          "probashider-ovijog-votes"
        );

      if (savedVotes) {
        setVotedComplaints(
          JSON.parse(savedVotes)
        );
      }
    } catch {
      console.warn(
        "Vote history could not be loaded."
      );
    }
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, []);


  /* ================================
     NUMBER FORMAT
  ================================= */

  const formatCount = (
    value: number = 0
  ) => {
    if (value >= 1_000_000) {
      return `${(
        value / 1_000_000
      )
        .toFixed(
          value >= 10_000_000
            ? 0
            : 1
        )
        .replace(
          /\.0$/,
          ""
        )}M`;
    }

    if (value >= 100_000) {
      return `${(
        value / 100_000
      )
        .toFixed(1)
        .replace(
          /\.0$/,
          ""
        )}L`;
    }

    if (value >= 1_000) {
      return `${(
        value / 1_000
      )
        .toFixed(
          value >= 10_000
            ? 0
            : 1
        )
        .replace(
          /\.0$/,
          ""
        )}K`;
    }

    return String(value);
  };


  /* ================================
     VOTE HANDLER
  ================================= */

  const handleVote = async (
    complaint: Complaint,
    vote: "truth" | "false"
  ) => {
    if (
      votedComplaints[
        complaint.id
      ]
    ) {
      return;
    }

    try {
      await updateDoc(
        doc(
          db,
          "complaints",
          complaint.id
        ),
        vote === "truth"
          ? {
              truthVotes:
                increment(1),
            }
          : {
              falseVotes:
                increment(1),
            }
      );

      const updatedVotes = {
        ...votedComplaints,
        [complaint.id]: vote,
      };

      setVotedComplaints(
        updatedVotes
      );

      localStorage.setItem(
        "probashider-ovijog-votes",
        JSON.stringify(
          updatedVotes
        )
      );
    } catch (error) {
      console.error(
        "Vote error:",
        error
      );

      alert(
        bn
          ? "ভোট দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          : "Your vote could not be submitted. Please try again."
      );
    }
  };


  /* ================================
     SEARCH
  ================================= */

  const filteredComplaints =
    complaints.filter(
      (complaint) => {
        const queryText =
          search
            .toLowerCase()
            .trim();

        if (!queryText) {
          return true;
        }

        return (
          complaint.complaintNumber
            ?.toLowerCase()
            .includes(
              queryText
            ) ||
          complaint.country
            ?.toLowerCase()
            .includes(
              queryText
            ) ||
          complaint.city
            ?.toLowerCase()
            .includes(
              queryText
            ) ||
          complaint.category
            ?.toLowerCase()
            .includes(
              queryText
            ) ||
          complaint.title
            ?.toLowerCase()
            .includes(
              queryText
            ) ||
          complaint.details
            ?.toLowerCase()
            .includes(
              queryText
            )
        );
      }
    );


  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900">


      {/* =================================
          HEADER
      ================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-xl text-white shadow-lg shadow-emerald-700/20">
              ⚖️
            </div>

            <div>

              <h1 className="text-base font-bold sm:text-lg">
                {bn
                  ? "প্রবাসীদের অভিযোগ"
                  : "Expatriates' Complaints"}
              </h1>

              <p className="text-[10px] text-slate-500 sm:text-xs">
                {bn
                  ? "আপনার কথা, আপনার অধিকার"
                  : "Your Voice, Your Rights"}
              </p>

            </div>

          </Link>


          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setLanguage(
                  bn ? "en" : "bn"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 sm:px-4"
            >
              {bn
                ? "English"
                : "বাংলা"}
            </button>


            <Link
              href="/submit"
              className="hidden rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 sm:block"
            >
              {bn
                ? "অভিযোগ করুন"
                : "Submit Complaint"}
            </Link>

          </div>

        </div>

      </header>


      {/* =================================
          HERO
      ================================== */}

      <section className="relative overflow-hidden bg-[#092c25]">

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-emerald-100 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              {bn
                ? "অভিযোগ অনুসন্ধান"
                : "Complaint Search"}

            </div>


            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">

              {bn
                ? "অভিযোগ খুঁজে দেখুন"
                : "Find a Complaint"}

            </h2>


            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">

              {bn
                ? "অভিযোগ নম্বর, দেশ, ক্যাটাগরি অথবা অভিযোগের বিষয় লিখে খুঁজুন।"
                : "Search by complaint number, country, category or complaint title."}

            </p>

          </div>

        </div>

      </section>


      {/* =================================
          SEARCH BOX
      ================================== */}

      <section className="relative z-10 -mt-7 px-4">

        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-7">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                bn
                  ? "অভিযোগ নম্বর বা বিষয় লিখুন..."
                  : "Enter complaint number or keyword..."
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

          </div>


          <div className="mt-4 flex items-center justify-between">

            <p className="text-xs text-slate-500 sm:text-sm">

              {bn
                ? "মোট পাওয়া গেছে:"
                : "Results found:"}{" "}

              <span className="font-bold text-emerald-700">
                {
                  filteredComplaints.length
                }
              </span>

            </p>


            {search && (

              <button
                onClick={() =>
                  setSearch("")
                }
                className="text-xs font-bold text-slate-500 hover:text-emerald-700"
              >
                {bn
                  ? "সার্চ মুছুন"
                  : "Clear search"}
              </button>

            )}

          </div>

        </div>

      </section>


      {/* =================================
          ONE SPONSOR CARD
      ================================== */}

      {currentSponsor && (

        <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

            {currentSponsor.mediaType ===
            "video" ? (

              <video
                key={
                  currentSponsor.id
                }
                src={
                  currentSponsor.mediaUrl
                }
                controls
                playsInline
                onEnded={
                  nextSponsorMedia
                }
                className="block h-auto max-h-[75vh] w-full object-contain"
              />

            ) : (

              currentSponsor.link ? (

                <a
                  href={
                    currentSponsor.link
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
{/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={
                      currentSponsor.id
                    }
                    src={
                      currentSponsor.mediaUrl
                    }
                    alt={
                      currentSponsor.name ||
                      "Sponsor"
                    }
                    className="block h-auto max-h-[75vh] w-full object-contain"
                  />

                </a>

              ) : (
                
                                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentSponsor.id}
                    src={currentSponsor.mediaUrl}
                    alt={currentSponsor.name || "Sponsor"}
                    className="block h-auto max-h-[75vh] w-full object-contain"
                  />
                </>
              )

            )}

          </div>

        </section>

      )}


      {/* =================================
          COMPLAINT LIST
      ================================== */}

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="mb-7 flex items-end justify-between">

          <div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">

              {bn
                ? "প্রকাশিত অভিযোগ"
                : "PUBLISHED COMPLAINTS"}

            </span>


            <h3 className="mt-2 text-2xl font-extrabold text-[#092c25] sm:text-3xl">

              {bn
                ? "সাম্প্রতিক অভিযোগসমূহ"
                : "Recent Complaints"}

            </h3>

          </div>

        </div>


        {filteredComplaints.length ===
        0 ? (

          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🔎
            </div>


            <h3 className="mt-5 text-lg font-bold text-slate-800">

              {bn
                ? "কোনো অভিযোগ পাওয়া যায়নি"
                : "No complaints found"}

            </h3>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

              {bn
                ? "অভিযোগ নম্বর বা অন্য কোনো তথ্য দিয়ে আবার চেষ্টা করুন।"
                : "Try searching with a complaint number or another keyword."}

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {filteredComplaints.map(
              (complaint) => {

                const truthVotes =
                  complaint.truthVotes ||
                  0;

                const falseVotes =
                  complaint.falseVotes ||
                  0;

                const totalVotes =
                  truthVotes +
                  falseVotes;

                const truthPercent =
                  totalVotes > 0
                    ? (truthVotes /
                        totalVotes) *
                      100
                    : 50;

                const currentVote =
                  votedComplaints[
                    complaint.id
                  ];


                return (

                  <article
                    key={
                      complaint.id
                    }
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >

                    <div className="p-5 sm:p-7">


                      {/* BADGES */}

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          🌍{" "}
                          {
                            complaint.country
                          }
                        </span>


                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {
                            complaint.category
                          }
                        </span>

                      </div>


                      {/* TITLE */}

                      <h2 className="mt-4 text-xl font-extrabold leading-snug text-[#092c25] transition group-hover:text-emerald-700 sm:text-2xl">

                        {
                          complaint.title
                        }

                      </h2>


                      {/* FULL COMPLAINT */}

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:p-5">

                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">

                          {
                            complaint.details
                          }

                        </p>

                      </div>


                      {/* LOCATION / COMPANY */}

                      {(complaint.city ||
                        complaint.company) && (

                        <div className="mt-4 flex flex-wrap gap-2">

                          {complaint.city && (

                            <span className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                              📍{" "}
                              {
                                complaint.city
                              }
                            </span>

                          )}


                          {complaint.company && (

                            <span className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                              {
                                complaint.company
                              }
                            </span>

                          )}

                        </div>

                      )}


                      {/* =================================
                          TRUTH / FALSE
                      ================================== */}

                      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

                        <p className="text-center text-sm font-extrabold text-[#092c25] sm:text-base">

                          {bn
                            ? "এই অভিযোগ সম্পর্কে আপনার ধারণা কি?"
                            : "What is your opinion about this complaint?"}

                        </p>


                        {/* BUTTONS */}

                        <div className="mt-4 grid grid-cols-2 gap-3">

                          <button
                            type="button"
                            disabled={
                              !!currentVote
                            }
                            onClick={() =>
                              handleVote(
                                complaint,
                                "truth"
                              )
                            }
                            className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                              currentVote ===
                              "truth"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : currentVote
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            🟢{" "}
                            {
                              bn
                                ? "সত্য"
                                : "True"
                            }
                          </button>


                          <button
                            type="button"
                            disabled={
                              !!currentVote
                            }
                            onClick={() =>
                              handleVote(
                                complaint,
                                "false"
                              )
                            }
                            className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                              currentVote ===
                              "false"
                                ? "border-red-600 bg-red-600 text-white"
                                : currentVote
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            🔴{" "}
                            {
                              bn
                                ? "মিথ্যা"
                                : "False"
                            }
                          </button>

                        </div>


                        {/* PROPORTIONAL BAR */}

                        <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-red-500">

                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width: `${truthPercent}%`,
                            }}
                          />

                        </div>


                        {/* VOTE COUNTS */}

                        <div className="mt-2 flex items-center justify-between text-xs font-bold">

                          <span className="text-emerald-600">
                            {
                              formatCount(
                                truthVotes
                              )
                            }
                          </span>


                          <span className="text-red-600">
                            {
                              formatCount(
                                falseVotes
                              )
                            }
                          </span>

                        </div>


                        {currentVote && (

                          <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">

                            {bn
                              ? "আপনি এই অভিযোগে ইতিমধ্যে ভোট দিয়েছেন।"
                              : "You have already voted on this complaint."}

                          </p>

                        )}

                      </div>


                      {/* =================================
                          VIEWS / COMMENTS
                      ================================== */}

                      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                        <div className="border-r border-slate-200 px-4 py-3 text-center">

                          <p className="text-base font-extrabold text-slate-700">

                            {
                              formatCount(
                                complaint.views ||
                                  0
                              )
                            }

                          </p>


                          <p className="mt-1 text-[10px] font-semibold text-slate-400">

                            {bn
                              ? "মোট ভিউ"
                              : "Total Views"}

                          </p>

                        </div>


                        <div className="px-4 py-3 text-center">

                          <p className="text-base font-extrabold text-slate-700">

                            {
                              formatCount(
                                complaint.commentCount ||
                                  0
                              )
                            }

                          </p>


                          <p className="mt-1 text-[10px] font-semibold text-slate-400">

                            {bn
                              ? "মন্তব্য"
                              : "Comments"}

                          </p>

                        </div>

                      </div>


                      {/* =================================
                          FOOTER
                      ================================== */}

                      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                            {bn
                              ? "অভিযোগ নম্বর"
                              : "Complaint Number"}

                          </p>


                          <p className="mt-1 text-sm font-extrabold tracking-wide text-emerald-700">

                            {
                              complaint.complaintNumber
                            }

                          </p>

                        </div>


                        <Link
                          href={`/complaints/${complaint.id}`}
                          className="flex items-center justify-center rounded-xl bg-[#092c25] px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >

                          {bn
                            ? "বিস্তারিত দেখুন →"
                            : "View Details →"}

                        </Link>

                      </div>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>


      {/* =================================
          RESPONSIBLE NOTICE
      ================================== */}

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">

          <div className="flex gap-4">

            <div className="text-2xl">
              ⚠️
            </div>


            <div>

              <h3 className="font-bold text-amber-950">

                {bn
                  ? "গুরুত্বপূর্ণ তথ্য"
                  : "Important notice"}

              </h3>


              <p className="mt-2 text-xs leading-6 text-amber-900/80 sm:text-sm">

                {bn
                  ? "প্রকাশিত অভিযোগ সংশ্লিষ্ট ব্যক্তির নিজস্ব বক্তব্য। কোনো অভিযোগ প্রকাশিত হওয়া মানেই তা সত্য বা যাচাই করা হয়েছে—এমন নয়।"
                  : "Published complaints represent the complainant's own statements. Publication does not mean that a complaint is true or verified."}

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          MOBILE NAV
      ================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-1.5 py-2 shadow-2xl backdrop-blur-xl sm:hidden">

        <div className="grid grid-cols-5 gap-1">


          <Link
            href="/"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            🏠

            <span className="mt-1 block">
              {bn
                ? "হোম"
                : "Home"}
            </span>

          </Link>


          <Link
            href="/search"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-emerald-700"
          >
            🔎

            <span className="mt-1 block">
              {bn
                ? "অভিযোগ খুঁজুন"
                : "Search"}
            </span>

          </Link>


          <Link
            href="/submit"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            📝

            <span className="mt-1 block">
              {bn
                ? "অভিযোগ করুন"
                : "Submit"}
            </span>

          </Link>


          <Link
            href="/help"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            🤝

            <span className="mt-1 block">
              {bn
                ? "হেল্প চাই"
                : "Need Help"}
            </span>

          </Link>


          <Link
            href="/stats"
            className="rounded-xl py-2 text-center text-[10px] font-semibold text-slate-600"
          >
            📊

            <span className="mt-1 block">
              {bn
                ? "পরিসংখ্যান"
                : "Stats"}
            </span>

          </Link>

        </div>

      </div>


      <div className="h-20 sm:hidden" />

    </main>
  );
}