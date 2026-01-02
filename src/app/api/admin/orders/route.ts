import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { orders, orderItems, products, users } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// GET - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 403);
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    let query = db
      .select({
        id: orders.id,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        shippingAddress: orders.shippingAddress,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt));

    if (limit) {
      query = query.limit(parseInt(limit)) as any;
    }

    const allOrders = await query;

    return successResponse(allOrders);
  } catch (error) {
    return handleApiError(error);
  }
}
