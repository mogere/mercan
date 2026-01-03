import { NextRequest, NextResponse } from "next/server";
import { db } from "@/../db";
import { newsletter } from "@/../db/schema";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    const [subscription] = await db
      .insert(newsletter)
      .values({ email: emailLower })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: subscription,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 400 }
      );
    }
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
