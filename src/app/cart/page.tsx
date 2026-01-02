"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.inStock ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-2">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-medium w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">
                    KES {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop" className="block w-full mt-4">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
