"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard, Calendar } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/dashboard/orders/${params.id}`);
    } else if (status === "authenticated") {
      fetchOrder();
    }
  }, [status, router, params.id]);

  const fetchOrder = async () => {
    try {
      // Since we don't have an individual order endpoint, we'll get all orders and filter
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (data.success) {
        const foundOrder = data.data.find(
          (o: Order) => o.id === parseInt(params.id as string)
        );
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          router.push("/dashboard/orders");
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { name: "Pending", status: "pending" },
      { name: "Processing", status: "processing" },
      { name: "Shipped", status: "shipped" },
      { name: "Delivered", status: "delivered" },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderSteps = getStatusSteps(order.status);
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <Link href="/dashboard/orders">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order Timeline */}
      {order.status !== "cancelled" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {orderSteps.map((step, index) => (
                <div key={step.status} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-orange-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.completed ? "✓" : index + 1}
                    </div>
                    {index < orderSteps.length - 1 && (
                      <div
                        className={`flex-1 h-1 ${
                          step.completed ? "bg-orange-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      step.current ? "font-semibold text-orange-600" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {item.product.imageUrl && (
                      <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-gray-900 hover:text-orange-600 transition-colors block mb-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: KES {item.price.toLocaleString()} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        KES {(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>KES {itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>KES 0</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-orange-600">
                  KES {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">
                  {order.paymentMethod?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={getStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
