import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { orders } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// PATCH - Update order status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 403);
    }

    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return errorResponse("Status is required", 400);
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return errorResponse("Invalid status", 400);
    }

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: status.toLowerCase() })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      return errorResponse("Order not found", 404);
    }

    return successResponse(updatedOrder);
  } catch (error) {
    return handleApiError(error);
  }
}
