import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return errorResponse("Unauthorized", 401);
    }

    const allCustomers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users);

    return successResponse(allCustomers);
  } catch (error) {
    return handleApiError(error);
  }
}
