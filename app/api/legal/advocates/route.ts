
import { NextResponse } from "next/server";
import {
  FieldValue,
} from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { verifyLegalAdmin } from "@/lib/legal-auth";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

// সক্রিয় আইনজীবীর তালিকা সবাই দেখতে পারবেন।
// নিষ্ক্রিয় আইনজীবী শুধু অনুমোদিত অ্যাডমিন দেখতে পারবেন।
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeInactive =
      url.searchParams.get("includeInactive") === "true";

    if (includeInactive) {
      const auth = await verifyLegalAdmin(request);

      if (!auth.ok) {
        return auth.response;
      }
    }

    const snapshot = await adminDb
      .collection("legalAdvocates")
      .get();

    const advocates = snapshot.docs
      .map((item) => {
        const data = item.data();

        return {
          id: item.id,
          name: data.name,
          qualifications: data.qualifications,
          active: data.active === true,
          createdAt:
            data.createdAt?.toDate?.().toISOString() ?? null,
          updatedAt:
            data.updatedAt?.toDate?.().toISOString() ?? null,
        };
      })
      .filter((advocate) =>
        includeInactive ? true : advocate.active
      )
      .sort((a, b) =>
        String(a.name ?? "").localeCompare(
          String(b.name ?? "")
        )
      );

    return NextResponse.json({
      success: true,
      advocates,
    });
  } catch (error) {
    console.error("Legal advocates GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load advocates.",
      },
      { status: 500 }
    );
  }
}

// শুধু অ্যাডমিন আইনজীবী যোগ বা সম্পাদনা করতে পারবেন।
export async function POST(request: Request) {
  try {
    const auth = await verifyLegalAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();

    const id = cleanText(body.id, 128);
    const name = cleanText(body.name, 120);
    const qualifications = cleanText(
      body.qualifications,
      1000
    );

    if (!name || !qualifications) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and qualifications are required.",
        },
        { status: 400 }
      );
    }

    const advocates = adminDb.collection("legalAdvocates");

    if (id) {
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid advocate ID.",
          },
          { status: 400 }
        );
      }

      const ref = advocates.doc(id);
      const existing = await ref.get();

      if (!existing.exists) {
        return NextResponse.json(
          {
            success: false,
            message: "Advocate not found.",
          },
          { status: 404 }
        );
      }

      await ref.update({
        name,
        qualifications,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        id,
        message: "Advocate updated.",
      });
    }

    const ref = await advocates.add({
      name,
      qualifications,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        id: ref.id,
        message: "Advocate added.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Legal advocates POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save advocate.",
      },
      { status: 500 }
    );
  }
}

// আইনজীবী স্থায়ীভাবে মুছে না দিয়ে সক্রিয়/নিষ্ক্রিয় করা হবে।
export async function PATCH(request: Request) {
  try {
    const auth = await verifyLegalAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();
    const id = cleanText(body.id, 128);

    if (
      !id ||
      !/^[A-Za-z0-9_-]{1,128}$/.test(id) ||
      typeof body.active !== "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid advocate ID and active status are required.",
        },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("legalAdvocates").doc(id);
    const existing = await ref.get();

    if (!existing.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Advocate not found.",
        },
        { status: 404 }
      );
    }

    await ref.update({
      active: body.active,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Advocate status updated.",
    });
  } catch (error) {
    console.error("Legal advocates PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update advocate status.",
      },
      { status: 500 }
    );
  }
}