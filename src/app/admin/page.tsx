"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  upcomingAppointments: number;
  totalCustomers: number;
}

interface RecentOrder {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  userId: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    upcomingAppointments: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/orders?limit=5"),
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
      if (ordersData.success) {
        setRecentOrders(ordersData.data);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
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

  if (loading) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name}! Here's your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Products
            </CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.lowStockProducts} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Appointments
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingAppointments}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold">Order #{order.id}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-orange-600">
                          KES {order.totalAmount.toLocaleString()}
                        </p>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="mt-1">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats.lowStockProducts > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-900">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800 mb-3">
                  {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? "s" : ""}{" "}
                  running low on stock
                </p>
                <Link href="/admin/products?filter=low-stock">
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                    View Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products/new">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link href="/admin/orders?status=pending">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Process Orders
                </Button>
              </Link>
              <Link href="/admin/appointments">
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Appointments
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Stats */}
          <Card>
            <CardHeader>
              <CardTitle>System Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-semibold">{stats.totalCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Orders</span>
                <span className="font-semibold text-yellow-600">
                  {stats.pendingOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Products</span>
                <span className="font-semibold text-green-600">
                  {stats.totalProducts - stats.lowStockProducts}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
