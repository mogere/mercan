import { NextRequest } from "next/server";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return successResponse({ message: "If an account exists, a password reset email has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await db
      .update(users)
      .set({
        resetToken,
        resetTokenExpiry,
      })
      .where(eq(users.id, user.id));

    const emailResult = await sendPasswordResetEmail(user.email, resetToken);

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
    }

    return successResponse({ message: "If an account exists, a password reset email has been sent." });
  } catch (error) {
    return handleApiError(error);
  }
}
