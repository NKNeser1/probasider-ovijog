"use client";

import { useEffect, useMemo, useState } from "react";


import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type WelcomeIntroData = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  enabled: boolean;
  duration: number;
  startAt: string;
  endAt: string;
  createdAt?: Timestamp;
};

const COLLECTION_NAME = "welcomeIntros";

// =====================================================
// DEFAULT WEBSITE LOGO
// =====================================================

const DEFAULT_LOGO = "/images/PROBASHIDER OVIJOG.png";

// =====================================================
// CHECK INTRO ACTIVE
// =====================================================

function isIntroCurrentlyActive(intro: WelcomeIntroData) {
  if (!intro.enabled) return false;

  const now = new Date();

  if (intro.startAt) {
    const start = new Date(intro.startAt);

    if (!Number.isNaN(start.getTime()) && now < start) {
      return false;
    }
  }

  if (intro.endAt) {
    const end = new Date(intro.endAt);

    if (!Number.isNaN(end.getTime()) && now > end) {
      return false;
    }
  }

  return true;
}

// =====================================================
// WELCOME INTRO
// =====================================================

export function WelcomeIntro() {
  const [intros, setIntros] = useState<WelcomeIntroData[]>([]);
  const [visible, setVisible] = useState(false);

  const [activeIntro, setActiveIntro] =
    useState<WelcomeIntroData | null>(null);

  useEffect(() => {
    const introQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      introQuery,
      (snapshot) => {
        const data: WelcomeIntroData[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<WelcomeIntroData, "id">),
        }));

        setIntros(data);
      },
      (error) => {
        console.error("Welcome Intro loading error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const currentIntro = useMemo(() => {
    return (
      intros.find((intro) => isIntroCurrentlyActive(intro)) || null
    );
  }, [intros]);
  

  useEffect(() => {
  const updateTimer = window.setTimeout(() => {
    if (!currentIntro) {
      setActiveIntro(null);
      setVisible(false);
      return;
    }

    setActiveIntro(currentIntro);
    setVisible(true);
  }, 0);

  if (!currentIntro) {
    return () => {
      window.clearTimeout(updateTimer);
    };
  }

  const duration =
    typeof currentIntro.duration === "number" &&
    currentIntro.duration >= 500
      ? currentIntro.duration
      : 2000;

  const hideTimer = window.setTimeout(() => {
    setVisible(false);
  }, duration);

  return () => {
    window.clearTimeout(updateTimer);
    window.clearTimeout(hideTimer);
  };
}, [currentIntro]);

  
  if (!visible || !activeIntro) {
    return null;
  }

  const logo =
    activeIntro.imageUrl?.trim() || DEFAULT_LOGO;

  const duration =
    typeof activeIntro.duration === "number" &&
    activeIntro.duration >= 500
      ? activeIntro.duration
      : 2000;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950"
      style={{
        animation: `welcomeIntroFade ${duration}ms ease-in-out forwards`,
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.22),_transparent_55%)]" />

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Logo */}
        <div
          className="mb-6 flex items-center justify-center"
          style={{
            animation: "welcomeIntroLogo 900ms ease-out",
          }}
        >
          <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
            <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-2xl" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="প্রবাসীদের অভিযোগ"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            />
          </div>
        </div>

        {/* Title */}
        {activeIntro.title && (
          <h1
            className="text-2xl font-black tracking-tight text-white sm:text-3xl"
            style={{
              animation: "welcomeIntroText 700ms ease-out",
            }}
          >
            {activeIntro.title}
          </h1>
        )}

        {/* Subtitle */}
        {activeIntro.subtitle && (
          <p
            className="mt-3 max-w-sm text-sm leading-6 text-emerald-100/90 sm:text-base"
            style={{
              animation: "welcomeIntroText 900ms ease-out",
            }}
          >
            {activeIntro.subtitle}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{
              animation: `welcomeIntroProgress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes welcomeIntroFade {
          0% {
            opacity: 1;
          }

          75% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes welcomeIntroLogo {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }

          60% {
            opacity: 1;
            transform: scale(1.05);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes welcomeIntroText {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes welcomeIntroProgress {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// =====================================================
// WELCOME INTRO ADMIN
// =====================================================

export function WelcomeIntroAdmin() {
  const [intros, setIntros] = useState<WelcomeIntroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("প্রবাসীদের অভিযোগ");

  const [subtitle, setSubtitle] = useState(
    "আপনার সমস্যার কথা তুলে ধরুন"
  );

  const [imageUrl, setImageUrl] = useState("");

  const [duration, setDuration] = useState("2000");

  const [startAt, setStartAt] = useState("");

  const [endAt, setEndAt] = useState("");

  const [enabled, setEnabled] = useState(true);

  // =====================================================
  // LOAD INTROS
  // =====================================================

  useEffect(() => {
    const introQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      introQuery,
      (snapshot) => {
        const data: WelcomeIntroData[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<WelcomeIntroData, "id">),
        }));

        setIntros(data);
        setLoading(false);
      },
      (error) => {
        console.error("Welcome Intro Admin error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setEditingId(null);
    setTitle("প্রবাসীদের অভিযোগ");
    setSubtitle("আপনার সমস্যার কথা তুলে ধরুন");
    setImageUrl("");
    setDuration("2000");
    setStartAt("");
    setEndAt("");
    setEnabled(true);
  };

  // =====================================================
  // SAVE / UPDATE
  // =====================================================

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title দিন।");
      return;
    }

    setSaving(true);

    try {
      const introData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        imageUrl: imageUrl.trim(),
        enabled,
        duration: Math.min(
          30000,
          Math.max(500, Number(duration) || 2000)
        ),
        startAt: startAt || "",
        endAt: endAt || "",
      };

      if (editingId) {
        await updateDoc(
          doc(db, COLLECTION_NAME, editingId),
          introData
        );

        alert("Welcome Intro সফলভাবে আপডেট হয়েছে।");
      } else {
        await addDoc(collection(db, COLLECTION_NAME), {
          ...introData,
          createdAt: serverTimestamp(),
        });

        alert("Welcome Intro সফলভাবে যোগ হয়েছে।");
      }

      resetForm();
    } catch (error) {
      console.error("Welcome Intro save error:", error);

      alert(
        "Welcome Intro save করা যায়নি। Firebase Rules অথবা Login পরীক্ষা করুন।"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (intro: WelcomeIntroData) => {
    setEditingId(intro.id);

    setTitle(intro.title || "");

    setSubtitle(intro.subtitle || "");

    setImageUrl(intro.imageUrl || "");

    setDuration(String(intro.duration || 2000));

    setStartAt(intro.startAt || "");

    setEndAt(intro.endAt || "");

    setEnabled(intro.enabled !== false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // ENABLE / DISABLE
  // =====================================================

  const handleToggle = async (intro: WelcomeIntroData) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, intro.id), {
        enabled: !intro.enabled,
      });
    } catch (error) {
      console.error("Welcome Intro toggle error:", error);

      alert(
        "Status পরিবর্তন করা যায়নি। Firebase Rules পরীক্ষা করুন।"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (introId: string) => {
    const confirmed = window.confirm(
      "এই Welcome Intro কি সত্যিই Delete করতে চান?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, introId));

      if (editingId === introId) {
        resetForm();
      }

      alert("Welcome Intro Delete হয়েছে।");
    } catch (error) {
      console.error("Welcome Intro delete error:", error);

      alert(
        "Delete করা যায়নি। Firebase Rules পরীক্ষা করুন।"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-500">
          Welcome Intro loading...
        </p>
      </div>
    );
  }

  // =====================================================
  // ADMIN UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
         FORM
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

        <div className="mb-5 flex items-center justify-between gap-3">

          <div>
            <h3 className="text-lg font-black text-slate-900">
              {editingId
                ? "✏️ Welcome Intro Edit"
                : "➕ নতুন Welcome Intro"}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              ওয়েবসাইট খোলার সময় দেখানোর Intro এখান থেকে নিয়ন্ত্রণ করুন।
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}

        </div>

        {/* Title */}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="প্রবাসীদের অভিযোগ"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Subtitle */}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Subtitle
          </label>

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="আপনার সমস্যার কথা তুলে ধরুন"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Image URL */}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Intro Image URL
          </label>

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="খালি রাখলে মূল Website Logo দেখাবে"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            খালি রাখলে automatically
            <span className="font-bold text-emerald-600">
              {" "}PROBASHIDER OVIJOG.png
            </span>
            {" "}Logo ব্যবহার হবে।
          </p>
        </div>

        {/* Duration */}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Duration (milliseconds)
          </label>

          <input
            type="number"
            min="500"
            max="30000"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            2000 = ২ সেকেন্ড
          </p>
        </div>

        {/* Date */}

        <div className="mb-4 grid gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Start Date / Time
            </label>

            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              End Date / Time
            </label>

            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

        </div>

        {/* Enabled */}

        <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">

          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-5 w-5 accent-emerald-600"
          />

          <span className="text-sm font-bold text-slate-700">
            Intro Enabled
          </span>

        </label>

        {/* Save */}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : editingId
            ? "💾 Update Welcome Intro"
            : "💾 Save Welcome Intro"}
        </button>

      </div>

      {/* =================================================
         EXISTING INTROS
      ================================================== */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <h3 className="text-lg font-black text-slate-900">
            📋 Saved Welcome Intros
          </h3>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {intros.length}
          </span>

        </div>

        {intros.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

            <div className="text-3xl">
              👋
            </div>

            <p className="mt-2 text-sm font-bold text-slate-700">
              এখনো কোনো Welcome Intro তৈরি করা হয়নি।
            </p>

            <p className="mt-1 text-xs text-slate-500">
              উপরের Form থেকে প্রথম Intro তৈরি করুন।
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {intros.map((intro) => {

              const active = isIntroCurrentlyActive(intro);

              const displayImage =
                intro.imageUrl?.trim() || DEFAULT_LOGO;

              return (
                <div
                  key={intro.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">

                    {/* Image */}

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImage}
                        alt={intro.title || "Welcome Intro"}
                        className="h-full w-full object-contain"
                      />

                    </div>

                    {/* Information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h4 className="truncate text-base font-black text-slate-900">
                          {intro.title || "Untitled Intro"}
                        </h4>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                            active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {active ? "ACTIVE" : "DISABLED"}
                        </span>

                      </div>

                      {intro.subtitle && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {intro.subtitle}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">

                        <span>
                          ⏱ {intro.duration || 2000}ms
                        </span>

                        {intro.startAt && (
                          <span>
                            ▶ {intro.startAt}
                          </span>
                        )}

                        {intro.endAt && (
                          <span>
                            ⏹ {intro.endAt}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex shrink-0 flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() => handleToggle(intro)}
                        className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                          intro.enabled
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {intro.enabled ? "Disable" : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(intro)}
                        className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(intro.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}