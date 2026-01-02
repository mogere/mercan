"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  ShoppingBag,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
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

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  service: {
    id: number;
    name: string;
    price: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      const [ordersRes, appointmentsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/appointments"),
      ]);

      const ordersData = await ordersRes.json();
      const appointmentsData = await appointmentsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.data);
      }
      if (appointmentsData.success) {
        setAppointments(appointmentsData.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
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
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) >= new Date()
  );

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your orders and appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <Package className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Spent
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">All orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Appointments
            </CardTitle>
            <Calendar className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Orders
            </CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "pending").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Products
            </CardTitle>
            <CardDescription className="text-orange-100">
              Browse our catalog of auto parts and accessories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/shop">
              <Button variant="secondary" className="w-full">
                Browse Shop
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Book Service
            </CardTitle>
            <CardDescription className="text-blue-100">
              Schedule professional car maintenance and repairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/services">
              <Button variant="secondary" className="w-full">
                Book Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest product orders</CardDescription>
            </div>
            {orders.length > 0 && (
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link href="/shop">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
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
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-orange-600">
                      KES {order.totalAmount.toLocaleString()}
                    </p>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled service bookings</CardDescription>
            </div>
            {upcomingAppointments.length > 0 && (
              <Link href="/dashboard/appointments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No upcoming appointments</p>
              <Link href="/services">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Book Service
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      {appointment.service.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <p className="font-bold text-orange-600 mt-2">
                      KES {appointment.service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
