"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Check,
  Loader2,
} from "lucide-react";

type PaymentMethod = "mpesa" | "cash_on_delivery";

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    items,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping info
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [mpesaPhone, setMpesaPhone] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0 && status === "authenticated") {
      router.push("/shop");
    }
  }, [items, status, router]);

  useEffect(() => {
    if (session?.user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      const orderData = {
        shippingInfo,
        paymentMethod,
        mpesaPhone: paymentMethod === "mpesa" ? mpesaPhone : null,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        router.push(`/checkout/success?orderId=${data.data.id}`);
      } else {
        alert(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span
                className={step >= 1 ? "text-orange-600 font-medium" : ""}
              >
                1. Shipping
              </span>
              <span>→</span>
              <span
                className={step >= 2 ? "text-orange-600 font-medium" : ""}
              >
                2. Payment
              </span>
              <span>→</span>
              <span
                className={step >= 3 ? "text-orange-600 font-medium" : ""}
              >
                3. Review
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Shipping Information
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="0712345678"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          required
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "cash_on_delivery"
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-6 h-6 text-gray-700" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              Cash on Delivery
                            </p>
                            <p className="text-sm text-gray-600">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "cash_on_delivery" && (
                          <Check className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                    </div>

                    {/* M-Pesa */}
                    <div
                      onClick={() => setPaymentMethod("mpesa")}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "mpesa"
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-gray-700" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              M-Pesa
                            </p>
                            <p className="text-sm text-gray-600">
                              Pay instantly with M-Pesa
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "mpesa" && (
                          <Check className="w-6 h-6 text-orange-600" />
                        )}
                      </div>

                      {paymentMethod === "mpesa" && (
                        <div className="mt-4">
                          <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                          <Input
                            id="mpesaPhone"
                            type="tel"
                            placeholder="254712345678"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      Review Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Shipping Address
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <p className="font-medium">{shippingInfo.fullName}</p>
                      <p className="text-gray-600">{shippingInfo.address}</p>
                      <p className="text-gray-600">
                        {shippingInfo.city}, {shippingInfo.postalCode}
                      </p>
                      <p className="text-gray-600">{shippingInfo.phone}</p>
                      <p className="text-gray-600">{shippingInfo.email}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Payment Method
                      </h3>
                      <button
                        onClick={() => setStep(2)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {paymentMethod === "mpesa"
                          ? "M-Pesa"
                          : "Cash on Delivery"}
                      </p>
                      {paymentMethod === "mpesa" && (
                        <p className="text-sm text-gray-600">{mpesaPhone}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h3>

                {/* Products */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/product.png"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
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
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
