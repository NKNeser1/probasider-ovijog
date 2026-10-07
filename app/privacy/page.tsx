"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
        >
          ⬅️ হোমে ফিরে যান
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
          <h1 className="text-2xl font-black text-slate-900">
            গোপনীয়তা
          </h1>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              <strong className="text-slate-800">
                প্রবাসীদের অভিযোগ
              </strong>{" "}
              ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তাকে গুরুত্ব দেয়।
            </p>

            <p>
              অভিযোগ বা সহায়তার অনুরোধ করার সময় প্রয়োজন অনুযায়ী নাম, মোবাইল
              নম্বর, WhatsApp নম্বর বা ইমেইল দেওয়া হতে পারে। এসব তথ্য প্রয়োজনীয়
              কার্যক্রমের জন্য ব্যবহার করা হতে পারে এবং সাধারণভাবে সবার সামনে
              প্রকাশ করার জন্য নয়।
            </p>

            <p>
              কোনো অভিযোগ বা প্রমাণ প্রকাশ করার আগে নিজের ব্যক্তিগত তথ্য,
              পাসওয়ার্ড, জাতীয় পরিচয়পত্রের তথ্য, ব্যাংক তথ্য বা অন্য কোনো
              সংবেদনশীল তথ্য প্রকাশ না করার জন্য ব্যবহারকারীদের অনুরোধ করা হচ্ছে।
            </p>

            <p>
              ব্যবহারকারীরা কোনো তথ্য প্রকাশ করার আগে সেটি অন্য কারও ব্যক্তিগত
              বা সংবেদনশীল তথ্য বহন করছে কি না তা যাচাই করে নেবেন।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}