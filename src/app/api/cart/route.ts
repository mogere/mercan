import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { cart, products } from "@/../db/schema";
import { eq, and } from "drizzle-orm";

// GET - Fetch user's cart items from database
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Fetch cart items with product details
    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
        inStock: products.inStock,
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart in database
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product || product.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
      .limit(1);

    if (existingCartItem.length > 0) {
      // Update quantity
      const updatedItem = await db
        .update(cart)
        .set({ quantity: existingCartItem[0].quantity + quantity })
        .where(eq(cart.id, existingCartItem[0].id))
        .returning();

      return NextResponse.json(
        { message: "Cart updated", item: updatedItem[0] },
        { status: 200 }
      );
    } else {
      // Add new item
      const newItem = await db
        .insert(cart)
        .values({
          userId,
          productId,
          quantity,
        })
        .returning();

      return NextResponse.json(
        { message: "Item added to cart", item: newItem[0] },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart or clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { productId, clearAll } = body;

    if (clearAll) {
      // Clear entire cart
      await db.delete(cart).where(eq(cart.userId, userId));
      return NextResponse.json(
        { message: "Cart cleared successfully" },
        { status: 200 }
      );
    } else if (productId) {
      // Remove specific item
      await db
        .delete(cart)
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
      return NextResponse.json(
        { message: "Item removed from cart" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Product ID or clearAll flag is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
