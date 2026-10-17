"use client";

import { useEffect, useState } from "react";

type Advocate = {
  id: string;
  name: string;
  qualifications: string;
};

type LegalAssistanceFormProps = {
  complaintNumber: string;
  bn: boolean;
};

export function LegalAssistanceForm({
  complaintNumber,
  bn,
}: LegalAssistanceFormProps) {
  const [choice, setChoice] = useState<"yes" | "no" | "">("");
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(false);
  const [advocateId, setAdvocateId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    applicantName: "",
    phone: "",
    whatsapp: "",
    email: "",
    country: "",
    city: "",
    address: "",
    details: "",
  });

  useEffect(() => {
    if (choice !== "yes") return;

    let cancelled = false;

    async function loadAdvocates() {
      setLoadingAdvocates(true);
      setError("");

      try {
        const response = await fetch("/api/legal/advocates");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            bn
              ? "আইনজীবীদের তালিকা লোড করা যায়নি।"
              : "Unable to load advocates."
          );
        }

        if (!cancelled) {
          setAdvocates(data.advocates ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load advocates."
          );
        }
      } finally {
        if (!cancelled) setLoadingAdvocates(false);
      }
    }

    void loadAdvocates();

    return () => {
      cancelled = true;
    };
  }, [choice, bn]);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submitApplication() {
    if (!confirmed) {
      setError(
        bn
          ? "আবেদন জমা দেওয়ার আগে তথ্য নিশ্চিত করুন।"
          : "Please confirm your information before submitting."
      );
      return;
    }

    if (!advocateId) {
      setError(
        bn ? "একজন আইনজীবী নির্বাচন করুন।" : "Select an advocate."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/legal/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintNumber,
          advocateId,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (bn
              ? "আবেদন জমা দেওয়া যায়নি।"
              : "Unable to submit application.")
        );
      }

      setApplicationNumber(data.applicationNumber ?? "");
      setConfirmed(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "আবেদন জমা দেওয়া যায়নি।"
            : "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function trackApplication() {
    const number = trackingNumber.trim();

    if (!number) {
      setTrackingStatus(
        bn ? "অভিযোগ নম্বর লিখুন।" : "Enter a complaint number."
      );
      return;
    }

    setTrackingLoading(true);
    setTrackingStatus("");

    try {
      const response = await fetch(
        `/api/legal/applications?complaintNumber=${encodeURIComponent(number)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (bn
              ? "আবেদনের অবস্থা দেখা যায়নি।"
              : "Unable to check application status.")
        );
      }

      setTrackingStatus(
        data.application
          ? `${bn ? "অবস্থা" : "Status"}: ${
              data.application.status
            }${data.application.advocateName ? ` — ${data.application.advocateName}` : ""}`
          : bn
            ? "এই অভিযোগ নম্বরে কোনো আইনি আবেদন পাওয়া যায়নি।"
            : "No legal application was found for this complaint number."
      );
    } catch (err) {
      setTrackingStatus(
        err instanceof Error
          ? err.message
          : bn
            ? "আবেদনের অবস্থা দেখা যায়নি।"
            : "Unable to check application status."
      );
    } finally {
      setTrackingLoading(false);
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
      <h3 className="text-base font-extrabold text-slate-800">
        {bn
          ? "⚖️ আপনি কি আপনার অভিযোগের জন্য আইনি সহযোগিতা চান?"
          : "⚖️ Would you like legal assistance for your complaint?"}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {bn
          ? "আপনার প্রয়োজন অনুযায়ী নিচের একটি অপশন নির্বাচন করুন।"
          : "Choose an option below."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setChoice("yes");
            setError("");
          }}
          className={`rounded-xl px-5 py-3 text-sm font-bold ${
            choice === "yes"
              ? "bg-emerald-700 text-white"
              : "border border-emerald-700 text-emerald-800"
          }`}
        >
          {bn ? "হ্যাঁ, আইনি সহায়তা চাই" : "Yes, I need help"}
        </button>

        <button
          type="button"
          onClick={() => {
            setChoice("no");
            setError("");
          }}
          className={`rounded-xl px-5 py-3 text-sm font-bold ${
            choice === "no"
              ? "bg-slate-700 text-white"
              : "border border-slate-300 text-slate-700"
          }`}
        >
          {bn ? "না, ধন্যবাদ" : "No, thanks"}
        </button>
      </div>

      {choice === "no" && (
        <p className="mt-3 text-sm text-slate-600">
          {bn
            ? "ঠিক আছে। আপনার অভিযোগের অন্য ফিচারগুলো আগের মতো ব্যবহার করতে পারবেন।"
            : "No problem. You can continue using the other complaint features."}
        </p>
      )}

      {choice === "yes" && !applicationNumber && (
        <div className="mt-5 space-y-4 border-t border-emerald-100 pt-5">
          <h4 className="font-bold text-slate-800">
            {bn ? "আবেদনকারীর তথ্য" : "Applicant information"}
          </h4>

          <p className="text-xs leading-5 text-slate-500">
            {bn
              ? "আপনার দেওয়া তথ্য আইনি আবেদন পরিচালনার জন্য ব্যবহার করা হবে। এটি পাবলিক অভিযোগের কার্ডে দেখানো হবে না।"
              : "Your information will be used to process this application and will not be displayed on the public complaint card."}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              maxLength={120}
              value={form.applicantName}
              onChange={(e) => updateField("applicantName", e.target.value)}
              placeholder={bn ? "আপনার পূর্ণ নাম *" : "Full name *"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              required
              maxLength={30}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder={bn ? "মোবাইল নম্বর *" : "Phone number *"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              maxLength={30}
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="WhatsApp"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              type="email"
              maxLength={150}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder={bn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              required
              maxLength={100}
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              placeholder={bn ? "বর্তমান দেশ *" : "Current country *"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              maxLength={100}
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder={bn ? "শহর" : "City"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <input
              maxLength={300}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder={bn ? "ঠিকানা (ঐচ্ছিক)" : "Address (optional)"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2"
            />
          </div>

          <textarea
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            value={form.details}
            onChange={(e) => updateField("details", e.target.value)}
            placeholder={
              bn
                ? "কী ধরনের আইনি সহযোগিতা প্রয়োজন, বিস্তারিত লিখুন *"
                : "Describe the legal assistance you need *"
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          />

          <div>
            <h4 className="font-bold text-slate-800">
              {bn ? "আইনজীবী নির্বাচন করুন" : "Choose an advocate"}
            </h4>

            {loadingAdvocates ? (
              <p className="mt-2 text-sm text-slate-500">
                {bn ? "আইনজীবীদের তালিকা লোড হচ্ছে..." : "Loading advocates..."}
              </p>
            ) : advocates.length === 0 ? (
              <p className="mt-2 text-sm text-amber-700">
                {bn
                  ? "এখন কোনো সক্রিয় আইনজীবী পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।"
                  : "No active advocates are available right now."}
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {advocates.map((advocate) => (
                  <label
                    key={advocate.id}
                    className={`flex cursor-pointer gap-3 rounded-xl border bg-white p-4 ${
                      advocateId === advocate.id
                        ? "border-emerald-600 ring-1 ring-emerald-600"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`advocate-${complaintNumber}`}
                      value={advocate.id}
                      checked={advocateId === advocate.id}
                      onChange={() => setAdvocateId(advocate.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-bold text-slate-800">
                        {advocate.name}
                      </span>
                      <span className="mt-1 block whitespace-pre-wrap text-sm text-slate-600">
                        {advocate.qualifications}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span>
              {bn
                ? "আমি নিশ্চিত করছি যে দেওয়া তথ্য সঠিক এবং আইনি সহায়তার আবেদনের জন্য ব্যবহার করতে সম্মত।"
                : "I confirm that the information provided is correct and may be used to process this legal assistance application."}
            </span>
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={
              submitting ||
              loadingAdvocates ||
              advocates.length === 0 ||
              !form.applicantName.trim() ||
              !form.phone.trim() ||
              !form.country.trim() ||
              form.details.trim().length < 10 ||
              !advocateId ||
              !confirmed
            }
            onClick={() => void submitApplication()}
            className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? bn ? "আবেদন জমা হচ্ছে..." : "Submitting..."
              : bn ? "তথ্য নিশ্চিত করে আবেদন জমা দিন" : "Confirm and submit application"}
          </button>
        </div>
      )}

      {applicationNumber && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
          <p className="font-bold text-emerald-800">
            {bn ? "আবেদন জমা হয়েছে" : "Application submitted"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {bn ? "আপনার আবেদন নম্বর:" : "Your application number:"}
          </p>
          <p className="mt-1 break-all font-extrabold text-slate-900">
            {applicationNumber}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {bn
              ? "নম্বরটি সংরক্ষণ করুন। আবেদন পর্যালোচনার অপেক্ষায় রয়েছে।"
              : "Save this number. Your application is awaiting review."}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-emerald-100 pt-4">
        <h4 className="font-bold text-slate-800">
          {bn ? "আইনি আবেদনের অবস্থা দেখুন" : "Track a legal application"}
        </h4>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={bn ? "অভিযোগ নম্বর লিখুন" : "Enter complaint number"}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          />
          <button
            type="button"
            disabled={trackingLoading}
            onClick={() => void trackApplication()}
            className="rounded-xl border border-emerald-700 px-4 py-3 text-sm font-bold text-emerald-800 disabled:opacity-50"
          >
            {trackingLoading
              ? bn ? "খোঁজা হচ্ছে..." : "Checking..."
              : bn ? "অবস্থা দেখুন" : "Check status"}
          </button>
        </div>
        {trackingStatus && (
          <p role="status" className="mt-3 break-words text-sm text-slate-700">
            {trackingStatus}
          </p>
        )}
      </div>
    </section>
  );
}
