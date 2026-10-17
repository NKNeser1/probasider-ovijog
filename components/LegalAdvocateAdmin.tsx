"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/lib/firebase";

type Advocate = {
  id: string;
  name: string;
  qualifications: string;
  active: boolean;
};

export function LegalAdvocateAdmin({
  bn,
}: {
  bn: boolean;
}) {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = useCallback(async () => {
    const user = getAuth(app).currentUser;

    if (!user) {
      throw new Error(
        bn ? "অ্যাডমিন হিসেবে লগইন করুন।" : "Please sign in as admin."
      );
    }

    return user.getIdToken();
  }, [bn]);

  const loadAdvocates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(
        "/api/legal/advocates?includeInactive=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (bn ? "তালিকা লোড করা যায়নি।" : "Unable to load advocates.")
        );
      }

      setAdvocates(result.advocates || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "একটি সমস্যা হয়েছে।"
            : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [bn, getToken]);

  useEffect(() => {
  const timer = setTimeout(() => {
    void loadAdvocates();
  }, 0);

  return () => clearTimeout(timer);
}, [loadAdvocates]);

  const resetForm = () => {
    setName("");
    setQualifications("");
    setEditingId("");
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = await getToken();

      const response = await fetch("/api/legal/advocates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingId || undefined,
          name,
          qualifications,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (bn ? "তথ্য সংরক্ষণ করা যায়নি।" : "Unable to save advocate.")
        );
      }

      setMessage(
        editingId
          ? bn
            ? "আইনজীবীর তথ্য আপডেট হয়েছে।"
            : "Advocate updated."
          : bn
            ? "নতুন আইনজীবী যোগ হয়েছে।"
            : "Advocate added."
      );

      resetForm();
      await loadAdvocates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "একটি সমস্যা হয়েছে।"
            : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (advocate: Advocate) => {
    setMessage("");
    setError("");

    try {
      const token = await getToken();

      const response = await fetch("/api/legal/advocates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: advocate.id,
          active: !advocate.active,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (bn ? "অবস্থা পরিবর্তন করা যায়নি।" : "Unable to update status.")
        );
      }

      setMessage(
        bn ? "আইনজীবীর অবস্থা আপডেট হয়েছে।" : "Advocate status updated."
      );

      await loadAdvocates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "একটি সমস্যা হয়েছে।"
            : "Something went wrong."
      );
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">
          ⚖️ {bn ? "আইনজীবী ব্যবস্থাপনা" : "Legal Advocate Management"}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {bn
            ? "আইনি সহযোগিতার জন্য আইনজীবীর নাম ও শিক্ষাগত যোগ্যতা পরিচালনা করুন।"
            : "Manage advocates and their educational qualifications for legal assistance."}
        </p>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSave}
        className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <h3 className="font-black text-slate-800">
          {editingId
            ? bn
              ? "আইনজীবীর তথ্য সম্পাদনা"
              : "Edit Advocate"
            : bn
              ? "নতুন আইনজীবী যোগ করুন"
              : "Add New Advocate"}
        </h3>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">
            {bn ? "আইনজীবীর নাম" : "Advocate Name"}
          </label>
          <input
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600"
            placeholder={bn ? "পূর্ণ নাম লিখুন" : "Enter full name"}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">
            {bn ? "শিক্ষাগত যোগ্যতা" : "Educational Qualifications"}
          </label>
          <textarea
            required
            maxLength={1000}
            rows={3}
            value={qualifications}
            onChange={(event) => setQualifications(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600"
            placeholder={
              bn
                ? "যেমন: LLB, LLM — প্রতিষ্ঠানের নামসহ"
                : "e.g. LLB, LLM — include institution if appropriate"
            }
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            {saving
              ? bn
                ? "সংরক্ষণ হচ্ছে..."
                : "Saving..."
              : editingId
                ? bn
                  ? "পরিবর্তন সংরক্ষণ"
                  : "Save Changes"
                : bn
                  ? "আইনজীবী যোগ করুন"
                  : "Add Advocate"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700"
            >
              {bn ? "বাতিল" : "Cancel"}
            </button>
          )}

          <button
            type="button"
            onClick={() => void loadAdvocates()}
            className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700"
          >
            {bn ? "তালিকা রিফ্রেশ" : "Refresh List"}
          </button>
        </div>
      </form>

      <h3 className="mb-3 font-black text-slate-800">
        {bn ? "আইনজীবীদের তালিকা" : "Advocate List"}
      </h3>

      {loading ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          {bn ? "লোড হচ্ছে..." : "Loading..."}
        </p>
      ) : advocates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
          {bn ? "এখনও কোনো আইনজীবী যোগ করা হয়নি।" : "No advocates added yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {advocates.map((advocate) => (
            <div
              key={advocate.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-900">
                    {advocate.name}
                  </h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {advocate.qualifications}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-black ${
                      advocate.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {advocate.active
                      ? bn
                        ? "সক্রিয়"
                        : "Active"
                      : bn
                        ? "নিষ্ক্রিয়"
                        : "Inactive"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(advocate.id);
                      setName(advocate.name);
                      setQualifications(advocate.qualifications);
                      setMessage("");
                      setError("");
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
                  >
                    {bn ? "সম্পাদনা" : "Edit"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleToggle(advocate)}
                    className={`rounded-lg px-3 py-2 text-sm font-bold ${
                      advocate.active
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {advocate.active
                      ? bn
                        ? "নিষ্ক্রিয় করুন"
                        : "Deactivate"
                      : bn
                        ? "সক্রিয় করুন"
                        : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
