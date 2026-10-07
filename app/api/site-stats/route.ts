import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Session ID is required",
        },
        { status: 400 }
      );
    }

    const sessionRef = adminDb
      .collection("siteStats")
      .doc("sessions")
      .collection("active")
      .doc(sessionId);

    const statsRef = adminDb.collection("siteStats").doc("main");

    const sessionSnap = await sessionRef.get();

    // ----------------------------------------
    // নতুন session হলে Total Views +1
    // ----------------------------------------
    if (!sessionSnap.exists) {
      await sessionRef.set({
        createdAt: FieldValue.serverTimestamp(),
        lastActiveAt: FieldValue.serverTimestamp(),
      });

      await statsRef.set(
        {
          totalViews: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // ----------------------------------------
      // পুরোনো session-এর activity update
      // ----------------------------------------
      await sessionRef.update({
        lastActiveAt: FieldValue.serverTimestamp(),
      });
    }

    // ----------------------------------------
    // বর্তমান সময়
    // ----------------------------------------
    const now = new Date();

    // ----------------------------------------
    // চলতি সপ্তাহের শুরু
    // সোমবার = সপ্তাহের প্রথম দিন
    // ----------------------------------------
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();

    const daysFromMonday = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // ----------------------------------------
    // চলতি মাসের শুরু
    // ----------------------------------------
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    // ----------------------------------------
    // চলতি মাসের session সংগ্রহ
    // ----------------------------------------
    const monthlySessionsSnapshot = await adminDb
      .collection("siteStats")
      .doc("sessions")
      .collection("active")
      .where(
        "createdAt",
        ">=",
        Timestamp.fromDate(startOfMonth)
      )
      .get();

    let monthlyViews = 0;
    let weeklyViews = 0;

    // ----------------------------------------
    // Monthly + Weekly Views গণনা
    // ----------------------------------------
    monthlySessionsSnapshot.forEach((doc) => {
      const data = doc.data();

      monthlyViews++;

      if (
        data.createdAt &&
        data.createdAt.toDate() >= startOfWeek
      ) {
        weeklyViews++;
      }
    });

    // ----------------------------------------
    // গত ৫ মিনিটের Active session গণনা
    // ----------------------------------------
    const fiveMinutesAgo = Timestamp.fromMillis(
      Date.now() - 5 * 60 * 1000
    );

    const activeSessionsSnapshot = await adminDb
      .collection("siteStats")
      .doc("sessions")
      .collection("active")
      .where("lastActiveAt", ">=", fiveMinutesAgo)
      .get();

    const activeViews = activeSessionsSnapshot.size;

    // ----------------------------------------
    // সব Statistics আপডেট
    // ----------------------------------------
    await statsRef.set(
      {
        weeklyViews,
        monthlyViews,
        activeViews,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      activeViews,
      weeklyViews,
      monthlyViews,
    });
  } catch (error) {
    console.error("Site stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update site statistics",
      },
      { status: 500 }
    );
  }
}