"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  items: OrderItem[];
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchOrder();
    }
  }, [session, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (data.success) {
        const foundOrder = data.data.find(
          (o: any) => o.id === parseInt(params.id as string)
        );

        if (foundOrder) {
          // Fetch order items separately
          const itemsRes = await fetch(`/api/orders`);
          const itemsData = await itemsRes.json();

          if (itemsData.success) {
            const fullOrder = itemsData.data.find(
              (o: any) => o.id === parseInt(params.id as string)
            );
            if (fullOrder) {
              setOrder(fullOrder);
              setNewStatus(fullOrder.status);
            }
          }
        } else {
          router.push("/admin/orders");
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.status) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setOrder({ ...order!, status: newStatus });
        alert("Order status updated successfully");
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred");
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <Link href="/admin/orders">
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
              Customer ID: {order.userId} • {new Date(order.createdAt).toLocaleDateString("en-US", {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
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
                      <p className="font-semibold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × KES {item.price.toLocaleString()}
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

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === order.status}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>KES {order.totalAmount.toLocaleString()}</span>
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
