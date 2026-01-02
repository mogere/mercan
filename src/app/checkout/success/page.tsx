"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600">
                Thank you for your order. We'll send you a confirmation email
                shortly.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">#{orderId}</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Your order has been received and is being processed. We'll notify
                you when it's ready for delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="lg">
                    View Order Details
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
