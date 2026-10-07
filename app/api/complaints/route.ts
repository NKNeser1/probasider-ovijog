import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Complaints API is working",
    },
    { status: 200 }
  );
}