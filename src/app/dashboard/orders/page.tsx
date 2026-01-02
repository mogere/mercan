"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ChevronRight, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  }>;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/orders");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === statusFilter);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          View and track all your product orders
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-500" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {statusFilter === "all" ? "No Orders Yet" : `No ${statusFilter} Orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === "all"
                ? "Start shopping to see your orders here"
                : "No orders match this status"}
            </p>
            {statusFilter === "all" && (
              <Link href="/shop">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Browse Products
                </Button>
              </Link>
            )}
            {statusFilter !== "all" && (
              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                View All Orders
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <CardDescription className="mt-1">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {item.product.imageUrl && (
                        <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × KES {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        KES {(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      +{order.items.length - 3} more item
                      {order.items.length - 3 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order.paymentMethod?.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-600">
                      KES {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
