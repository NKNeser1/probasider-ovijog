
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import adminApp from "@/lib/firebase-admin";

export async function verifyLegalAdmin(
  request: Request
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      ),
    };
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token.",
        },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded =
      await getAuth(adminApp).verifyIdToken(token);

    if (decoded.admin !== true) {
      return {
        ok: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Administrator access required.",
          },
          { status: 403 }
        ),
      };
    }

    return {
      ok: true as const,
      uid: decoded.uid,
    };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Invalid or expired authentication token.",
        },
        { status: 401 }
      ),
    };
  }
}