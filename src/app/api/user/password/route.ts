import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// PATCH - Change user password
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return errorResponse("New password must be at least 6 characters", 400);
    }

    // Get user with password
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)));

    if (!user || !user.passwordHash) {
      return errorResponse("User not found", 404);
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      return errorResponse("Current password is incorrect", 400);
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, parseInt(session.user.id)));

    return successResponse({ message: "Password changed successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
