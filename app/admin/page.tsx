"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { db, default as app } from "@/lib/firebase";
import { WelcomeIntroAdmin } from "@/components/WelcomeIntro";

  
/* =========================================================
   TYPES
========================================================= */

type Complaint = {
  id: string;
  complaintNumber?: string;
  country?: string;
  city?: string;
  category?: string;
  title?: string;
  company?: string;
  details?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  views?: number;
  createdAt?: Timestamp;
};

type HelpRequest = {
  id: string;
  title?: string;
  problem?: string;
  details?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  address?: string;
  status?: string;
  views?: number;
  createdAt?: Timestamp;
};

type HelpOffer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  message?: string;
  details?: string;
  howCanHelp?: string;
  createdAt?: Timestamp;
};

type Sponsor = {
  id: string;
  name?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  link?: string;
  startAt?: string;
  endAt?: string;
  active?: boolean;
  createdAt?: Timestamp;
};

type SiteStats = {
  totalViews?: number;
  activeViews?: number;
  todayViews?: number;
  weeklyViews?: number;
  monthlyViews?: number;
};

/* =========================================================
   SPONSOR CAROUSEL
========================================================= */

type SponsorCarouselProps = {
  sponsors: Sponsor[];
  bn: boolean;
};

function SponsorCarousel({
  sponsors,
  bn,
}: SponsorCarouselProps) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const currentSponsor =
    sponsors[currentIndex];

  /* -------------------------
     IMAGE AUTO SLIDE
  -------------------------- */

  useEffect(() => {
    if (
      sponsors.length <= 1 ||
      !currentSponsor ||
      currentSponsor.mediaType !== "image"
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex(
        (previous) =>
          (previous + 1) % sponsors.length
      );
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    sponsors.length,
    currentSponsor,
  ]);

  /* -------------------------
     VIDEO PLAY
  -------------------------- */

  useEffect(() => {
    if (
      !currentSponsor ||
      currentSponsor.mediaType !== "video"
    ) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser may block autoplay.
      }
    };

    playVideo();
  }, [currentIndex, currentSponsor]);

  /* -------------------------
     NEXT
  -------------------------- */

  const nextSlide = () => {
    setCurrentIndex(
      (previous) =>
        (previous + 1) % sponsors.length
    );
  };

  /* -------------------------
     PREVIOUS
  -------------------------- */

  const previousSlide = () => {
    setCurrentIndex(
      (previous) =>
        previous === 0
          ? sponsors.length - 1
          : previous - 1
    );
  };

  if (!currentSponsor) {
    return null;
  }

  const mediaContent =
    currentSponsor.mediaType === "video" ? (
      <video
        ref={videoRef}
        key={currentSponsor.mediaUrl}
        src={currentSponsor.mediaUrl}
        muted
        playsInline
        controls
        onEnded={nextSlide}
        className="block max-h-[420px] w-full bg-black object-contain"
      />
      
        ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={currentSponsor.mediaUrl}
        
        src={currentSponsor.mediaUrl}
        alt={
          currentSponsor.name ||
          "Sponsor"
        }
        className="block max-h-[420px] w-full bg-slate-50 object-contain"
      />
    );

  const content = (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

      {mediaContent}

      {/* IMAGE CONTROLS */}

      {currentSponsor.mediaType ===
        "image" &&
        sponsors.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">

            <button
              type="button"
              onClick={previousSlide}
              aria-label={
                bn
                  ? "আগের ছবি"
                  : "Previous image"
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-xl font-black text-white shadow-lg backdrop-blur-md transition hover:bg-black/80"
            >
              ←
            </button>

            <div className="rounded-full bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur-md">
              {currentIndex + 1}/
              {sponsors.length}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label={
                bn
                  ? "পরের ছবি"
                  : "Next image"
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-xl font-black text-white shadow-lg backdrop-blur-md transition hover:bg-black/80"
            >
              →
            </button>

          </div>
        )}

      {/* VIDEO COUNTER */}

      {currentSponsor.mediaType ===
        "video" &&
        sponsors.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur-md">
            {currentIndex + 1}/
            {sponsors.length}
          </div>
        )}

      {/* DOTS */}

      {sponsors.length > 1 && (
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/45 px-3 py-2 backdrop-blur-md">
          {sponsors.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Slide ${
                  index + 1
                }`}
                className={`h-2 w-2 rounded-full transition ${
                  index === currentIndex
                    ? "w-5 bg-white"
                    : "bg-white/50"
                }`}
              />
            )
          )}
        </div>
      )}

    </div>
  );

  if (currentSponsor.link) {
    return (
      <a
        href={currentSponsor.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

/* =========================================================
   MAIN ADMIN PAGE
========================================================= */

export default function AdminPage() {
  const [language, setLanguage] =
    useState<"bn" | "en">("bn");

  const bn = language === "bn";

  const [user, setUser] =
    useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loginError, setLoginError] =
    useState("");

  const [loggingIn, setLoggingIn] =
    useState(false);

  const [complaints, setComplaints] =
    useState<Complaint[]>([]);

  const [loadingComplaints, setLoadingComplaints] =
    useState(false);

  const [helpRequests, setHelpRequests] =
    useState<HelpRequest[]>([]);

  const [loadingHelp, setLoadingHelp] =
    useState(false);

  const [helpOffers, setHelpOffers] =
    useState<Record<string, HelpOffer[]>>(
      {}
    );

  const [sponsors, setSponsors] =
    useState<Sponsor[]>([]);

  const [loadingSponsors, setLoadingSponsors] =
    useState(false);

  const [sponsorName, setSponsorName] =
    useState("");

  const [sponsorLink, setSponsorLink] =
    useState("");

  const [sponsorStart, setSponsorStart] =
    useState("");

  const [sponsorEnd, setSponsorEnd] =
    useState("");

  const [sponsorActive, setSponsorActive] =
    useState(true);

  const [sponsorFiles, setSponsorFiles] =
    useState<File[]>([]);

  const [uploadingSponsor, setUploadingSponsor] =
    useState(false);

  const [sponsorMessage, setSponsorMessage] =
    useState("");

  const [siteStats, setSiteStats] =
    useState<SiteStats>({});

  const [actionId, setActionId] =
    useState("");

  /* =========================================================
     AUTH
  ========================================================== */

  useEffect(() => {
  const auth = getAuth(app);

  const unsubscribe =
    onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          setCheckingAuth(false);
          return;
        }

        try {
          const tokenResult =
            await currentUser.getIdTokenResult();

          const isAdmin =
            tokenResult.claims.admin === true;

          if (!isAdmin) {
            setUser(null);

            await signOut(auth);

            setLoginError(
              bn
                ? "আপনার এই Admin Panel ব্যবহারের অনুমতি নেই।"
                : "You are not authorized to access this Admin Panel."
            );

            setCheckingAuth(false);
            return;
          }

          setUser(currentUser);
        } catch (error) {
          console.error(
            "Admin authorization error:",
            error
          );

          setUser(null);

          await signOut(auth);

          setLoginError(
            bn
              ? "Admin অনুমোদন যাচাই করা যায়নি।"
              : "Admin authorization could not be verified."
          );
        } finally {
          setCheckingAuth(false);
        }
      }
    );

  return () => unsubscribe();
}, [bn]);

  /* =========================================================
     COMPLAINT LISTENER
  ========================================================== */

  useEffect(() => {
    if (!user) {
      
      return;
    }

    
    const complaintsQuery =
      query(
        collection(db, "complaints"),
        orderBy("createdAt", "desc")
      );

    const unsubscribe =
      onSnapshot(
        complaintsQuery,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            ) as Complaint[];

          setComplaints(data);
          setLoadingComplaints(false);
        },
        (error) => {
          console.error(
            "Admin complaints error:",
            error
          );

          setLoadingComplaints(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  /* =========================================================
     HELP LISTENER
  ========================================================== */

  useEffect(() => {
    if (!user) {
      
      return;
    }

    

    const helpQuery =
      query(
        collection(db, "helpRequests"),
        orderBy("createdAt", "desc")
      );

    const unsubscribe =
      onSnapshot(
        helpQuery,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            ) as HelpRequest[];

          setHelpRequests(data);
          setLoadingHelp(false);
        },
        (error) => {
          console.error(
            "Admin help error:",
            error
          );

          setLoadingHelp(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  /* =========================================================
     HELP OFFERS LISTENER
  ========================================================== */

  useEffect(() => {
    if (
      !user ||
      helpRequests.length === 0
    ) {
      return;
    }

    const unsubscribers =
      helpRequests.map(
        (request) => {
          const offersQuery =
            query(
              collection(
                db,
                "helpRequests",
                request.id,
                "helpOffers"
              ),
              orderBy(
                "createdAt",
                "desc"
              )
            );

          return onSnapshot(
            offersQuery,
            (snapshot) => {
              const offers =
                snapshot.docs.map(
                  (item) => ({
                    id: item.id,
                    ...item.data(),
                  })
                ) as HelpOffer[];

              setHelpOffers(
                (previous) => ({
                  ...previous,
                  [request.id]:
                    offers,
                })
              );
            },
            (error) => {
              console.error(
                "Help offers error:",
                error
              );
            }
          );
        }
      );

    return () => {
      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe()
      );
    };
  }, [
    user,
    helpRequests,
  ]);

  /* =========================================================
     SPONSOR LISTENER
  ========================================================== */

  useEffect(() => {
    if (!user) {
      
      return;
    }

    

    const sponsorsQuery =
      query(
        collection(db, "sponsors"),
        orderBy("createdAt", "desc")
      );

    const unsubscribe =
      onSnapshot(
        sponsorsQuery,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            ) as Sponsor[];

          setSponsors(data);
          setLoadingSponsors(false);
        },
        (error) => {
          console.error(
            "Sponsor error:",
            error
          );

          setLoadingSponsors(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  /* =========================================================
     SITE STATS
  ========================================================== */

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe =
      onSnapshot(
        doc(
          db,
          "siteStats",
          "main"
        ),
        (snapshot) => {
          if (
            snapshot.exists()
          ) {
            setSiteStats(
              snapshot.data() as SiteStats
            );
          } else {
            setSiteStats({});
          }
        },
        (error) => {
          console.error(
            "Site stats error:",
            error
          );
        }
      );

    return () => unsubscribe();
  }, [user]);

  /* =========================================================
     METRICS
  ========================================================== */

  const publishedComplaints =
    useMemo(
      () =>
        complaints.filter(
          (item) =>
            item.status ===
            "published"
        ).length,
      [complaints]
    );

  const otherComplaints =
    complaints.length -
    publishedComplaints;

  const totalHelpRequests =
    helpRequests.length;

  const totalHelpOffers =
    Object.values(
      helpOffers
    ).reduce(
      (
        total,
        offers
      ) =>
        total +
        offers.length,
      0
    );

  const totalComplaintViews =
    complaints.reduce(
      (
        total,
        complaint
      ) =>
        total +
        Number(
          complaint.views || 0
        ),
      0
    );

  const totalHelpViews =
    helpRequests.reduce(
      (
        total,
        request
      ) =>
        total +
        Number(
          request.views || 0
        ),
      0
    );

  /* =========================================================
     FORMAT COUNT
  ========================================================== */

  const formatCount = (
    value: number = 0
  ) => {
    if (
      value >= 1000000
    ) {
      return `${(
        value / 1000000
      ).toFixed(1)}M`;
    }

    if (
      value >= 100000
    ) {
      return `${(
        value / 100000
      ).toFixed(1)}L`;
    }

    if (
      value >= 1000
    ) {
      return `${(
        value / 1000
      ).toFixed(1)}K`;
    }

    return value.toString();
  };

  /* =========================================================
     LOGIN
  ========================================================== */

  const handleLogin =
    async () => {
      if (
        !email.trim() ||
        !password.trim()
      ) {
        setLoginError(
          bn
            ? "ইমেইল এবং পাসওয়ার্ড দিন।"
            : "Enter email and password."
        );

        return;
      }

      setLoggingIn(true);
      setLoginError("");

      try {
        const auth =
          getAuth(app);

        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } catch (error) {
        console.error(
          "Admin login error:",
          error
        );

        setLoginError(
          bn
            ? "লগইন করা যায়নি। ইমেইল বা পাসওয়ার্ড সঠিক কিনা দেখুন।"
            : "Login failed. Check your email and password."
        );
      } finally {
        setLoggingIn(false);
      }
    };

  /* =========================================================
     LOGOUT
  ========================================================== */

  const handleLogout =
    async () => {
      try {
        const auth =
          getAuth(app);

        await signOut(auth);
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    };

  /* =========================================================
     PUBLISH COMPLAINT
  ========================================================== */

  const publishComplaint =
    async (
      complaintId: string
    ) => {
      setActionId(
        complaintId
      );

      try {
        await updateDoc(
          doc(
            db,
            "complaints",
            complaintId
          ),
          {
            status:
              "published",
          }
        );
      } catch (error) {
        console.error(
          "Publish complaint error:",
          error
        );

        alert(
          bn
            ? "অভিযোগ প্রকাশ করা যায়নি।"
            : "Complaint could not be published."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     DELETE COMPLAINT
  ========================================================== */

  const deleteComplaint =
    async (
      complaintId: string
    ) => {
      const confirmed =
        window.confirm(
          bn
            ? "এই অভিযোগটি কি সত্যিই ডিলিট করতে চান?"
            : "Are you sure you want to delete this complaint?"
        );

      if (!confirmed) {
        return;
      }

      setActionId(
        complaintId
      );

      try {
        await deleteDoc(
          doc(
            db,
            "complaints",
            complaintId
          )
        );
      } catch (error) {
        console.error(
          "Delete complaint error:",
          error
        );

        alert(
          bn
            ? "অভিযোগ ডিলিট করা যায়নি।"
            : "Complaint could not be deleted."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     PUBLISH HELP
  ========================================================== */

  const publishHelp =
    async (
      requestId: string
    ) => {
      setActionId(
        requestId
      );

      try {
        await updateDoc(
          doc(
            db,
            "helpRequests",
            requestId
          ),
          {
            status:
              "published",
          }
        );
      } catch (error) {
        console.error(
          "Publish help error:",
          error
        );

        alert(
          bn
            ? "Help পোস্ট প্রকাশ করা যায়নি।"
            : "Help post could not be published."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     DELETE HELP
  ========================================================== */

  const deleteHelp =
    async (
      requestId: string
    ) => {
      const confirmed =
        window.confirm(
          bn
            ? "এই Help পোস্ট এবং এর Help Offers/Advice ডিলিট করতে চান?"
            : "Delete this Help post and its offers/advice?"
        );

      if (!confirmed) {
        return;
      }

      setActionId(
        requestId
      );

      try {
        const batch =
          writeBatch(db);

        const adviceSnapshot =
          await getDocs(
            collection(
              db,
              "helpRequests",
              requestId,
              "advice"
            )
          );

        adviceSnapshot.forEach(
          (item) => {
            batch.delete(
              item.ref
            );
          }
        );

        const offersSnapshot =
          await getDocs(
            collection(
              db,
              "helpRequests",
              requestId,
              "helpOffers"
            )
          );

        offersSnapshot.forEach(
          (item) => {
            batch.delete(
              item.ref
            );
          }
        );

        batch.delete(
          doc(
            db,
            "helpRequests",
            requestId
          )
        );

        await batch.commit();

        setHelpOffers(
          (previous) => {
            const next = {
              ...previous,
            };

            delete next[
              requestId
            ];

            return next;
          }
        );
      } catch (error) {
        console.error(
          "Delete help error:",
          error
        );

        alert(
          bn
            ? "Help পোস্ট ডিলিট করা যায়নি।"
            : "Help post could not be deleted."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     SPONSOR FILE SELECT
  ========================================================== */

  const handleSponsorFiles =
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files =
        Array.from(
          event.target.files ||
            []
        );

      if (
        files.length ===
        0
      ) {
        return;
      }

      const videos =
        files.filter(
          (file) =>
            file.type.startsWith(
              "video/"
            )
        );

      const images =
        files.filter(
          (file) =>
            file.type.startsWith(
              "image/"
            )
        );

      if (
        videos.length >
          0 &&
        images.length >
          0
      ) {
        alert(
          bn
            ? "একসাথে শুধু ছবি অথবা ভিডিও নির্বাচন করুন।"
            : "Select either images or videos, not both together."
        );

        event.target.value =
          "";

        return;
      }

      if (
        videos.length >
        3
      ) {
        alert(
          bn
            ? "সর্বোচ্চ ৩টি ভিডিও আপলোড করা যাবে।"
            : "Maximum 3 videos can be uploaded at once."
        );

        event.target.value =
          "";

        return;
      }

      if (
        images.length >
        6
      ) {
        alert(
          bn
            ? "সর্বোচ্চ ৬টি ছবি আপলোড করা যাবে।"
            : "Maximum 6 images can be uploaded at once."
        );

        event.target.value =
          "";

        return;
      }

      setSponsorFiles(
        files
      );
    };

  /* =========================================================
     SPONSOR UPLOAD
  ========================================================== */

  const uploadSponsors =
    async () => {
      if (
        !sponsorName.trim()
      ) {
        alert(
          bn
            ? "Sponsor / কোম্পানির নাম দিন।"
            : "Enter sponsor/company name."
        );

        return;
      }

      if (
        sponsorFiles.length ===
        0
      ) {
        alert(
          bn
            ? "কমপক্ষে একটি ছবি বা ভিডিও নির্বাচন করুন।"
            : "Select at least one image or video."
        );

        return;
      }

      const cloudName =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        alert(
          bn
            ? "Cloudinary configuration পাওয়া যায়নি।"
            : "Cloudinary configuration is missing."
        );

        return;
      }

      setUploadingSponsor(
        true
      );

      setSponsorMessage(
        ""
      );

      try {
        for (
          const file of sponsorFiles
        ) {
          const formData =
            new FormData();

          formData.append(
            "file",
            file
          );

          formData.append(
            "upload_preset",
            uploadPreset
          );

          formData.append(
            "folder",
            "probashider-sponsors"
          );

          const uploadResponse =
            await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
              {
                method:
                  "POST",
                body:
                  formData,
              }
            );

          if (
            !uploadResponse.ok
          ) {
            throw new Error(
              "Cloudinary upload failed"
            );
          }

          const uploadData =
            await uploadResponse.json();

          const mediaType =
            file.type.startsWith(
              "video/"
            )
              ? "video"
              : "image";

          await addDoc(
            collection(
              db,
              "sponsors"
            ),
            {
              name:
                sponsorName.trim(),

              link:
                sponsorLink.trim(),

              mediaUrl:
                uploadData.secure_url,

              mediaType,

              startAt:
                sponsorStart ||
                "",

              endAt:
                sponsorEnd ||
                "",

              active:
                sponsorActive,

              createdAt:
                serverTimestamp(),
            }
          );
        }

        setSponsorFiles(
          []
        );

        setSponsorName(
          ""
        );

        setSponsorLink(
          ""
        );

        setSponsorStart(
          ""
        );

        setSponsorEnd(
          ""
        );

        setSponsorActive(
          true
        );

        setSponsorMessage(
          bn
            ? "Sponsor সফলভাবে যোগ হয়েছে।"
            : "Sponsor media added successfully."
        );

        const fileInput =
          document.getElementById(
            "sponsor-files"
          ) as HTMLInputElement | null;

        if (fileInput) {
          fileInput.value =
            "";
        }
      } catch (error) {
        console.error(
          "Sponsor upload error:",
          error
        );

        alert(
          bn
            ? "Sponsor upload করা যায়নি।"
            : "Sponsor upload failed."
        );
      } finally {
        setUploadingSponsor(
          false
        );
      }
    };

  /* =========================================================
     SPONSOR TOGGLE
  ========================================================== */

  const toggleSponsor =
    async (
      sponsor: Sponsor
    ) => {
      setActionId(
        sponsor.id
      );

      try {
        await updateDoc(
          doc(
            db,
            "sponsors",
            sponsor.id
          ),
          {
            active:
              !sponsor.active,
          }
        );
      } catch (error) {
        console.error(
          "Sponsor toggle error:",
          error
        );

        alert(
          bn
            ? "Sponsor status পরিবর্তন করা যায়নি।"
            : "Sponsor status could not be changed."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     DELETE SPONSOR
  ========================================================== */

  const deleteSponsor =
    async (
      sponsorId: string
    ) => {
      const confirmed =
        window.confirm(
          bn
            ? "এই Sponsor Ad ডিলিট করতে চান?"
            : "Delete this sponsor ad?"
        );

      if (!confirmed) {
        return;
      }

      setActionId(
        sponsorId
      );

      try {
        await deleteDoc(
          doc(
            db,
            "sponsors",
            sponsorId
          )
        );
      } catch (error) {
        console.error(
          "Delete sponsor error:",
          error
        );

        alert(
          bn
            ? "Sponsor ডিলিট করা যায়নি।"
            : "Sponsor could not be deleted."
        );
      } finally {
        setActionId("");
      }
    };

  /* =========================================================
     LOADING
  ========================================================== */

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-xl">

          <div className="text-3xl">
            ⏳
          </div>

          <p className="mt-3 font-bold text-slate-700">
            {bn
              ? "লোড হচ্ছে..."
              : "Loading..."}
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     LOGIN
  ========================================================== */

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-8">

        <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">

          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">

            <div className="mb-6 flex items-center justify-between">

              <Link
                href="/"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                ←{" "}
                {bn
                  ? "হোম"
                  : "Home"}
              </Link>

              <button
                type="button"
                onClick={() =>
                  setLanguage(
                    bn
                      ? "en"
                      : "bn"
                  )
                }
                className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700"
              >
                {bn
                  ? "English"
                  : "বাংলা"}
              </button>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-4xl">
                🔐
              </div>

              <h1 className="mt-5 text-2xl font-black text-slate-900">
                {bn
                  ? "অ্যাডমিন প্যানেল"
                  : "Admin Panel"}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {bn
                  ? "শুধু অনুমোদিত অ্যাডমিন এই প্যানেল ব্যবহার করতে পারবেন।"
                  : "Only authorized administrators can access this panel."}
              </p>

            </div>

            <div className="mt-8 space-y-4">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn
                    ? "ইমেইল"
                    : "Email"}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn
                    ? "পাসওয়ার্ড"
                    : "Password"}
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500"
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      handleLogin();
                    }
                  }}
                />

              </div>

              {loginError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                  {loginError}
                </div>
              )}

              <button
                type="button"
                onClick={
                  handleLogin
                }
                disabled={
                  loggingIn
                }
                className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingIn
                  ? bn
                    ? "লগইন হচ্ছে..."
                    : "Logging in..."
                  : bn
                    ? "🔐 লগইন করুন"
                    : "🔐 Login"}
              </button>

            </div>

          </div>

        </div>

      </main>
    );
  }

  /* =========================================================
     ADMIN DASHBOARD
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50 pb-12">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

          <div>

            <h1 className="text-lg font-black text-slate-900 sm:text-xl">
              🛠️{" "}
              {bn
                ? "অ্যাডমিন প্যানেল"
                : "Admin Panel"}
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              {user.email}
            </p>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setLanguage(
                  bn
                    ? "en"
                    : "bn"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
            >
              {bn
                ? "English"
                : "বাংলা"}
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
            >
              {bn
                ? "লগআউট"
                : "Logout"}
            </button>

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* TOP LINKS */}

        <div className="mb-6 flex flex-wrap gap-2">

          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ←{" "}
            {bn
              ? "হোমে ফিরে যান"
              : "Back to Home"}
          </Link>

          <Link
            href="/stats"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            📊{" "}
            {bn
              ? "পরিসংখ্যান"
              : "Statistics"}
          </Link>

        </div>

                {/* =====================================================
           WELCOME INTRO MANAGEMENT
        ====================================================== */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-black text-slate-900">
              👋{" "}
              {bn
                ? "Welcome Intro Management"
                : "Welcome Intro Management"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {bn
                ? "ওয়েবসাইট খোলার সময় দেখানো Welcome Intro এখান থেকে নিয়ন্ত্রণ করুন।"
                : "Manage the Welcome Intro shown when the website opens."}
            </p>

          </div>

          <WelcomeIntroAdmin />

        </section>
        
        {/* PRIVACY NOTICE */}

        <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex gap-3">

            <div className="text-2xl">
              🔒
            </div>

            <div>

              <h2 className="font-black text-amber-900">
                {bn
                  ? "অ্যাডমিন গোপনীয়তা"
                  : "Admin Privacy"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                {bn
                  ? "Help পোস্টের ব্যক্তিগত তথ্য এবং সাহায্য করতে চাওয়া ব্যক্তিদের ফোন, WhatsApp ও ইমেইল শুধুমাত্র অ্যাডমিন দেখতে পারবেন।"
                  : "Private information from Help posts and helper offers should only be visible to admins."}
              </p>

            </div>

          </div>

        </section>

        {/* WEBSITE ANALYTICS */}

        <section className="mb-6">

          <div className="mb-4">

            <h2 className="text-xl font-black text-slate-900">
              📈{" "}
              {bn
                ? "ওয়েবসাইট ভিউ বিশ্লেষণ"
                : "Website View Analytics"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {bn
                ? "ওয়েবসাইটের মোট ও সাম্প্রতিক ভিউয়ের হিসাব।"
                : "Website total and recent view statistics."}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="text-2xl">
                👁️
              </div>

              <div className="mt-3 text-2xl font-black text-slate-900">
                {formatCount(
                  siteStats.totalViews ||
                    0
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-slate-500">
                {bn
                  ? "মোট ভিউ"
                  : "Total views"}
              </div>

            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">

              <div className="text-2xl">
                🟢
              </div>

              <div className="mt-3 text-2xl font-black text-emerald-800">
                {formatCount(
                  siteStats.activeViews ||
                    0
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-emerald-700">
                {bn
                  ? "Active views"
                  : "Active views"}
              </div>

            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">

              <div className="text-2xl">
                📅
              </div>

              <div className="mt-3 text-2xl font-black text-blue-800">
                {formatCount(
                  siteStats.todayViews ||
                    0
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-blue-700">
                {bn
                  ? "আজকের ভিউ"
                  : "Today views"}
              </div>

            </div>

            <div className="rounded-3xl border border-purple-200 bg-purple-50 p-5 shadow-sm">

              <div className="text-2xl">
                📆
              </div>

              <div className="mt-3 text-2xl font-black text-purple-800">
                {formatCount(
                  siteStats.weeklyViews ||
                    0
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-purple-700">
                {bn
                  ? "সাপ্তাহিক ভিউ"
                  : "Weekly views"}
              </div>

            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm">

              <div className="text-2xl">
                🗓️
              </div>

              <div className="mt-3 text-2xl font-black text-orange-800">
                {formatCount(
                  siteStats.monthlyViews ||
                    0
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-orange-700">
                {bn
                  ? "মাসিক ভিউ"
                  : "Monthly views"}
              </div>

            </div>

          </div>

        </section>

        {/* MAIN METRICS */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4">

            <h2 className="text-xl font-black text-slate-900">
              📊{" "}
              {bn
                ? "সাইটের মূল হিসাব"
                : "Main Site Metrics"}
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-2xl">
                📝
              </div>

              <div className="mt-2 text-2xl font-black text-slate-900">
                {formatCount(
                  complaints.length
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-slate-500">
                {bn
                  ? "মোট অভিযোগ"
                  : "Total complaints"}
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-2xl">
                ✅
              </div>

              <div className="mt-2 text-2xl font-black text-emerald-800">
                {formatCount(
                  publishedComplaints
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-emerald-700">
                {bn
                  ? "প্রকাশিত অভিযোগ"
                  : "Published complaints"}
              </div>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <div className="text-2xl">
                🆘
              </div>

              <div className="mt-2 text-2xl font-black text-orange-800">
                {formatCount(
                  totalHelpRequests
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-orange-700">
                {bn
                  ? "হেল্প চাই"
                  : "People needing help"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-2xl">
                ⏳
              </div>

              <div className="mt-2 text-2xl font-black text-slate-700">
                {formatCount(
                  otherComplaints
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-slate-500">
                {bn
                  ? "অন্যান্য / অপেক্ষমাণ"
                  : "Other / pending"}
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <div className="text-2xl">
                🤝
              </div>

              <div className="mt-2 text-2xl font-black text-blue-800">
                {formatCount(
                  totalHelpOffers
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-blue-700">
                {bn
                  ? "সাহায্য করতে চাওয়া ব্যক্তি"
                  : "People offering help"}
              </div>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <div className="text-2xl">
                👁️
              </div>

              <div className="mt-2 text-2xl font-black text-purple-800">
                {formatCount(
                  totalComplaintViews
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-purple-700">
                {bn
                  ? "অভিযোগের মোট ভিউ"
                  : "Complaint views"}
              </div>
            </div>

            <div className="rounded-2xl bg-cyan-50 p-4">
              <div className="text-2xl">
                👀
              </div>

              <div className="mt-2 text-2xl font-black text-cyan-800">
                {formatCount(
                  totalHelpViews
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-cyan-700">
                {bn
                  ? "Help পোস্টের মোট ভিউ"
                  : "Help post views"}
              </div>
            </div>

            <div className="rounded-2xl bg-pink-50 p-4">
              <div className="text-2xl">
                📢
              </div>

              <div className="mt-2 text-2xl font-black text-pink-800">
                {formatCount(
                  sponsors.length
                )}
              </div>

              <div className="mt-1 text-xs font-bold text-pink-700">
                {bn
                  ? "মোট Sponsor Media"
                  : "Total sponsor media"}
              </div>
            </div>

          </div>

        </section>

        {/* =====================================================
           SPONSOR MANAGEMENT
        ====================================================== */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-black text-slate-900">
              📢{" "}
              {bn
                ? "Sponsor Management"
                : "Sponsor Management"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {bn
                ? "একসাথে একাধিক ছবি অথবা ভিডিও Sponsor হিসেবে যোগ করতে পারবেন।"
                : "Add multiple images or videos as sponsor media."}
            </p>

          </div>

          <div className="grid gap-4">

            {/* SPONSOR NAME */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn
                  ? "Sponsor / কোম্পানির নাম"
                  : "Sponsor / Company name"}
              </label>

              <input
                type="text"
                value={
                  sponsorName
                }
                onChange={(
                  event
                ) =>
                  setSponsorName(
                    event
                      .target
                      .value
                  )
                }
                placeholder={
                  bn
                    ? "যেমন: ABC Company"
                    : "Example: ABC Company"
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            {/* SPONSOR LINK */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn
                  ? "Sponsor Link"
                  : "Sponsor Link"}
              </label>

              <input
                type="url"
                value={
                  sponsorLink
                }
                onChange={(
                  event
                ) =>
                  setSponsorLink(
                    event
                      .target
                      .value
                  )
                }
                placeholder="https://example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            {/* DATES */}

            <div className="grid grid-cols-2 gap-3">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn
                    ? "Start Time"
                    : "Start Time"}
                </label>

                <input
                  type="date"
                  value={
                    sponsorStart
                  }
                  onChange={(
                    event
                  ) =>
                    setSponsorStart(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {bn
                    ? "End Time"
                    : "End Time"}
                </label>

                <input
                  type="date"
                  value={
                    sponsorEnd
                  }
                  onChange={(
                    event
                  ) =>
                    setSponsorEnd(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

            {/* FILE SELECT */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {bn
                  ? "ছবি / ভিডিও নির্বাচন করুন"
                  : "Select images / videos"}
              </label>

              <input
                id="sponsor-files"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={
                  handleSponsorFiles
                }
                className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-medium text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {bn
                  ? "সর্বোচ্চ ৬টি ছবি অথবা ৩টি ভিডিও নির্বাচন করুন। ছবি ও ভিডিও একসাথে নয়।"
                  : "Select up to 6 images or 3 videos. Do not mix images and videos."}
              </p>

              {sponsorFiles.length >
                0 && (
                <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  {sponsorFiles.length}{" "}
                  {bn
                    ? "টি ফাইল নির্বাচিত"
                    : "file(s) selected"}
                </div>
              )}

            </div>

            {/* ACTIVE */}

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">

              <input
                type="checkbox"
                checked={
                  sponsorActive
                }
                onChange={(
                  event
                ) =>
                  setSponsorActive(
                    event
                      .target
                      .checked
                  )
                }
                className="h-5 w-5 accent-emerald-600"
              />

              <span className="text-sm font-bold text-slate-700">
                {bn
                  ? "সাথে সাথে Active রাখুন"
                  : "Keep active immediately"}
              </span>

            </label>

            {/* UPLOAD */}

            <button
              type="button"
              onClick={
                uploadSponsors
              }
              disabled={
                uploadingSponsor
              }
              className="rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingSponsor
                ? bn
                  ? "আপলোড হচ্ছে..."
                  : "Uploading..."
                : bn
                  ? "📤 Sponsor যোগ করুন"
                  : "📤 Add Sponsor"}
            </button>

            {sponsorMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {
                  sponsorMessage
                }
              </div>
            )}

          </div>

          {/* EXISTING SPONSORS */}

          <div className="mt-8 border-t border-slate-200 pt-6">

            <h3 className="mb-4 text-lg font-black text-slate-900">
              {bn
                ? "যোগ করা Sponsor"
                : "Added Sponsors"}
            </h3>

            {loadingSponsors ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
                {bn
                  ? "লোড হচ্ছে..."
                  : "Loading..."}
              </div>
            ) : sponsors.length ===
              0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                {bn
                  ? "এখনও কোনো Sponsor যোগ করা হয়নি।"
                  : "No sponsors added yet."}
              </div>
            ) : (
              <div className="space-y-6">

                {/* ONE CAROUSEL CARD */}

                <SponsorCarousel
                  sponsors={
                    sponsors
                  }
                  bn={bn}
                />

                {/* SPONSOR CONTROLS */}

                <div className="space-y-3">

                  {sponsors.map(
                    (
                      sponsor
                    ) => (
                      <div
                        key={
                          sponsor.id
                        }
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="font-bold text-slate-800">
                              {
                                sponsor.name ||
                                "Sponsor"
                              }
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                                sponsor.active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {sponsor.active
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {sponsor.mediaType ===
                            "video"
                              ? "🎥 Video"
                              : "🖼️ Image"}
                          </div>

                        </div>

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              toggleSponsor(
                                sponsor
                              )
                            }
                            disabled={
                              actionId ===
                              sponsor.id
                            }
                            className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            {sponsor.active
                              ? "⏸"
                              : "▶"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSponsor(
                                sponsor.id
                              )
                            }
                            disabled={
                              actionId ===
                              sponsor.id
                            }
                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            🗑️
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </section>

        {/* =====================================================
           COMPLAINT MANAGEMENT
        ====================================================== */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-black text-slate-900">
              📝{" "}
              {bn
                ? "অভিযোগ ব্যবস্থাপনা"
                : "Complaint Management"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {bn
                ? `${complaints.length}টি অভিযোগ পাওয়া গেছে`
                : `${complaints.length} complaints found`}
            </p>

          </div>

          {loadingComplaints ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center font-bold text-slate-500">
              {bn
                ? "অভিযোগ লোড হচ্ছে..."
                : "Loading complaints..."}
            </div>
          ) : complaints.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center font-semibold text-slate-500">
              {bn
                ? "কোনো অভিযোগ পাওয়া যায়নি।"
                : "No complaints found."}
            </div>
          ) : (
            <div className="space-y-4">

              {complaints.map(
                (
                  complaint
                ) => (
                  <div
                    key={
                      complaint.id
                    }
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                            {
                              complaint.complaintNumber ||
                              complaint.id
                            }
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              complaint.status ===
                              "published"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {complaint.status ===
                            "published"
                              ? bn
                                ? "প্রকাশিত"
                                : "Published"
                              : bn
                                ? "অপেক্ষমাণ"
                                : "Pending"}
                          </span>

                        </div>

                        <h3 className="mt-3 text-lg font-black text-slate-900">
                          {
                            complaint.title ||
                            "Untitled complaint"
                          }
                        </h3>

                      </div>

                      <div className="text-right text-xs text-slate-500">
                        👁️{" "}
                        {formatCount(
                          complaint.views ||
                            0
                        )}
                      </div>

                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">

                      <div>
                        🌍{" "}
                        <strong>
                          {bn
                            ? "দেশ:"
                            : "Country:"}
                        </strong>{" "}
                        {
                          complaint.country ||
                          "-"
                        }
                      </div>

                      <div>
                        📍{" "}
                        <strong>
                          {bn
                            ? "শহর:"
                            : "City:"}
                        </strong>{" "}
                        {
                          complaint.city ||
                          "-"
                        }
                      </div>

                      <div>
                        🏷️{" "}
                        <strong>
                          {bn
                            ? "ক্যাটাগরি:"
                            : "Category:"}
                        </strong>{" "}
                        {
                          complaint.category ||
                          "-"
                        }
                      </div>

                      <div>
                        🏢{" "}
                        <strong>
                          {bn
                            ? "কোম্পানি:"
                            : "Company:"}
                        </strong>{" "}
                        {
                          complaint.company ||
                          "-"
                        }
                      </div>

                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4">

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {
                          complaint.details ||
                          "-"
                        }
                      </p>

                    </div>

                    {(complaint.name ||
                      complaint.email ||
                      complaint.phone) && (
                      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                        <h4 className="font-black text-blue-900">
                          👤{" "}
                          {bn
                            ? "Submitter তথ্য"
                            : "Submitter information"}
                        </h4>

                        <div className="mt-3 grid gap-2 text-sm text-blue-900 sm:grid-cols-3">

                          {complaint.name && (
                            <div>
                              <strong>
                                {bn
                                  ? "নাম:"
                                  : "Name:"}
                              </strong>{" "}
                              {
                                complaint.name
                              }
                            </div>
                          )}

                          {complaint.email && (
                            <div className="break-all">
                              <strong>
                                Email:
                              </strong>{" "}
                              {
                                complaint.email
                              }
                            </div>
                          )}

                          {complaint.phone && (
                            <div>
                              <strong>
                                {bn
                                  ? "ফোন:"
                                  : "Phone:"}
                              </strong>{" "}
                              {
                                complaint.phone
                              }
                            </div>
                          )}

                        </div>

                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">

                      {complaint.status !==
                        "published" && (
                        <button
                          type="button"
                          onClick={() =>
                            publishComplaint(
                              complaint.id
                            )
                          }
                          disabled={
                            actionId ===
                            complaint.id
                          }
                          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {actionId ===
                          complaint.id
                            ? "..."
                            : bn
                              ? "✅ প্রকাশ করুন"
                              : "✅ Publish"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteComplaint(
                            complaint.id
                          )
                        }
                        disabled={
                          actionId ===
                          complaint.id
                        }
                        className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        🗑️{" "}
                        {bn
                          ? "ডিলিট"
                          : "Delete"}
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =====================================================
           HELP MANAGEMENT
        ====================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-black text-slate-900">
              🆘{" "}
              {bn
                ? "Help Request Management"
                : "Help Request Management"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {bn
                ? "যারা সমস্যায় পড়ে সাহায্য চেয়েছেন এবং যারা সাহায্য করতে চেয়েছেন—দুই পক্ষের তথ্য এখানে দেখা যাবে।"
                : "View help requests and private helper information."}
            </p>

          </div>

          {loadingHelp ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center font-bold text-slate-500">
              {bn
                ? "Help পোস্ট লোড হচ্ছে..."
                : "Loading help requests..."}
            </div>
          ) : helpRequests.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center font-semibold text-slate-500">
              {bn
                ? "এখনও কোনো Help Request নেই।"
                : "No help requests yet."}
            </div>
          ) : (
            <div className="space-y-5">

              {helpRequests.map(
                (
                  request
                ) => {

                  const offers =
                    helpOffers[
                      request.id
                    ] || [];

                  return (
                    <div
                      key={
                        request.id
                      }
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >

                      {/* HELP HEADER */}

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div>

                          <div className="flex flex-wrap gap-2">

                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                              🆘{" "}
                              {bn
                                ? "Help"
                                : "Help"}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${
                                request.status ===
                                "published"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {request.status ===
                              "published"
                                ? bn
                                  ? "প্রকাশিত"
                                  : "Published"
                                : bn
                                  ? "অপেক্ষমাণ"
                                  : "Pending"}
                            </span>

                          </div>

                          <h3 className="mt-3 text-lg font-black text-slate-900">
                            {
                              request.title ||
                              request.problem ||
                              "Help request"
                            }
                          </h3>

                        </div>

                        <div className="text-right text-xs font-bold text-slate-500">
                          👁️{" "}
                          {formatCount(
                            request.views ||
                              0
                          )}
                        </div>

                      </div>

                      {/* PROBLEM */}

                      <div className="mt-4 rounded-2xl bg-white p-4">

                        <h4 className="font-black text-slate-900">
                          {bn
                            ? "সমস্যার বিবরণ"
                            : "Problem details"}
                        </h4>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {
                            request.details ||
                            request.problem ||
                            "-"
                          }
                        </p>

                      </div>

                      {/* PRIVATE USER */}

                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">

                        <h4 className="font-black text-red-900">
                          🔒{" "}
                          {bn
                            ? "ব্যক্তিগত তথ্য — শুধু অ্যাডমিন"
                            : "Private information — Admin only"}
                        </h4>

                        <div className="mt-3 grid gap-3 text-sm text-red-900 sm:grid-cols-2">

                          {request.name && (
                            <div>
                              <strong>
                                {bn
                                  ? "নাম:"
                                  : "Name:"}
                              </strong>{" "}
                              {
                                request.name
                              }
                            </div>
                          )}

                          {request.phone && (
                            <div>
                              <strong>
                                {bn
                                  ? "ফোন:"
                                  : "Phone:"}
                              </strong>{" "}
                              {
                                request.phone
                              }
                            </div>
                          )}

                          {request.whatsapp && (
                            <div>
                              <strong>
                                WhatsApp:
                              </strong>{" "}
                              {
                                request.whatsapp
                              }
                            </div>
                          )}

                          {request.email && (
                            <div className="break-all">
                              <strong>
                                Email:
                              </strong>{" "}
                              {
                                request.email
                              }
                            </div>
                          )}

                          {request.country && (
                            <div>
                              <strong>
                                {bn
                                  ? "দেশ:"
                                  : "Country:"}
                              </strong>{" "}
                              {
                                request.country
                              }
                            </div>
                          )}

                          {request.city && (
                            <div>
                              <strong>
                                {bn
                                  ? "শহর:"
                                  : "City:"}
                              </strong>{" "}
                              {
                                request.city
                              }
                            </div>
                          )}

                          {request.address && (
                            <div className="sm:col-span-2">
                              <strong>
                                {bn
                                  ? "ঠিকানা:"
                                  : "Address:"}
                              </strong>{" "}
                              {
                                request.address
                              }
                            </div>
                          )}

                        </div>

                      </div>

                      {/* HELP OFFERS */}

                      <div className="mt-5">

                        <div className="flex items-center justify-between gap-3">

                          <h4 className="font-black text-slate-900">
                            🤝{" "}
                            {bn
                              ? "সাহায্য করতে চাওয়া ব্যক্তিরা"
                              : "People offering help"}
                          </h4>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                            {
                              offers.length
                            }
                          </span>

                        </div>

                        {offers.length ===
                        0 ? (
                          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-500">
                            {bn
                              ? "এখনও কেউ সাহায্যের প্রস্তাব দেয়নি।"
                              : "No one has offered help yet."}
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3">

                            {offers.map(
                              (
                                offer
                              ) => (
                                <div
                                  key={
                                    offer.id
                                  }
                                  className="rounded-2xl border border-blue-200 bg-blue-50 p-4"
                                >

                                  <div className="flex items-start justify-between gap-3">

                                    <h5 className="font-black text-blue-900">
                                      🤝{" "}
                                      {
                                        offer.name ||
                                        (bn
                                          ? "নাম দেওয়া হয়নি"
                                          : "Name not provided")
                                      }
                                    </h5>

                                    <span className="text-xs font-bold text-blue-600">
                                      Private
                                    </span>

                                  </div>

                                  <div className="mt-3 grid gap-2 text-sm text-blue-900 sm:grid-cols-2">

                                    {offer.phone && (
                                      <div>
                                        <strong>
                                          {bn
                                            ? "ফোন:"
                                            : "Phone:"}
                                        </strong>{" "}
                                        {
                                          offer.phone
                                        }
                                      </div>
                                    )}

                                    {offer.whatsapp && (
                                      <div>
                                        <strong>
                                          WhatsApp:
                                        </strong>{" "}
                                        {
                                          offer.whatsapp
                                        }
                                      </div>
                                    )}

                                    {offer.email && (
                                      <div className="break-all">
                                        <strong>
                                          Email:
                                        </strong>{" "}
                                        {
                                          offer.email
                                        }
                                      </div>
                                    )}

                                  </div>

                                  {(offer.message ||
                                    offer.details ||
                                    offer.howCanHelp) && (
                                    <div className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700">
                                      {
                                        offer.message ||
                                        offer.details ||
                                        offer.howCanHelp
                                      }
                                    </div>
                                  )}

                                </div>
                              )
                            )}

                          </div>
                        )}

                      </div>

                      {/* HELP ACTIONS */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        {request.status !==
                          "published" && (
                          <button
                            type="button"
                            onClick={() =>
                              publishHelp(
                                request.id
                              )
                            }
                            disabled={
                              actionId ===
                              request.id
                            }
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {actionId ===
                            request.id
                              ? "..."
                              : bn
                                ? "✅ প্রকাশ করুন"
                                : "✅ Publish"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteHelp(
                              request.id
                            )
                          }
                          disabled={
                            actionId ===
                            request.id
                          }
                          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          🗑️{" "}
                          {bn
                            ? "ডিলিট"
                            : "Delete"}
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}