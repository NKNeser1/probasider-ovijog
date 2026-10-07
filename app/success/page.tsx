"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [complaintNumber, setComplaintNumber] = useState(
    "অভিযোগ নম্বর পাওয়া যায়নি"
  );
  
    useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const number = params.get("complaint");

    if (number) {
      setComplaintNumber(number);
    }
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, []);

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-[#17211d]">
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-xl sm:p-8">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-black text-[#08251d]">
              অভিযোগ সফলভাবে জমা হয়েছে
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              আপনার অভিযোগটি সফলভাবে গ্রহণ করা হয়েছে।
              নিচের অভিযোগ নম্বরটি সংরক্ষণ করে রাখুন।
            </p>

            <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                আপনার অভিযোগ নম্বর
              </p>

              <p className="mt-3 break-all text-xl font-black tracking-wide text-[#08251d]">
                {complaintNumber}
              </p>

              <p className="mt-3 text-xs leading-5 text-emerald-700">
                নম্বরটির উপর চাপ দিয়ে ধরে রেখে কপি করে নিরাপদে সংরক্ষণ করুন।
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
              <p className="text-sm font-bold text-amber-900">
                ⚠️ গুরুত্বপূর্ণ
              </p>

              <p className="mt-2 text-xs leading-5 text-amber-800">
                এই অভিযোগ নম্বরটি হারিয়ে ফেলবেন না।
                ভবিষ্যতে আপনার অভিযোগ খুঁজে পেতে এই নম্বর
                প্রয়োজন হবে।
              </p>
            </div>

            <div className="mt-7 grid gap-3">
              <Link
                href="/search"
                className="rounded-xl bg-[#08251d] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d352a]"
              >
                🔎 অভিযোগ খুঁজুন
              </Link>

              <Link
                href="/submit"
                className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                📝 নতুন অভিযোগ করুন
              </Link>

              <Link
                href="/"
                className="py-2 text-sm font-semibold text-emerald-700"
              >
                ← হোমে ফিরে যান
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}