"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const isAllowedEvidenceUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "res.cloudinary.com"
    );
  } catch {
    return false;
  }
};

type Complaint = {
  complaintNumber?: string;
  country?: string;
  city?: string;
  category?: string;
  company?: string;
  title?: string;
  details?: string;
  amount?: string;
  incidentDate?: string;
  evidenceCount?: number;
  evidence?: {
    name?: string;
    url?: string;
    type?: string;
    size?: number;
    publicId?: string;
  }[];
  anonymous?: boolean;
  name?: string;
  showName?: boolean;
  status?: string;
};

export default function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        const { id } = await params;

        const complaintRef = doc(db, "complaints", id);
        const complaintSnap = await getDoc(complaintRef);

        if (!complaintSnap.exists()) {
          setNotFound(true);
          return;
        }

        setComplaint(complaintSnap.data() as Complaint);
      } catch (error) {
        console.error("Complaint loading error:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
          <p className="text-slate-600">অভিযোগের তথ্য লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  if (notFound || !complaint) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-slate-900">
        <section className="bg-[#092c25] px-5 py-16 text-center text-white">
          <div className="mx-auto max-w-2xl">
            <div className="mb-5 text-6xl">🔎</div>

            <h1 className="text-3xl font-black sm:text-4xl">
              অভিযোগটি পাওয়া যায়নি
            </h1>

            <p className="mt-4 text-white/75">
              এই অভিযোগ নম্বরের সঙ্গে কোনো প্রকাশিত অভিযোগ পাওয়া যায়নি।
            </p>

            <Link
              href="/search"
              className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-bold text-[#092c25] shadow-lg transition hover:scale-105"
            >
              ← অভিযোগ খুঁজুন
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#092c25] text-xl shadow-lg">
              🌍
            </div>

            <div>
              <div className="text-base font-black text-[#092c25]">
                প্রবাসীদের অভিযোগ
              </div>
              <div className="text-xs text-slate-500">
                Probashider Ovijog
              </div>
            </div>
          </Link>

          <Link
            href="/search"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← অভিযোগ খুঁজুন
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#092c25] px-4 py-12 text-white sm:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            অভিযোগের বিস্তারিত
          </div>

          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            {complaint.title || "অভিযোগের বিস্তারিত তথ্য"}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            এই তথ্য অভিযোগকারী কর্তৃক জমা দেওয়া হয়েছে। প্ল্যাটফর্মটি
            অভিযোগের সত্যতা স্বাধীনভাবে যাচাই করে না।
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* COMPLAINT NUMBER */}
        <div className="mb-6 rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            অভিযোগ নম্বর
          </p>

          <p className="mt-2 break-all text-xl font-black text-[#092c25] sm:text-2xl">
            {complaint.complaintNumber || "নম্বর নেই"}
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon="🌍"
            label="দেশ"
            value={complaint.country || "উল্লেখ করা হয়নি"}
          />

          <InfoCard
            icon="📍"
            label="শহর"
            value={complaint.city || "উল্লেখ করা হয়নি"}
          />

          <InfoCard
            icon="📂"
            label="অভিযোগের ধরন"
            value={complaint.category || "উল্লেখ করা হয়নি"}
          />

          <InfoCard
            icon="🏢"
            label="ব্যক্তি / প্রতিষ্ঠান"
            value={complaint.company || "উল্লেখ করা হয়নি"}
          />
        </div>

        {/* DETAILS */}
        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              📝
            </div>

            <div>
              <h2 className="text-xl font-black text-[#092c25]">
                অভিযোগের বিবরণ
              </h2>

              <p className="text-sm text-slate-500">
                অভিযোগকারী যে তথ্য দিয়েছেন
              </p>
            </div>
          </div>

          <div className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-8 text-slate-700 sm:text-base">
            {complaint.details || "কোনো বিস্তারিত তথ্য দেওয়া হয়নি।"}
          </div>
        </div>

        {/* EXTRA INFORMATION */}
        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-8">
          <h2 className="mb-5 text-xl font-black text-[#092c25]">
            অতিরিক্ত তথ্য
          </h2>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <InfoCard
              icon="💰"
              label="অর্থের পরিমাণ"
              value={
                complaint.amount
                  ? `${complaint.amount}`
                  : "উল্লেখ করা হয়নি"
              }
            />

            <InfoCard
              icon="📅"
              label="ঘটনার তারিখ"
              value={complaint.incidentDate || "উল্লেখ করা হয়নি"}
            />

            <InfoCard
              icon="📎"
              label="প্রমাণ / Evidence"
              value={
                complaint.evidenceCount
                  ? `${complaint.evidenceCount} টি ফাইল`
                  : "কোনো প্রমাণ সংযুক্ত করা হয়নি"
              }
            />

            {complaint.evidence && complaint.evidence.length > 0 && (
              <div className="min-w-0 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <h3 className="mb-4 text-sm font-bold text-[#092c25]">
                  সংযুক্ত প্রমাণ / Attached Evidence
                </h3>

                <div className="space-y-5">
                  {complaint.evidence.map((file, index) => {
                    const fileType = file.type?.toLowerCase() || "";
                
                    const fileUrl =
  file.url && isAllowedEvidenceUrl(file.url)
    ? file.url
    : "";

                    const isImage =
                      fileType.startsWith("image/") ||
                      /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(
                        fileUrl
                      );

                    const isVideo =
                      fileType.startsWith("video/") ||
                      /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(fileUrl);

                    const isPdf =
                      fileType === "application/pdf" ||
                      /\.pdf(\?.*)?$/i.test(fileUrl);

                    return (
                      <div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        {/* FILE TITLE */}
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                          <p className="min-w-0 truncate text-sm font-bold text-slate-700">
                            📎 {file.name || `Evidence ${index + 1}`}
                          </p>

                          <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Evidence
                          </span>
                        </div>

                        {/* IMAGE */}
                        {isImage && fileUrl && (
                          <div className="bg-slate-100 p-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={fileUrl}
                                alt={file.name || `Evidence ${index + 1}`}
                                className="mx-auto max-h-[600px] w-full rounded-xl object-contain"
                                loading="lazy"
                              />
                            </a>
                          </div>
                        )}

                        {/* VIDEO */}
                        {isVideo && fileUrl && (
                          <div className="bg-black p-2">
                            <video
                              src={fileUrl}
                              controls
                              playsInline
                              preload="metadata"
                              className="mx-auto max-h-[600px] w-full rounded-xl"
                            >
                              আপনার ব্রাউজার ভিডিও প্লে করতে পারছে না।
                            </video>
                          </div>
                        )}

                        {/* PDF */}
                        {isPdf && fileUrl && (
                          <div className="bg-slate-100 p-2">
                            <iframe
                              src={fileUrl}
                              title={file.name || `Evidence ${index + 1}`}
                              className="h-[500px] w-full rounded-xl border border-slate-200 bg-white sm:h-[650px]"
                            />
                          </div>
                        )}

                        {/* OTHER FILE TYPES */}
                        {!isImage && !isVideo && !isPdf && fileUrl && (
                          <div className="p-4">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center rounded-xl bg-[#092c25] px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
                            >
                              📂 ফাইলটি খুলুন
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <InfoCard
              icon="👤"
              label="অভিযোগকারীর পরিচয়"
              value={
                complaint.anonymous
                  ? "নাম প্রকাশ করা হয়নি"
                  : complaint.showName && complaint.name
                    ? complaint.name
                    : "নাম প্রকাশ করা হয়নি"
              }
            />
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <div className="text-2xl">⚠️</div>

            <div>
              <h2 className="font-black text-amber-900">
                গুরুত্বপূর্ণ সতর্কতা
              </h2>

              <p className="mt-2 text-sm leading-7 text-amber-800">
                এই অভিযোগটি একজন ব্যবহারকারী কর্তৃক জমা দেওয়া হয়েছে।
                এখানে প্রকাশিত তথ্যকে চূড়ান্ত সত্য বা প্রমাণিত অভিযোগ
                হিসেবে বিবেচনা করা উচিত নয়। কোনো ব্যক্তির বিরুদ্ধে
                সিদ্ধান্ত নেওয়ার আগে যথাযথভাবে তথ্য যাচাই করুন।
              </p>
            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-flex rounded-2xl bg-[#092c25] px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-900"
          >
            ← সব অভিযোগ দেখুন
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center">
        <p className="text-sm font-bold text-[#092c25]">
          প্রবাসীদের অভিযোগ
        </p>

        <p className="mt-2 text-xs text-slate-500">
          একটি জনসচেতনতামূলক অভিযোগ প্ল্যাটফর্ম
        </p>
      </footer>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-1 break-words text-sm font-bold leading-6 text-slate-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}