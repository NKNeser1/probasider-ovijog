"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LegalAssistanceForm } from "@/components/LegalAssistanceForm";

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
  } | string | number; };

type ComplaintComment = {
  id: string;
  text: string;
  createdAt: string | null;
  updatedAt: string | null;
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



  const [sponsorIndex, setSponsorIndex] =
  useState(0);


const [openCommentId, setOpenCommentId] =
  useState<string | null>(null);

const [commentsByComplaint, setCommentsByComplaint] =
  useState<Record<string, ComplaintComment[]>>({});

const [commentDrafts, setCommentDrafts] =
  useState<Record<string, string>>({});

const [commentLoadingId, setCommentLoadingId] =
  useState<string | null>(null);

const [commentSubmittingId, setCommentSubmittingId] =
  useState<string | null>(null);
     const [editingCommentId, setEditingCommentId] =
  useState<string | null>(null);

const [editCodeDrafts, setEditCodeDrafts] =
  useState<Record<string, string>>({});

const [editTextDrafts, setEditTextDrafts] =
  useState<Record<string, string>>({});

const [commentActionLoadingId, setCommentActionLoadingId] =
  useState<string | null>(null);

  const bn = language === "bn";


const toggleComments = async (complaintId: string) => {
  if (openCommentId === complaintId) {
    setOpenCommentId(null);
    return;
  }

  setOpenCommentId(complaintId);

  if (commentsByComplaint[complaintId]) {
    return;
  }

  setCommentLoadingId(complaintId);

  try {
    const response = await fetch(
      `/api/complaints/${encodeURIComponent(complaintId)}/comments`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "মন্তব্য লোড করা যায়নি।"
      );
    }

    setCommentsByComplaint((previous) => ({
      ...previous,
      [complaintId]: data.comments ?? [],
    }));
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "মন্তব্য লোড করা যায়নি।"
    );
  } finally {
    setCommentLoadingId(null);
  }
};

const submitComment = async (complaintId: string) => {
  const text = (
    commentDrafts[complaintId] ?? ""
  ).trim();

  if (!text || text.length > 1000) {
    alert(
      bn
        ? "১ থেকে ১০০০ অক্ষরের মধ্যে মন্তব্য লিখুন।"
        : "Enter a comment between 1 and 1000 characters."
    );
    return;
  }

  setCommentSubmittingId(complaintId);

  try {
    const response = await fetch(
      `/api/complaints/${encodeURIComponent(complaintId)}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "মন্তব্য জমা দেওয়া যায়নি।"
      );
    }

    setCommentsByComplaint((previous) => ({
      ...previous,
      [complaintId]: [
        ...(previous[complaintId] ?? []),
        data.comment,
      ],
    }));

    setCommentDrafts((previous) => ({
      ...previous,
      [complaintId]: "",
    }));

    if (data.editCode) {
      window.prompt(
        bn
          ? "আপনার মন্তব্যের গোপন সম্পাদনা কোডটি সংরক্ষণ করুন। এটি পরে আর দেখানো হবে না:"
          : "Save your private comment edit code. It will not be shown again:",
        data.editCode
      );
    }

    alert(
      bn
        ? "মন্তব্য জমা হয়েছে।"
        : "Comment submitted."
    );
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "মন্তব্য জমা দেওয়া যায়নি।"
    );
  } finally {
    setCommentSubmittingId(null);
  }
};
     const editComment = async (complaintId: string, commentId: string) => {
  const editCode = (editCodeDrafts[commentId] ?? "").trim();
  const text = (editTextDrafts[commentId] ?? "").trim();

  if (!/^(?:[0-9]{5}|[a-f0-9]{32})$/.test(editCode)) {
    alert(bn ? "সঠিক গোপন কোড দিন।" : "Enter a valid secret code.");
    return;
  }

  if (!text || text.length > 1000) {
    alert(bn ? "১ থেকে ১০০০ অক্ষরের মন্তব্য লিখুন।" : "Enter 1–1000 characters.");
    return;
  }

  setCommentActionLoadingId(commentId);

  try {
    const response = await fetch(
      `/api/complaints/${encodeURIComponent(complaintId)}/comments`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, editCode, text }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "মন্তব্য সম্পাদনা করা যায়নি।");
    }

    setCommentsByComplaint((previous) => ({
      ...previous,
      [complaintId]: (previous[complaintId] ?? []).map((comment) =>
        comment.id === commentId
          ? { ...comment, text, updatedAt: new Date().toISOString() }
          : comment
      ),
    }));

    setEditingCommentId(null);
    setEditCodeDrafts((previous) => ({ ...previous, [commentId]: "" }));
    setEditTextDrafts((previous) => ({ ...previous, [commentId]: "" }));

    alert(bn ? "মন্তব্য সম্পাদনা হয়েছে।" : "Comment updated.");
  } catch (error) {
    alert(error instanceof Error ? error.message : "মন্তব্য সম্পাদনা করা যায়নি।");
  } finally {
    setCommentActionLoadingId(null);
  }
};

const deleteComment = async (complaintId: string, commentId: string) => {
  const editCode = window.prompt(
    bn ? "মন্তব্যের গোপন কোড দিন:" : "Enter the comment's secret code:"
  );

  if (editCode === null) return;

  if (!/^(?:[0-9]{5}|[a-f0-9]{32})$/.test(editCode.trim())) {
    alert(bn ? "সঠিক গোপন কোড দিন।" : "Enter a valid secret code.");
    return;
  }

  if (!window.confirm(bn ? "আপনি কি মন্তব্যটি মুছে ফেলতে চান?" : "Delete this comment?")) {
    return;
  }

  setCommentActionLoadingId(commentId);

  try {
    const response = await fetch(
      `/api/complaints/${encodeURIComponent(complaintId)}/comments`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, editCode: editCode.trim() }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "মন্তব্য মুছে ফেলা যায়নি।");
    }

    setCommentsByComplaint((previous) => ({
      ...previous,
      [complaintId]: (previous[complaintId] ?? []).filter(
        (comment) => comment.id !== commentId
      ),
    }));

    alert(bn ? "মন্তব্য মুছে ফেলা হয়েছে।" : "Comment deleted.");
  } catch (error) {
    alert(error instanceof Error ? error.message : "মন্তব্য মুছে ফেলা যায়নি।");
  } finally {
    setCommentActionLoadingId(null);
  }
};

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
                  : "Probasider Ovijog"}
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

                        <button
                          type="button"

                          onClick={() => {
  void toggleComments(complaint.id);
}}
                          className="flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          {bn ? "💬 মন্তব্য করুন" : "💬 Comment"}
                        </button>

                        {/* SHARE BUTTON */}
                        <button
                          type="button"
                          onClick={async () => {
                            const url = `${window.location.origin}/complaints/${complaint.id}`;

                            try {
                              if (navigator.share) {
                                await navigator.share({
                                  title: complaint.title,
                                  url,
                                });
                              } else {
                                await navigator.clipboard.writeText(url);
                                alert(
                                  bn
                                    ? "অভিযোগের লিংক কপি হয়েছে।"
                                    : "Complaint link copied."
                                );
                              }
                            } catch (error) {
                              if (
                                error instanceof Error &&
                                error.name !== "AbortError"
                              ) {
                                window.prompt(
                                  bn ? "লিংকটি কপি করুন:" : "Copy this link:",
                                  url
                                );
                              }
                            }
                          }}
                          className="flex items-center justify-center rounded-xl border border-emerald-700 px-5 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50"
                        >
                          {bn ? "শেয়ার করুন ↗" : "Share ↗"}
                        </button>

                      </div>

                                            <LegalAssistanceForm
                        complaintNumber={complaint.complaintNumber}
                        bn={bn}
                      />


                      {openCommentId === complaint.id && (
                        <section className="mt-5 rounded-2xl border border-slate-200 p-4 sm:p-5">
                          <h3 className="text-base font-bold text-slate-800">
                            {bn ? "মন্তব্যসমূহ" : "Comments"}
                          </h3>

                          {commentLoadingId === complaint.id ? (
                            <p className="mt-3 text-sm text-slate-500">
                              {bn ? "মন্তব্য লোড হচ্ছে..." : "Loading comments..."}
                            </p>
                          ) : (
                            <div className="mt-3 space-y-3">
                              {(commentsByComplaint[complaint.id] ?? []).length === 0 ? (
                                <p className="text-sm text-slate-500">
                                  {bn ? "এখনো কোনো মন্তব্য নেই।" : "No comments yet."}
                                </p>
                              ) : (
                                (commentsByComplaint[complaint.id] ?? []).map((comment) => (
                                  <div
  key={comment.id}
  className="rounded-xl bg-slate-50 p-3"
>
  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
    {comment.text}
  </p>

  {comment.updatedAt && (
    <p className="mt-1 text-xs text-slate-400">
      {bn ? "সম্পাদিত" : "Edited"}
    </p>
  )}

  <div className="mt-3 flex flex-wrap gap-2">
    <button
      type="button"
      disabled={commentActionLoadingId === comment.id}
      onClick={() => {
        if (editingCommentId === comment.id) {
          setEditingCommentId(null);
          return;
        }

        setEditingCommentId(comment.id);
        setEditTextDrafts((previous) => ({
          ...previous,
          [comment.id]: comment.text,
        }));
        setEditCodeDrafts((previous) => ({
          ...previous,
          [comment.id]: "",
        }));
      }}
      className="rounded-lg border border-emerald-700 px-3 py-2 text-xs font-bold text-emerald-800 disabled:opacity-50"
    >
      {editingCommentId === comment.id
        ? (bn ? "বাতিল" : "Cancel")
        : (bn ? "এডিট" : "Edit")}
    </button>

    <button
      type="button"
      disabled={commentActionLoadingId === comment.id}
      onClick={() => void deleteComment(complaint.id, comment.id)}
      className="rounded-lg border border-red-300 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50"
    >
      {commentActionLoadingId === comment.id
        ? (bn ? "অপেক্ষা করুন..." : "Please wait...")
        : (bn ? "ডিলিট" : "Delete")}
    </button>
  </div>

  {editingCommentId === comment.id && (
    <form
      className="mt-3 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        void editComment(complaint.id, comment.id);
      }}
    >
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={32}
        value={editCodeDrafts[comment.id] ?? ""}
        onChange={(event) =>
          setEditCodeDrafts((previous) => ({
            ...previous,
            [comment.id]: event.target.value,
          }))
        }
        placeholder={bn ? "গোপন কোড দিন" : "Enter secret code"}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600"
      />

      <textarea
        value={editTextDrafts[comment.id] ?? ""}
        onChange={(event) =>
          setEditTextDrafts((previous) => ({
            ...previous,
            [comment.id]: event.target.value,
          }))
        }
        maxLength={1000}
        rows={3}
        placeholder={bn ? "মন্তব্য সম্পাদনা করুন..." : "Edit your comment..."}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600"
      />

      <button
        type="submit"
        disabled={commentActionLoadingId === comment.id}
        className="rounded-xl bg-[#092c25] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
      >
        {commentActionLoadingId === comment.id
          ? (bn ? "সেভ হচ্ছে..." : "Saving...")
          : (bn ? "পরিবর্তন সেভ করুন" : "Save Changes")}
      </button>
    </form>
  )}
</div>
                                ))
                              )}
                            </div>
                          )}

                          <form
                            className="mt-4 space-y-3"
                            onSubmit={(event) => {
                              event.preventDefault();
                              void submitComment(complaint.id);
                            }}
                          >
                            <textarea
                              value={commentDrafts[complaint.id] ?? ""}
                              onChange={(event) =>
                                setCommentDrafts((previous) => ({
                                  ...previous,
                                  [complaint.id]: event.target.value,
                                }))
                              }
                              maxLength={1000}
                              rows={3}
                              placeholder={bn ? "আপনার মন্তব্য লিখুন..." : "Write your comment..."}
                              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600"
                            />

                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={commentSubmittingId === complaint.id}
                                className="rounded-xl bg-[#092c25] px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {commentSubmittingId === complaint.id
                                  ? (bn ? "জমা হচ্ছে..." : "Submitting...")
                                  : (bn ? "মন্তব্য জমা দিন" : "Submit Comment")}
                              </button>
                            </div>
                          </form>
                        </section>
                      )}

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