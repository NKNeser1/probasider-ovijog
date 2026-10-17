
import { NextResponse } from "next/server";

import {
  createHash,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function hashCode(code: string) {
  return createHash("sha256").update(code).digest();
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const complaintRef = adminDb
      .collection("complaints")
      .doc(id);

    const complaint = await complaintRef.get();

    if (!complaint.exists) {
      return NextResponse.json(
        { error: "অভিযোগ পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const snapshot = await complaintRef
      .collection("comments")
      .orderBy("createdAt", "asc")
      .get();

    const comments = snapshot.docs.map((item) => {
      const data = item.data();

      return {
        id: item.id,
        text: data.text,
        createdAt:
          data.createdAt?.toDate?.().toISOString() ?? null,
        updatedAt:
          data.updatedAt?.toDate?.().toISOString() ?? null,
      };
    });

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json(
      { error: "মন্তব্য লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    if (!text || text.length > 1000) {
      return NextResponse.json(
        { error: "মন্তব্য ১ থেকে ১০০০ অক্ষরের মধ্যে লিখুন।" },
        { status: 400 }
      );
    }

    const complaintRef = adminDb
      .collection("complaints")
      .doc(id);

    const complaint = await complaintRef.get();

    if (!complaint.exists) {
      return NextResponse.json(
        { error: "অভিযোগ পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const editCode = randomInt(0, 100000)
      .toString()
      .padStart(5, "0");

    const commentRef = complaintRef
      .collection("comments")
      .doc();

    await commentRef.set({
      text,
      editCodeHash: hashCode(editCode).toString("hex"),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: null,
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: commentRef.id,
        text,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      },
      editCode,
      message:
        "গোপন সম্পাদনা কোডটি সংরক্ষণ করুন। পরে এটি আবার দেখানো হবে না।",
    });
  } catch {
    return NextResponse.json(
      { error: "মন্তব্য জমা দেওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const commentId =
      typeof body.commentId === "string"
        ? body.commentId
        : "";

    const editCode =
      typeof body.editCode === "string"
        ? body.editCode.trim()
        : "";

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    if (
      !commentId ||
!/^(?:[0-9]{5}|[a-f0-9]{32})$/.test(editCode) ||
!text ||
text.length > 1000
    ) {
      return NextResponse.json(
        { error: "তথ্য সঠিক নয়। সব ঘর যাচাই করুন।" },
        { status: 400 }
      );
    }

    const commentRef = adminDb
      .collection("complaints")
      .doc(id)
      .collection("comments")
      .doc(commentId);

    const comment = await commentRef.get();

    if (!comment.exists) {
      return NextResponse.json(
        { error: "মন্তব্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const storedHash = comment.data()?.editCodeHash;

    if (
      typeof storedHash !== "string" ||
      !/^[a-f0-9]{64}$/.test(storedHash)
    ) {
      return NextResponse.json(
        { error: "সম্পাদনার অনুমতি যাচাই করা যায়নি।" },
        { status: 403 }
      );
    }

    const suppliedHash = hashCode(editCode);
    const savedHash = Buffer.from(storedHash, "hex");

    if (!timingSafeEqual(suppliedHash, savedHash)) {
      return NextResponse.json(
        { error: "গোপন কোড সঠিক নয়।" },
        { status: 403 }
      );
    }

    await commentRef.update({
      text,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "মন্তব্য সম্পাদনা হয়েছে।",
    });
  } catch {
    return NextResponse.json(
      { error: "মন্তব্য সম্পাদনা করা যায়নি।" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const commentId =
      typeof body.commentId === "string"
        ? body.commentId
        : "";

    const editCode =
      typeof body.editCode === "string"
        ? body.editCode.trim()
        : "";

    if (
      !commentId ||
      !/^(?:[0-9]{5}|[a-f0-9]{32})$/.test(editCode)
    ) {
      return NextResponse.json(
        { error: "তথ্য সঠিক নয়।" },
        { status: 400 }
      );
    }

    const commentRef = adminDb
      .collection("complaints")
      .doc(id)
      .collection("comments")
      .doc(commentId);

    const comment = await commentRef.get();

    if (!comment.exists) {
      return NextResponse.json(
        { error: "মন্তব্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const storedHash = comment.data()?.editCodeHash;

    if (
      typeof storedHash !== "string" ||
      !/^[a-f0-9]{64}$/.test(storedHash)
    ) {
      return NextResponse.json(
        { error: "অনুমতি যাচাই করা যায়নি।" },
        { status: 403 }
      );
    }

    const suppliedHash = hashCode(editCode);
    const savedHash = Buffer.from(storedHash, "hex");

    if (!timingSafeEqual(suppliedHash, savedHash)) {
      return NextResponse.json(
        { error: "গোপন কোড সঠিক নয়।" },
        { status: 403 }
      );
    }

    await commentRef.delete();

    return NextResponse.json({
      success: true,
      message: "মন্তব্য মুছে ফেলা হয়েছে।",
    });
  } catch {
    return NextResponse.json(
      { error: "মন্তব্য মুছে ফেলা যায়নি।" },
      { status: 500 }
    );
  }
}