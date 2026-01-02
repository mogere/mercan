import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { cart } from "@/../db/schema";
import { eq, and } from "drizzle-orm";

// POST - Sync localStorage cart to database (called on login)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { items } = body; // items from localStorage

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    // Sync each item from localStorage to database
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity) continue;

      // Check if item already exists in database cart
      const existingItem = await db
        .select()
        .from(cart)
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
        .limit(1);

      if (existingItem.length > 0) {
        // Update quantity (merge: add localStorage quantity to database quantity)
        await db
          .update(cart)
          .set({ quantity: existingItem[0].quantity + quantity })
          .where(eq(cart.id, existingItem[0].id));
      } else {
        // Insert new item
        await db.insert(cart).values({
          userId,
          productId,
          quantity,
        });
      }
    }

    // Fetch updated cart from database
    const updatedCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    return NextResponse.json(
      {
        message: "Cart synced successfully",
        cart: updatedCart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json(
      { error: "Failed to sync cart" },
      { status: 500 }
    );
  }
}
