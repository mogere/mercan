import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { orders, orderItems, products } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const orderId = parseInt(id);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    if (order.userId !== parseInt(session.user.id) && session.user.role !== "admin") {
      return errorResponse("Unauthorized to view this order", 403);
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: {
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
        },
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    return successResponse({ ...order, items });
  } catch (error) {
    return handleApiError(error);
  }
}
