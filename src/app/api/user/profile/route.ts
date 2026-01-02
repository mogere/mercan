import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return errorResponse("Name is required", 400);
    }

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({ name: name.trim() })
      .where(eq(users.id, parseInt(session.user.id)))
      .returning();

    return successResponse({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
