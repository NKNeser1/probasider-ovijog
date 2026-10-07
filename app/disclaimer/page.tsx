"use client";

import Link from "next/link";

export default function DisclaimerPage() {
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
            দায়বদ্ধতা ও Disclaimer
          </h1>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-bold text-amber-800">
                ⚠️ গুরুত্বপূর্ণ
              </p>

              <p className="mt-2 text-amber-700">
                এই ওয়েবসাইটে প্রকাশিত অভিযোগ বা তথ্যকে স্বয়ংক্রিয়ভাবে যাচাই করা
                সত্য হিসেবে বিবেচনা করা যাবে না।
              </p>
            </div>

            <p>
              ব্যবহারকারীদের সঠিক ও সত্য তথ্য প্রকাশ করার জন্য অনুরোধ করা হচ্ছে।
              মিথ্যা, বিভ্রান্তিকর, মানহানিকর, হয়রানিমূলক বা ক্ষতিকর তথ্য প্রকাশ
              করা থেকে বিরত থাকুন।
            </p>

            <p>
              এই প্ল্যাটফর্মে পাওয়া কোনো পরামর্শ সরকারি, আইনি, চিকিৎসা বা
              পেশাদার সেবার বিকল্প নয়।
            </p>

            <p>
              গুরুত্বপূর্ণ আইনি, চিকিৎসা, আর্থিক বা অন্যান্য গুরুতর বিষয়ে
              সংশ্লিষ্ট সরকারি কর্তৃপক্ষ বা যোগ্য পেশাজীবীর পরামর্শ নিন।
            </p>

            <p>
              জরুরি পরিস্থিতিতে স্থানীয় জরুরি সেবা, পুলিশ, হাসপাতাল বা
              সংশ্লিষ্ট সরকারি কর্তৃপক্ষের সঙ্গে সরাসরি যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}