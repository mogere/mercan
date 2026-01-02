import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { orders, orderItems, products } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized - Please login to place an order", 401);
    }

    const body = await request.json();
    const {
      shippingInfo,
      paymentMethod,
      mpesaPhone,
      items,
      totalAmount,
    } = body;

    // Validation
    if (!shippingInfo || !paymentMethod || !items || items.length === 0) {
      return errorResponse("Missing required fields", 400);
    }

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      return errorResponse("Complete shipping information is required", 400);
    }

    const shippingAddress = `${shippingInfo.fullName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.postalCode || ""}\nPhone: ${shippingInfo.phone}\nEmail: ${shippingInfo.email}`;


    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: parseInt(session.user.id),
        totalAmount,
        status: paymentMethod === "mpesa" ? "pending_payment" : "pending",
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending",
        mpesaTransactionId: null,
      })
      .returning();

    const orderItemsData = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.insert(orderItems).values(orderItemsData);

    if (paymentMethod === "mpesa" && mpesaPhone) {
      try {
        const mpesaResponse = await fetch(`${request.nextUrl.origin}/api/payments/mpesa/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrder.id,
            phone: mpesaPhone,
            amount: totalAmount,
          }),
        });

        const mpesaData = await mpesaResponse.json();

        if (!mpesaData.success) {
          console.error("M-Pesa initiation failed:", mpesaData.error);
        }
      } catch (mpesaError) {
        console.error("M-Pesa API error:", mpesaError);
      }
    }

    return successResponse(newOrder, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = parseInt(session.user.id);

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
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
          .where(eq(orderItems.orderId, order.id));

        return { ...order, items };
      })
    );

    return successResponse(ordersWithItems);
  } catch (error) {
    return handleApiError(error);
  }
}
