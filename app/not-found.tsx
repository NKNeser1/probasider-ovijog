"use client";

import Link from "next/link";

import Image from "next/image";

export default function NotFound() {
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f0fdf8] via-white to-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-xl text-center">

        {/* LOGO */}
        <div className="mb-7 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#0f766e]/10 bg-white shadow-xl shadow-[#0f766e]/10">
            
            
<Image
  src="/images/PROBASHIDER OVIJOG.png"
  alt="প্রবাসীদের অভিযোগ"
  width={96}
  height={96}
  className="h-full w-full object-contain"
/>
            
          </div>
        </div>

        {/* 404 */}
        <div className="mb-3 text-7xl font-black tracking-tight text-[#0f766e] sm:text-8xl">
          404
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-black text-[#092c25] sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে,
          ঠিকানা পরিবর্তন হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>

        {/* ENGLISH */}
        <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
          The page you are looking for could not be found.
        </p>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="rounded-2xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0f766e]/20 transition hover:bg-[#0b5f59] active:scale-[0.98]"
          >
            🏠 হোমপেজে ফিরে যান
          </Link>

          <Link
            href="/submit"
            className="rounded-2xl border border-[#0f766e]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#0f766e] shadow-sm transition hover:bg-[#f0fdf8] active:scale-[0.98]"
          >
            📝 অভিযোগ করুন
          </Link>

        </div>

        {/* FOOTER MESSAGE */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <p className="text-sm font-bold text-[#092c25]">
            প্রবাসীদের অভিযোগ
          </p>

          <p className="mt-1 text-xs text-slate-500">
            আপনার কথা, এক প্ল্যাটফর্মে
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Probashider Ovijog
          </p>
        </div>

      </div>
    </main>
  );
}