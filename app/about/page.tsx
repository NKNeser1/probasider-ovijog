"use client";

import Link from "next/link";

export default function AboutPage() {
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
            আমাদের সম্পর্কে
          </h1>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              <strong className="text-slate-800">
                প্রবাসীদের অভিযোগ
              </strong>{" "}
              একটি জনসচেতনতামূলক অনলাইন প্ল্যাটফর্ম। প্রবাসীদের বিভিন্ন সমস্যা,
              অভিযোগ ও অভিজ্ঞতা তুলে ধরার জন্য এই ওয়েবসাইটটি তৈরি করা হয়েছে।
            </p>

            <p>
              বিদেশে যাওয়ার প্রস্তুতি থেকে শুরু করে চাকরি, বেতন, পাসপোর্ট,
              ভিসা, নিয়োগকারী প্রতিষ্ঠান, দালাল, বাসস্থান, চিকিৎসা ও কর্মস্থলসহ
              বিভিন্ন বিষয়ে প্রবাসীরা নানা সমস্যার মুখোমুখি হতে পারেন।
            </p>

            <p>
              আমাদের উদ্দেশ্য হলো এসব সমস্যার কথা সহজভাবে তুলে ধরার সুযোগ তৈরি
              করা এবং প্রয়োজনীয় তথ্য ও অভিজ্ঞতা একে অপরের সঙ্গে ভাগ করে নেওয়ার
              একটি উন্মুক্ত জায়গা তৈরি করা।
            </p>

            <p>
              এই প্ল্যাটফর্মের মাধ্যমে একজন প্রবাসী তার সমস্যার কথা জানাতে
              পারবেন এবং অন্য প্রবাসীরা নিজেদের অভিজ্ঞতা ও পরামর্শ শেয়ার করতে
              পারবেন।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}