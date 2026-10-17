"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/lib/firebase";

type LegalApplication = {
  id: string;
  applicationNumber: string;
  complaintNumber: string;
  applicantName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  country: string;
  city?: string;
  address?: string;
  details: string;
  advocateName: string;
  advocateQualifications?: string;
  status: string;
  createdAt?: string | null;
};

type Props = {
  bn: boolean;
};

const statusOptions = [
  { value: "pending", bn: "অপেক্ষমাণ", en: "Pending" },
  { value: "reviewing", bn: "পর্যালোচনা চলছে", en: "Reviewing" },
  { value: "approved", bn: "অনুমোদিত", en: "Approved" },
  { value: "rejected", bn: "প্রত্যাখ্যাত", en: "Rejected" },
  { value: "completed", bn: "সম্পন্ন", en: "Completed" },
];

export function LegalApplicationsAdmin({ bn }: Props) {
  const [applications, setApplications] = useState<LegalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [statusChanges, setStatusChanges] = useState<Record<string, string>>(
    {}
  );

  const loadApplications = useCallback(async (manual = false) => {

    if (manual) {
  setRefreshing(true);
  setError("");
  setMessage("");
}
    try {
      const user = getAuth(app).currentUser;

      if (!user) {
        throw new Error(
          bn
            ? "Admin হিসেবে লগইন করুন।"
            : "Please sign in as an administrator."
        );
      }

      const token = await user.getIdToken();

      const response = await fetch(
        "/api/legal/applications?includeAll=true",
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (bn ? "আবেদন লোড করা যায়নি।" : "Could not load applications.")
        );
      }

      const list: LegalApplication[] = data.applications ?? [];
      setApplications(list);

      const nextStatuses: Record<string, string> = {};
      for (const item of list) {
        nextStatuses[item.id] = item.status || "pending";
      }
      setStatusChanges(nextStatuses);
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
      setRefreshing(false);
    }
  }, [bn]);

  useEffect(() => {
  const timer = setTimeout(() => {
    void loadApplications();
  }, 0);

  return () => clearTimeout(timer);
}, [loadApplications]);

  async function updateStatus(item: LegalApplication) {
    const status = statusChanges[item.id];

    if (!status || status === item.status) return;

    setSavingId(item.id);
    setError("");
    setMessage("");

    try {
      const user = getAuth(app).currentUser;

      if (!user) {
        throw new Error(
          bn ? "Admin হিসেবে লগইন করুন।" : "Please sign in as an administrator."
        );
      }

      const token = await user.getIdToken();

      const response = await fetch("/api/legal/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: item.id, status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (bn ? "স্ট্যাটাস আপডেট হয়নি।" : "Status update failed.")
        );
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === item.id
            ? { ...application, status }
            : application
        )
      );

      setMessage(
        bn ? "আবেদনের স্ট্যাটাস আপডেট হয়েছে।" : "Application status updated."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "স্ট্যাটাস আপডেট করা যায়নি।"
            : "Could not update status."
      );
    } finally {
      setSavingId("");
    }
  }


async function deleteApplication(item: LegalApplication) {
  const confirmed = window.confirm(
    bn
      ? `আপনি কি ${item.applicationNumber} আবেদনটি স্থায়ীভাবে মুছে ফেলতে চান?`
      : `Permanently delete application ${item.applicationNumber}?`
  );

  if (!confirmed) return;

  setDeletingId(item.id);
  setError("");
  setMessage("");

  try {
    const user = getAuth(app).currentUser;

    if (!user) {
      throw new Error(
        bn ? "Admin হিসেবে লগইন করুন।" : "Please sign in as an administrator."
      );
    }

    const token = await user.getIdToken();

    const response = await fetch("/api/legal/applications", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: item.id }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          (bn ? "আবেদন মুছে ফেলা যায়নি।" : "Could not delete application.")
      );
    }

    setApplications((current) =>
      current.filter((application) => application.id !== item.id)
    );

    setStatusChanges((current) => {
      const next = { ...current };
      delete next[item.id];
      return next;
    });

    setMessage(
      bn
        ? "আইনি সহায়তার আবেদন মুছে ফেলা হয়েছে।"
        : "Legal assistance application deleted."
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : bn
          ? "আবেদন মুছে ফেলা যায়নি।"
          : "Could not delete application."
    );
  } finally {
    setDeletingId("");
  }
}

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            ⚖️ {bn ? "আইনি সহায়তার আবেদন" : "Legal Assistance Applications"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {bn
              ? "আবেদনকারীর ব্যক্তিগত তথ্য ও আবেদনের অবস্থা পরিচালনা করুন।"
              : "View applicant details and manage application status."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications(true)}
          disabled={loading || refreshing}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {refreshing
            ? bn
              ? "লোড হচ্ছে..."
              : "Refreshing..."
            : bn
              ? "তালিকা রিফ্রেশ"
              : "Refresh List"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-5 text-sm text-slate-500">
          {bn ? "আবেদন লোড হচ্ছে..." : "Loading applications..."}
        </p>
      ) : applications.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {bn ? "এখনও কোনো আবেদন জমা হয়নি।" : "No applications yet."}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-slate-600">
            {bn ? "মোট আবেদন:" : "Total applications:"}{" "}
            <strong>{applications.length}</strong>
          </p>

          {applications.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {item.applicantName}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {bn ? "আবেদন নম্বর:" : "Application No:"}{" "}
                    {item.applicationNumber}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {bn ? "অভিযোগ নম্বর:" : "Complaint No:"}{" "}
                    {item.complaintNumber}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {statusOptions.find((option) => option.value === item.status)?.[
                    bn ? "bn" : "en"
                  ] ?? item.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-black sm:grid-cols-2">
                <p>
                  <strong>{bn ? "ফোন:" : "Phone:"}</strong> {item.phone || "—"}
                </p>
                <p>
                  <strong>WhatsApp:</strong> {item.whatsapp || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {item.email || "—"}
                </p>
                <p>
                  <strong>{bn ? "দেশ:" : "Country:"}</strong>{" "}
                  {item.country || "—"}
                </p>
                <p>
                  <strong>{bn ? "শহর:" : "City:"}</strong> {item.city || "—"}
                </p>
                <p>
                  <strong>{bn ? "আইনজীবী:" : "Advocate:"}</strong>{" "}
                  {item.advocateName || "—"}
                </p>
                <p className="sm:col-span-2">
                  <strong>{bn ? "ঠিকানা:" : "Address:"}</strong>{" "}
                  {item.address || "—"}
                </p>
                <p className="whitespace-pre-wrap break-words sm:col-span-2">
                  <strong>{bn ? "সমস্যার বিবরণ:" : "Case details:"}</strong>{" "}
                  {item.details}
                </p>
                {item.advocateQualifications && (
                  <p className="sm:col-span-2">
                    <strong>
                      {bn ? "আইনজীবীর যোগ্যতা:" : "Advocate qualifications:"}
                    </strong>{" "}
                    {item.advocateQualifications}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <label
                  htmlFor={`legal-status-${item.id}`}
                  className="text-sm font-semibold text-slate-700"
                >
                  {bn ? "স্ট্যাটাস:" : "Status:"}
                </label>

                <select
                  id={`legal-status-${item.id}`}
                  value={statusChanges[item.id] ?? item.status}
                  onChange={(event) =>
                    setStatusChanges((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {bn ? option.bn : option.en}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => void updateStatus(item)}
                  disabled={
                    savingId === item.id ||
                    !statusChanges[item.id] ||
                    statusChanges[item.id] === item.status
                  }
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {savingId === item.id
                    ? bn
                      ? "সেভ হচ্ছে..."
                      : "Saving..."
                    : bn
                      ? "স্ট্যাটাস সেভ"
                      : "Save Status"}
                </button>


<button
  type="button"
  onClick={() => void deleteApplication(item)}
  disabled={deletingId === item.id || savingId === item.id}
  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
>
  {deletingId === item.id
    ? bn
      ? "মুছে ফেলা হচ্ছে..."
      : "Deleting..."
    : bn
      ? "🗑️ ডিলিট"
      : "🗑️ Delete"}
</button>

              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
