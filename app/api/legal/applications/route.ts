import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { verifyLegalAdmin } from "@/lib/legal-auth";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

const statuses = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "completed",
] as const;

type ApplicationStatus = (typeof statuses)[number];

const statusLabels: Record<string, string> = {
  pending: "অপেক্ষমাণ",
  reviewing: "পর্যালোচনা চলছে",
  approved: "অনুমোদিত",
  rejected: "প্রত্যাখ্যাত",
  completed: "সম্পন্ন",
};

// GET: Admin-এর পূর্ণ আবেদন তালিকা অথবা অভিযোগ নম্বর দিয়ে সীমিত ট্র্যাকিং।
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get("includeAll") === "true";

    if (includeAll) {
      const auth = await verifyLegalAdmin(request);
      if (!auth.ok) return auth.response;

      const snapshot = await adminDb
        .collection("legalApplications")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get();

      const applications = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          applicationNumber: data.applicationNumber ?? "",
          complaintNumber: data.complaintNumber ?? "",
          applicantName: data.applicantName ?? "",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          email: data.email ?? "",
          country: data.country ?? "",
          city: data.city ?? "",
          address: data.address ?? "",
          details: data.details ?? "",
          advocateId: data.advocateId ?? "",
          advocateName: data.advocateName ?? "",
          advocateQualifications: data.advocateQualifications ?? "",
          status: data.status ?? "pending",
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
        };
      });

      return NextResponse.json({ success: true, applications });
    }

    const complaintNumber = cleanText(
      url.searchParams.get("complaintNumber"),
      40
    ).toUpperCase();

    if (!/^PRB-\d{4}-[A-Z0-9]{8}$/.test(complaintNumber)) {
      return NextResponse.json(
        { success: false, message: "সঠিক অভিযোগ নম্বর দিন।" },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("legalApplications")
      .where("complaintNumber", "==", complaintNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        application: null,
      });
    }

    const data = snapshot.docs[0].data();

    // পাবলিক ট্র্যাকিংয়ে ব্যক্তিগত তথ্য ফেরত দেওয়া হবে না।
    return NextResponse.json({
      success: true,
      application: {
        status: statusLabels[data.status] ?? "অপেক্ষমাণ",
        advocateName: cleanText(data.advocateName, 120),
      },
    });
  } catch (error) {
    console.error("Legal applications GET error:", error);
    return NextResponse.json(
      { success: false, message: "আবেদনের তথ্য লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

// POST: অভিযোগের সঙ্গে আইনি সহায়তার আবেদন জমা।
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const complaintNumber = cleanText(body.complaintNumber, 40).toUpperCase();
    const applicantName = cleanText(body.applicantName, 120);
    const phone = cleanText(body.phone, 30);
    const whatsapp = cleanText(body.whatsapp, 30);
    const email = cleanText(body.email, 150);
    const country = cleanText(body.country, 100);
    const city = cleanText(body.city, 100);
    const address = cleanText(body.address, 300);
    const details = cleanText(body.details, 3000);
    const advocateId = cleanText(body.advocateId, 128);

    if (!/^PRB-\d{4}-[A-Z0-9]{8}$/.test(complaintNumber)) {
      return NextResponse.json(
        { success: false, message: "সঠিক অভিযোগ নম্বর দিন।" },
        { status: 400 }
      );
    }

    if (
      !applicantName ||
      !phone ||
      !country ||
      details.length < 10 ||
      !advocateId
    ) {
      return NextResponse.json(
        { success: false, message: "সব প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "সঠিক ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    const complaintSnapshot = await adminDb
      .collection("complaints")
      .where("complaintNumber", "==", complaintNumber)
      .limit(1)
      .get();

    if (complaintSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "অভিযোগ নম্বর পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const complaintDoc = complaintSnapshot.docs[0];
    const advocateSnapshot = await adminDb
      .collection("legalAdvocates")
      .doc(advocateId)
      .get();

    if (
      !advocateSnapshot.exists ||
      advocateSnapshot.data()?.active !== true
    ) {
      return NextResponse.json(
        { success: false, message: "নির্বাচিত আইনজীবী বর্তমানে সক্রিয় নন।" },
        { status: 400 }
      );
    }

    const applications = adminDb.collection("legalApplications");
    const existing = await applications
      .where("complaintDocId", "==", complaintDoc.id)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "এই অভিযোগের জন্য ইতিমধ্যে আবেদন জমা হয়েছে।",
        },
        { status: 409 }
      );
    }

    const advocate = advocateSnapshot.data();
    const ref = applications.doc();
    const applicationNumber = `LEG-${ref.id.slice(0, 12).toUpperCase()}`;

    await ref.set({
      applicationNumber,
      complaintNumber,
      complaintDocId: complaintDoc.id,
      applicantName,
      phone,
      whatsapp,
      email,
      country,
      city,
      address,
      details,
      advocateId,
      advocateName: cleanText(advocate?.name, 120),
      advocateQualifications: cleanText(advocate?.qualifications, 1000),
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        applicationNumber,
        message: "আইনি সহায়তার আবেদন জমা হয়েছে।",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Legal application POST error:", error);
    return NextResponse.json(
      { success: false, message: "আবেদন জমা দেওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

// PATCH: কেবল অনুমোদিত Admin আবেদনের স্ট্যাটাস পরিবর্তন করতে পারবেন।
export async function PATCH(request: Request) {
  try {
    const auth = await verifyLegalAdmin(request);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const id = cleanText(body.id, 128);
    const status = cleanText(body.status, 30) as ApplicationStatus;

    if (
      !/^[A-Za-z0-9_-]{1,128}$/.test(id) ||
      !statuses.includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "আবেদন ID ও সঠিক স্ট্যাটাস দিন।" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("legalApplications").doc(id);
    const existing = await ref.get();

    if (!existing.exists) {
      return NextResponse.json(
        { success: false, message: "আবেদন পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await ref.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: auth.uid,
    });

    return NextResponse.json({
      success: true,
      message: "আবেদনের স্ট্যাটাস আপডেট হয়েছে।",
    });
  } catch (error) {
    console.error("Legal application PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "স্ট্যাটাস আপডেট করা যায়নি।" },
      { status: 500 }
    );
  }
}


// DELETE: কেবল অনুমোদিত Admin নির্দিষ্ট আইনি সহায়তার আবেদন মুছতে পারবেন।
export async function DELETE(request: Request) {
  try {
    const auth = await verifyLegalAdmin(request);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const id = cleanText(body.id, 128);

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "সঠিক আবেদন ID দিন।" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("legalApplications").doc(id);
    const existing = await ref.get();

    if (!existing.exists) {
      return NextResponse.json(
        { success: false, message: "আবেদনটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await ref.delete();

    return NextResponse.json({
      success: true,
      message: "আইনি সহায়তার আবেদন মুছে ফেলা হয়েছে।",
    });
  } catch (error) {
    console.error("Legal application DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "আবেদনটি মুছে ফেলা যায়নি।" },
      { status: 500 }
    );
  }
}
